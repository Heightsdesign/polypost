import os
import json
import zoneinfo
import stripe

from rest_framework import generics, permissions, viewsets, parsers, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError

from django.conf import settings
from django.utils import timezone as dj_timezone
from django.db import models
import zoneinfo


from .models import (
    MediaUpload, GeneratedCaption, CreatorProfile, 
    GlobalTrend, PlannedPostSlot, UseCaseTemplate,
    PlatformTiming, PostPerformance, Plan, 
    Subscription, Draft, MediaUpload, GeneratedCaption,
    MonthlyUsage, PostingReminder, Notification
    )

from .serializers import (
    MediaUploadSerializer, RegisterSerializer, CaptionGenerateSerializer,
    GeneratedCaptionSerializer, PlannedPostSlotSerializer, CreatorProfileSerializer,
    PostPerformanceSerializer, DraftSerializer, UseCaseTemplateSerializer,
    PostingReminderSerializer, NotificationSerializer, PlanSerializer
    )

from .utils import (
    build_caption_prompt, get_seasonal_hooks, get_floating_event_hooks,
    get_trending_stub_hooks, get_or_create_free_plan, get_user_plan, generate_idea_action_plan
    )

from .utils import check_usage_allowed, increment_usage, send_postly_email

from .geo_utils import get_country_code_from_ip, language_from_country_code

from django.contrib.auth.models import User
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse, JsonResponse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings



from openai import OpenAI
from datetime import date, datetime, timedelta, timezone as dt_timezone
from decimal import Decimal, ROUND_HALF_UP

from .scheduling_utils import generate_posting_suggestions, generate_ai_posting_plan
from .email_templates import get_email_text, normalize_lang_code

from .tasks import send_postly_email_task


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # or use decouple
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

CURRENCY_MAP = {
    "USD": {"symbol": "$"},
    "EUR": {"symbol": "€"},
    "MXN": {"symbol": "Mex$"},  # Mexican Peso
    "BRL": {"symbol": "R$"},    # Brazilian Real
    "CAD": {"symbol": "C$"},    # Canadian Dollar
    "AUD": {"symbol": "A$"},    # Australian Dollar
}

# Countries for each currency
EUR_COUNTRIES = {
    "FR", "DE", "ES", "IT", "NL", "BE", "PT", "IE", "AT", "FI", "LU",
    "SI", "SK", "EE", "LV", "LT", "GR", "CY", "MT"
}

MXN_COUNTRY = {"MX"}
BRL_COUNTRY = {"BR"}
CAD_COUNTRY = {"CA"}
AUD_COUNTRY = {"AU"}


def _get_ip_from_request(request) -> str | None:
    """
    Best-effort IP extraction. Mirror what you do in DetectLanguageView.
    """
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        # first IP in the list
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def get_request_lang(request, explicit_lang: str | None = None) -> str:
    """
    Resolve language for AI outputs.

    Priority:
    1) explicit_lang (e.g. from request.data["preferred_language"])
    2) CreatorProfile.preferred_language for authenticated user
    3) IP-based detection (for anonymous users)
    4) fallback to 'en'
    """
    lang = explicit_lang
    profile_lang = None
    ip_lang = None

    user = getattr(request, "user", None)

    # 1) Explicit param wins
    if lang:
        resolved = normalize_lang_code(lang)
        print(f"[AI_LANG] explicit={lang!r} profile=None ip=None -> resolved={resolved}")
        return resolved

    # 2) CreatorProfile for logged-in users
    if user is not None and user.is_authenticated:
        profile = CreatorProfile.objects.filter(user=user).first()
        if profile and getattr(profile, "preferred_language", None):
            profile_lang = profile.preferred_language
            resolved = normalize_lang_code(profile_lang)
            print(f"[AI_LANG] explicit=None profile={profile_lang!r} ip=None -> resolved={resolved}")
            return resolved

    # 3) Anonymous / pre-signup: use IP detection
    try:
        ip = _get_ip_from_request(request)
        if settings.DEBUG and not ip:
            # Optional: you can force a sample IP here while debugging
            # ip = "81.185.76.55"
            pass

        if ip:
            country_code = get_country_code_from_ip(ip)
            ip_lang_code = language_from_country_code(country_code)
            ip_lang = ip_lang_code
            resolved = normalize_lang_code(ip_lang_code)
            print(f"[AI_LANG] explicit=None profile=None ip={ip!r}/{ip_lang!r} -> resolved={resolved}")
            return resolved
    except Exception as e:
        print(f"[AI_LANG] IP-based detection failed: {e}")

    # 4) Final fallback
    resolved = "en"
    print(f"[AI_LANG] explicit=None profile=None ip=None -> resolved={resolved}")
    return resolved


def detect_currency_from_request(request) -> str:
    """
    Detects an appropriate currency from the user's IP.
    Priorities:
    1. Fallback to regional heuristics
    2. Default to USD
    """
    ip = _get_ip_from_request(request)
    if not ip:
        return "USD"

    # ---------------------------------------------------------------
    # 1. Fallback: region-based heuristic (good enough for MVP)
    # ---------------------------------------------------------------

    # Latin America (default many countries to USD unless MX/BR handled above)
    # If you want ARS, CLP later you can expand this list.
    if request.META.get("HTTP_ACCEPT_LANGUAGE"):
        langs = request.META["HTTP_ACCEPT_LANGUAGE"].lower()
        if "es" in langs and "mx" in langs:
            return "MXN"
        if "pt" in langs:
            return "BRL"

    # EU probability fallback
    if request.META.get("HTTP_ACCEPT_LANGUAGE", "").lower().startswith(
        ("fr", "de", "es", "it", "pt", "nl")
    ):
        return "EUR"

    # Canada fallback
    if "ca" in request.META.get("HTTP_ACCEPT_LANGUAGE", "").lower():
        return "CAD"

    # Australia fallback
    if "au" in request.META.get("HTTP_ACCEPT_LANGUAGE", "").lower():
        return "AUD"

    # ---------------------------------------------------------------
    # 2. Default
    # ---------------------------------------------------------------
    return "USD"

def convert_usd_to(currency: str, usd_amount) -> Decimal:
    """
    Convert a USD base price to the user's currency,
    then apply charm pricing (e.g. 11.99, 29.99, 59, etc.).

    NOTE:
    - Keep Stripe / Plan.price_usd as the true billing value.
    - This function is ONLY for display prices in /billing/plans/.
    """
    usd = Decimal(str(usd_amount or 0))

    # Free stays free
    if usd == 0:
        return Decimal("0.00")

    # VERY rough FX rates (tune later or load from config)
    rates: dict[str, Decimal] = {
        "EUR": Decimal("0.92"),
        "MXN": Decimal("17.0"),
        "BRL": Decimal("5.0"),
        "CAD": Decimal("1.35"),
        "AUD": Decimal("1.55"),
    }

    # No conversion for USD
    if currency not in rates:
        # USD charm pricing → X.99
        base = usd.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        charm = base - Decimal("0.01")
        if charm <= 0:
            charm = Decimal("0.99")
        return charm.quantize(Decimal("0.01"))

    converted = usd * rates[currency]

    # -----------------------
    # CHARM PRICING BY REGION
    # -----------------------

    # 1) EUR / CAD / AUD → nearest whole, minus 0.01
    if currency in {"EUR", "CAD", "AUD"}:
        base = converted.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
        charm = base - Decimal("0.01")
        if charm <= 0:
            charm = Decimal("0.99")
        return charm.quantize(Decimal("0.01"))

    # 2) MXN / BRL → nearest 5, then minus 1 (e.g. 205 → 204, 200 → 199)
    if currency in {"MXN", "BRL"}:
        five = (
            (converted / Decimal("5"))
            .quantize(Decimal("1"), rounding=ROUND_HALF_UP)
            * Decimal("5")
        )
        charm = five - Decimal("1")
        if charm <= 0:
            charm = Decimal("4.99")
        return charm.quantize(Decimal("0.01"))

    # Fallback: 0.99 style
    base = converted.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
    charm = base - Decimal("0.01")
    if charm <= 0:
        charm = Decimal("0.99")
    return charm.quantize(Decimal("0.01"))


class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create user (inactive)
        user = serializer.save()
        user.is_active = False
        user.save()

        # Figure out language from payload (preferred_language collected in StepBasics)
        raw_lang = serializer.validated_data.get("preferred_language", "en")
        from .email_templates import normalize_lang_code
        lang = normalize_lang_code(raw_lang)

        # Generate confirmation values
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        frontend_base = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        confirm_url = f"{frontend_base}/confirm-email?uid={uid}&token={token}"

        # Multilingual copy
        email_copy = get_email_text("confirm_account", lang)

        send_postly_email(
            to_email=user.email,
            subject=email_copy["subject"],
            message_text=email_copy["message"],
            button_text=email_copy["button_text"],
            button_url=confirm_url,
            lang=lang,
            fail_silently=True,
        )

        return Response(
            {
                "detail": "Account created. Check your email inbox for the confirmation link.",
                "username": user.username,
            },
            status=status.HTTP_201_CREATED,
        )

class MeProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CreatorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [
        parsers.JSONParser,          # 👈 REQUIRED for JSON body
        parsers.MultiPartParser,
        parsers.FormParser,
    ]

    def get_object(self):
        return CreatorProfile.objects.get(user=self.request.user)



class MediaUploadViewSet(viewsets.ModelViewSet):
    queryset = MediaUpload.objects.all()
    serializer_class = MediaUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        # user-scoped
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        plan = get_user_plan(user)
        file_obj = self.request.FILES.get("file")

        # 1) per-file size limit
        if file_obj:
            max_bytes = (plan.max_media_size_mb or 0) * 1024 * 1024
            if max_bytes and file_obj.size > max_bytes:
                raise ValidationError(
                    {
                        "detail": (
                            f"This file is too large for your current plan. "
                            f"Max allowed size: {plan.max_media_size_mb} MB."
                        )
                    }
                )

        # 2) monthly uploads quota
        if not check_usage_allowed(user, "media_upload", amount=1):
            raise ValidationError(
                {
                    "detail": (
                        "You've reached your monthly upload limit "
                        "for your current plan. Upgrade to upload more media."
                    )
                }
            )

        # Save if everything is OK
        serializer.save(user=user)

class GenerateCaptionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CaptionGenerateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        media = serializer.validated_data["media"]

        CAPTIONS_PER_CALL = 1
        if not check_usage_allowed(request.user, "caption", amount=CAPTIONS_PER_CALL):
            return Response(
                {"detail": "Caption limit reached for your plan. Upgrade to Pro."},
                status=403,
            )

        platform = request.data.get("platform", "instagram")

        # 🔥 NEW: resolve language from explicit param or profile
        raw_lang = request.data.get("preferred_language")
        lang = get_request_lang(request, raw_lang)

        profile = CreatorProfile.objects.filter(user=request.user).first()
        base_prompt = build_caption_prompt(profile, media, platform=platform)

        prompt = (
            base_prompt
            + "\n\n"
            + f"IMPORTANT: The final caption MUST be written in the language with ISO code '{lang}'. "
              "Do NOT explain the language choice, just output the caption text."
        )

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a social-media caption generator. "
                        "You MUST always follow the requested language instructions."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=80,
        )
        caption_text = completion.choices[0].message.content.strip()

        caption_obj, _ = GeneratedCaption.objects.update_or_create(
            media=media,
            defaults={"text": caption_text, "is_user_edited": False},
        )
        increment_usage(request.user, "caption", amount=CAPTIONS_PER_CALL)
        return Response(GeneratedCaptionSerializer(caption_obj).data, status=status.HTTP_201_CREATED)

class GenerateIdeasView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = CreatorProfile.objects.filter(user=user).first()

        IDEAS_PER_CALL = 5

        # ---------------------------------------------------------------------
        # 1. Plan usage check
        # ---------------------------------------------------------------------
        if not check_usage_allowed(user, "idea", amount=IDEAS_PER_CALL):
            return Response(
                {"detail": "Idea limit reached for your plan. Upgrade to Pro."},
                status=403,
            )

        # ---------------------------------------------------------------------
        # 2. Core profile context
        # ---------------------------------------------------------------------
        platform = request.data.get("platform") or getattr(
            profile, "default_platform", "instagram"
        )
        lang = getattr(profile, "preferred_language", "en")
        location = ", ".join(filter(None, [profile.city, profile.country]))

        vibe = getattr(profile, "vibe", "fun")
        tone = getattr(profile, "tone", "casual")
        niche = getattr(profile, "niche", "general creator")
        audience = getattr(profile, "target_audience", "followers")

        # ---------------------------------------------------------------------
        # 3. Collect trend data and hooks
        # ---------------------------------------------------------------------
        today = date.today()
        seasonal = get_seasonal_hooks(today)
        floating = get_floating_event_hooks(today)
        stub_trends = get_trending_stub_hooks()

        latest_trends = list(GlobalTrend.objects.order_by("-fetched_at")[:10])
        trending_labels = [
            f"{t.platform}: {t.title}" for t in latest_trends if t.title
        ]

        # ---------------------------------------------------------------------
        # 4. Build localized AI prompt
        # ---------------------------------------------------------------------
        lines = [
            "You are a social media content strategist.",
            f"Platform to create for: {platform}.",
            "",
            f"Creator vibe: {vibe}",
            f"Creator tone: {tone}",
            f"Creator niche: {niche}",
            f"Target audience: {audience}",
            "",
            f"Language: {lang.upper()}",
        ]
        if location:
            lines.append(f"Location context: {location}")

        lines.append("")
        lines.append("We have some FRESH trends from our database. PRIORITIZE these:")
        if trending_labels:
            lines += [f"- {h}" for h in trending_labels]
        else:
            lines.append("- (no DB trends available, use general social media inspiration)")

        lines.append("")
        lines.append("Seasonal / recurring hooks (use only if relevant):")
        for h in (seasonal + floating + stub_trends):
            lines.append(f"- {h}")

        lines.append("")
        lines.append(
            "INSTRUCTIONS:\n"
            "- Generate EXACTLY 5 ideas.\n"
            "- At least 2 ideas MUST come from the latest DB trends above.\n"
            "- Avoid repetitive or generic holiday content unless trends are empty.\n"
            "- Keep ideas aligned with the creator's tone and niche.\n"
            "- If location is provided, use culturally relevant examples or slang.\n"
            "- Return ONLY JSON (array of 5 objects). No markdown, no commentary.\n"
            "- Each object must have: title, description, suggested_caption_starter, hook_used, personal_twist."
        )

        prompt = "\n".join(lines)

        # ---------------------------------------------------------------------
        # 5. OpenAI call
        # ---------------------------------------------------------------------
        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You generate creative social media ideas."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=650,
            )
            raw = completion.choices[0].message.content.strip()
        except Exception as e:
            return Response(
                {"detail": f"OpenAI error: {e}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # ---------------------------------------------------------------------
        # 6. Parse response (JSON or fallback)
        # ---------------------------------------------------------------------
        ideas = raw
        try:
            ideas = json.loads(raw)
        except Exception:
            pass  # If model returns text instead of JSON, fallback to raw

        increment_usage(user, "idea", amount=IDEAS_PER_CALL)
        return Response({"ideas": ideas}, status=status.HTTP_200_OK)
    
    
class PostingSuggestionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        profile = CreatorProfile.objects.filter(user=request.user).first()
        platform = request.query_params.get("platform") or getattr(profile, "primary_platform", "instagram")
        timezone_str = getattr(profile, "timezone", "UTC")

        suggestions = generate_posting_suggestions(platform, timezone_str)
        return Response({"platform": platform, "suggestions": suggestions}, status=status.HTTP_200_OK)


class PlanSlotView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = CreatorProfile.objects.filter(user=user).first()

        platform = request.data.get("platform")
        scheduled_at_str = request.data.get("scheduled_at")
        title = request.data.get("title", "")
        notify = bool(request.data.get("notify", False))

        if not platform or not scheduled_at_str:
            return Response(
                {"detail": "platform and scheduled_at are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # parse client datetime
        dt_local = parse_datetime(scheduled_at_str)
        if dt_local is None:
            return Response(
                {"detail": "scheduled_at must be ISO datetime"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # figure out user timezone (fallback UTC)
        user_tz_name = getattr(profile, "timezone", None) or "UTC"
        try:
            user_tz = zoneinfo.ZoneInfo(user_tz_name)
        except Exception:
            user_tz = zoneinfo.ZoneInfo("UTC")

        # if dt came without tz, assume user's tz
        if dt_local.tzinfo is None:
            dt_local = dt_local.replace(tzinfo=user_tz)

        dt_utc = dt_local.astimezone(zoneinfo.ZoneInfo("UTC"))

        # don't allow scheduling in the past
        if dt_utc < dt_timezone.now():
            return Response(
                {"detail": "scheduled_at is in the past"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        slot = PlannedPostSlot.objects.create(
            user=user,
            platform=platform,
            scheduled_at=dt_utc,
            title=title,
            notify=notify,
        )

        return Response(PlannedPostSlotSerializer(slot).data, status=status.HTTP_201_CREATED)


class MyPlannedSlotsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        # we can filter future ones
        qs = PlannedPostSlot.objects.filter(user=user, scheduled_at__gte=dt_timezone.now()).order_by("scheduled_at")
        data = PlannedPostSlotSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)
    


class SchedulerSuggestionsView(views.APIView):
    """
    Returns best posting times for the next N days (default 3),
    based on PlatformTiming, for the current user.
    Marks slots that the user already saved.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        profile = CreatorProfile.objects.filter(user=user).first()

        platform = request.GET.get("platform")  # e.g. "instagram"
        days = int(request.GET.get("days", 3))

        # user timezone (for nice display)
        user_tz_name = getattr(profile, "timezone", None) or "UTC"
        try:
            user_tz = zoneinfo.ZoneInfo(user_tz_name)
        except Exception:
            user_tz = zoneinfo.ZoneInfo("UTC")

        today = dt_timezone.now().date()

        result_days = []

        for offset in range(days):
            day_date = today + timedelta(days=offset)
            weekday = day_date.weekday()  # 0=Mon

            # get timings for that weekday
            qs = PlatformTiming.objects.filter(day_of_week=weekday)
            if platform:
                qs = qs.filter(platform=platform)

            # build datetime slots in user's tz
            slots = []
            for timing in qs:
                # create a datetime in user's tz
                # start from user's local date at given hour
                naive_local = datetime(
                    year=day_date.year,
                    month=day_date.month,
                    day=day_date.day,
                    hour=timing.hour,
                    minute=0,
                    second=0,
                )
                local_dt = naive_local.replace(tzinfo=user_tz)
                utc_dt = local_dt.astimezone(zoneinfo.ZoneInfo("UTC"))

                # is there already a planned slot at this time?
                already = PlannedPostSlot.objects.filter(
                    user=user,
                    platform=timing.platform,
                    scheduled_at=utc_dt,
                ).exists()

                slots.append({
                    "platform": timing.platform,
                    "time": local_dt.strftime("%H:%M"),
                    "datetime": local_dt.isoformat(),
                    "engagement_score": timing.engagement_rate,
                    "saved": already,
                })

            # sort slots by hour
            slots = sorted(slots, key=lambda s: s["time"])

            result_days.append({
                "date": day_date.isoformat(),
                "slots": slots,
            })

        return Response({
            "platform": platform or "all",
            "days": result_days,
        }, status=status.HTTP_200_OK)


class AnalyticsIngestView(views.APIView):
    """
    Endpoint for adding or updating post performance stats.
    Used by external sync jobs or browser extensions.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data["user"] = request.user.id  # ensure ownership

        # optional: parse posted_at if string
        posted_at = data.get("posted_at")
        if posted_at and isinstance(posted_at, str):
            data["posted_at"] = parse_datetime(posted_at)

        serializer = PostPerformanceSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        performance = serializer.save(user=request.user)
        return Response(
            PostPerformanceSerializer(performance).data,
            status=status.HTTP_201_CREATED,
        )

    def get(self, request, *args, **kwargs):
        """Return latest performance metrics for the authenticated user."""
        qs = PostPerformance.objects.filter(user=request.user).order_by("-created_at")[:50]
        data = PostPerformanceSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)


    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from .models import Subscription, Plan


class MySubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sub = (
            Subscription.objects
            .filter(user=request.user)
            .select_related("plan")
            .first()
        )

        # No subscription or completely inactive => treat as free
        if not sub or not sub.is_active() or not sub.plan:
            free_plan = Plan.objects.filter(slug="free").first()
            return Response(
                {
                    "plan": free_plan.slug if free_plan else "free",
                    "plan_name": free_plan.name if free_plan else "Free",
                    "is_active": False,
                    "will_cancel_at_period_end": False,
                    "current_period_end": None,
                }
            )

        # Active subscription
        return Response(
            {
                "plan": sub.plan.slug,              # e.g. "monthly", "quarterly", "yearly"
                "plan_name": sub.plan.name,         # e.g. "Pro – Monthly"
                "is_active": sub.is_active(),       # True while end_date in future
                "will_cancel_at_period_end": getattr(
                    sub, "will_cancel_at_period_end", False
                ),
                "current_period_end": sub.end_date,  # DRF will serialize as ISO string
            }
        )


class DraftListCreateView(generics.ListCreateAPIView):
    """
    GET /api/drafts/         -> list my drafts (pinned first)
    POST /api/drafts/        -> create a draft (from idea OR from media)
    """
    serializer_class = DraftSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Draft.objects.filter(user=self.request.user, archived=False)
        limit = self.request.query_params.get("limit")
        if limit:
            return qs[: int(limit)]
        return qs

    def perform_create(self, serializer):
        user = self.request.user

        # 🚦 plan-based draft limit
        if not check_usage_allowed(user, "draft", amount=1):
            raise ValidationError(
                {
                    "detail": (
                        "You've reached the maximum number of drafts allowed on your plan. "
                        "Archive or delete some drafts, or upgrade to keep more."
                    )
                }
            )

        serializer.save(user=user)



class DraftPinView(APIView):
    """
    POST /api/drafts/<id>/pin/
    POST /api/drafts/<id>/unpin/
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        action = request.data.get("action", "pin")
        try:
            draft = Draft.objects.get(id=pk, user=request.user)
        except Draft.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        draft.pinned = (action == "pin")
        draft.save()
        return Response({"pinned": draft.pinned})


class DraftArchiveView(APIView):
    """
    POST /api/drafts/<id>/archive/
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        try:
            draft = Draft.objects.get(id=pk, user=request.user)
        except Draft.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        draft.archived = True
        draft.save()
        return Response({"archived": True})

class UseCaseTemplateListView(generics.ListAPIView):
    """
    Public endpoint: list all use case templates.
    Frontend will show them as cards / presets.
    """
    queryset = UseCaseTemplate.objects.all()
    serializer_class = UseCaseTemplateSerializer
    permission_classes = [permissions.AllowAny]

class ApplyUseCaseTemplateView(views.APIView):
    """
    Apply a given UseCaseTemplate to the current user's CreatorProfile.
    Overwrites only the relevant fields.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        template_id = request.data.get("template_id")

        if not template_id:
            return Response(
                {"detail": "template_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            template = UseCaseTemplate.objects.get(id=template_id)
        except UseCaseTemplate.DoesNotExist:
            return Response(
                {"detail": "Template not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        profile, _ = CreatorProfile.objects.get_or_create(user=request.user)

        # fields we'll copy from template → profile
        copy_fields = [
            "vibe",
            "tone",
            "niche",
            "target_audience",
            "preferred_language",
            "country",
            "city",
            "always_add_emojis",
            "always_add_cta",
            "default_platform",
        ]

        for field in copy_fields:
            # get value from template
            value = getattr(template, field, None)
            # only overwrite if template actually has a value
            if value is not None:
                setattr(profile, field, value)

        profile.save()

        return Response(
    {
        "detail": "Template applied to your profile.",
        "profile": {
            "vibe": profile.vibe,
            "tone": profile.tone,
            "niche": profile.niche,
            "target_audience": profile.target_audience,
            "preferred_language": profile.preferred_language,
            "country": profile.country,
            "city": profile.city,
            "default_platform": profile.default_platform,
        },
    },
    status=status.HTTP_200_OK,
)
# api/views.py
class StripeCheckoutSessionView(views.APIView):
    """
    POST /api/billing/create-checkout-session/
    Body: { "plan_slug": "<slug>" }   # preferred
    (or legacy: { "plan_id": <id> })
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        plan_slug = request.data.get("plan_slug")
        plan_id = request.data.get("plan_id")  # optional fallback

        if not plan_slug and not plan_id:
            return Response(
                {"detail": "You must provide plan_slug (or plan_id)."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Prefer slug (stable across environments)
        try:
            if plan_slug:
                plan = Plan.objects.get(slug=plan_slug)
            else:
                plan = Plan.objects.get(id=plan_id)
        except Plan.DoesNotExist:
            return Response(
                {"detail": "Invalid plan."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # FREE PLAN: no Stripe checkout, just assign locally
        if plan.price_usd == 0 or not plan.stripe_price_id:
            Subscription.objects.update_or_create(
                user=user,
                defaults={
                    "plan": plan,
                    "end_date": None,
                },
            )
            return Response(
                {"detail": "Free plan activated. No payment needed."},
                status=status.HTTP_200_OK,
            )

        # PAID PLANS: create Stripe Checkout session
        base_frontend = settings.STRIPE_FRONTEND_URL.rstrip("/")
        success_url = f"{base_frontend}/billing/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{base_frontend}/billing/cancelled"

        try:
            checkout_session = stripe.checkout.Session.create(
                mode="subscription",
                payment_method_types=["card"],
                customer_email=user.email,
                line_items=[
                    {
                        "price": plan.stripe_price_id,
                        "quantity": 1,
                    }
                ],
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "user_id": str(user.id),
                    "plan_slug": plan.slug,
                },
            )
        except Exception as e:
            return Response(
                {"detail": f"Stripe error: {e}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response({"checkout_url": checkout_session.url}, status=status.HTTP_200_OK)
    
@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(views.APIView):
    permission_classes = []  # Stripe itself calls this; no auth

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=sig_header,
                secret=webhook_secret,
            )
        except ValueError:
            return Response(status=400)
        except stripe.error.SignatureVerificationError:
            return Response(status=400)

        event_type = event["type"]
        data = event["data"]["object"]

        # 1) Checkout completed: create or update local Subscription
        if event_type == "checkout.session.completed":
            if data.get("mode") != "subscription":
                return Response(status=200)

            metadata = data.get("metadata", {}) or {}
            user_id = metadata.get("user_id")
            stripe_sub_id = data.get("subscription")
            if not (user_id and stripe_sub_id):
                return Response(status=200)

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(status=200)

            stripe_sub = stripe.Subscription.retrieve(stripe_sub_id)

            items = stripe_sub.get("items", {}).get("data", [])
            price_id = items[0]["price"]["id"] if items else None
            plan = None
            if price_id:
                plan = Plan.objects.filter(stripe_price_id=price_id).first()

            period_end_ts = stripe_sub.get("current_period_end")
            end_date = (
                datetime.fromtimestamp(period_end_ts, tz=dt_timezone.utc)
                if period_end_ts
                else None
            )

            start_ts = stripe_sub.get("start_date")
            start_date = (
                datetime.fromtimestamp(start_ts, tz=dt_timezone.utc)
                if start_ts
                else dj_timezone.now()
            )

            cancel_at_period_end = bool(stripe_sub.get("cancel_at_period_end", False))

            Subscription.objects.update_or_create(
                user=user,
                defaults={
                    "plan": plan,
                    "stripe_subscription_id": stripe_sub_id,
                    "start_date": start_date,
                    "end_date": end_date,
                    "will_cancel_at_period_end": cancel_at_period_end,
                },
            )

        # 2) Subscription updated (renewal, cancel_at_period_end toggled, plan swaps…)
        elif event_type == "customer.subscription.updated":
            stripe_sub_id = data["id"]
            try:
                sub_obj = Subscription.objects.get(stripe_subscription_id=stripe_sub_id)
            except Subscription.DoesNotExist:
                return Response(status=200)

            period_end_ts = data.get("current_period_end")
            end_date = (
                datetime.fromtimestamp(period_end_ts, tz=dt_timezone.utc)
                if period_end_ts
                else None
            )

            cancel_at_period_end = bool(data.get("cancel_at_period_end", False))

            # Optionally update plan in case of upgrade/downgrade
            items = data.get("items", {}).get("data", [])
            price_id = items[0]["price"]["id"] if items else None
            if price_id:
                plan = Plan.objects.filter(stripe_price_id=price_id).first()
            else:
                plan = None

            if plan:
                sub_obj.plan = plan

            sub_obj.end_date = end_date
            sub_obj.will_cancel_at_period_end = cancel_at_period_end
            sub_obj.save()

        # 3) Subscription deleted (immediate cancellation on Stripe side)
        elif event_type == "customer.subscription.deleted":
            stripe_sub_id = data["id"]
            try:
                sub_obj = Subscription.objects.get(stripe_subscription_id=stripe_sub_id)
            except Subscription.DoesNotExist:
                return Response(status=200)

            sub_obj.end_date = dj_timezone.now()
            sub_obj.will_cancel_at_period_end = False
            sub_obj.save()

        return Response(status=200)


class UsageSummaryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        now = dj_timezone.now()

        usage, _ = MonthlyUsage.objects.get_or_create(
            user=user,
            year=now.year,
            month=now.month,
            defaults={"ideas_used": 0, "captions_used": 0},
        )

        plan = get_user_plan(user)  # 👈 this will fallback to free plan

        # Core quota
        ideas_limit = plan.ideas_per_month or 0
        captions_limit = plan.captions_per_month or 0

        # Drafts (total active, not archived)
        drafts_used = Draft.objects.filter(user=user, archived=False).count()
        drafts_limit = getattr(plan, "drafts_limit", 0) or 0

        # Media uploads this month
        uploads_used = MediaUpload.objects.filter(
            user=user,
            uploaded_at__year=now.year,
            uploaded_at__month=now.month,
        ).count()
        uploads_limit = getattr(plan, "media_uploads_per_month", 0) or 0

        # Posting reminders this month
        reminders_used = PostingReminder.objects.filter(
            user=user,
            scheduled_at__year=now.year,
            scheduled_at__month=now.month,
        ).count()
        reminders_limit = getattr(plan, "posting_reminders_per_month", 0) or 0

        data = {
            # Ideas / captions
            "ideas_used": usage.ideas_used,
            "ideas_limit": ideas_limit,
            "captions_used": usage.captions_used,
            "captions_limit": captions_limit,

            # Drafts
            "drafts_used": drafts_used,
            "drafts_limit": drafts_limit,

            # Media uploads
            "media_uploads_used": uploads_used,
            "media_uploads_limit": uploads_limit,

            # Reminders
            "reminders_used": reminders_used,
            "reminders_limit": reminders_limit,
        }
        return Response(data, status=status.HTTP_200_OK)

    
class PostingReminderListCreateView(generics.ListCreateAPIView):
    """
    GET /api/schedule/reminders/      -> list my reminders (optionally filtered by date range)
    POST /api/schedule/reminders/     -> create a reminder
    """
    serializer_class = PostingReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = PostingReminder.objects.filter(user=self.request.user)

        start = self.request.query_params.get("start")
        end = self.request.query_params.get("end")

        if start:
            try:
                start_dt = datetime.fromisoformat(start)
                qs = qs.filter(scheduled_at__gte=start_dt)
            except Exception:
                pass

        if end:
            try:
                end_dt = datetime.fromisoformat(end)
                qs = qs.filter(scheduled_at__lte=end_dt)
            except Exception:
                pass

        return qs

    def perform_create(self, serializer):
        user = self.request.user

        # 🚦 plan-based reminders limit (per month)
        if not check_usage_allowed(user, "reminder", amount=1):
            raise ValidationError(
                {
                    "detail": (
                        "You've reached your monthly limit of scheduled reminders "
                        "for your current plan."
                    )
                }
            )

        serializer.save(user=user)

class AIPostingPlanView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = CreatorProfile.objects.filter(user=user).first()

        platform = request.data.get("platform", "instagram")

        # We accept `days` for future tuning but don't use it yet.
        try:
            _days = int(request.data.get("days", 7))
        except (TypeError, ValueError):
            _days = 7  # noqa

        # Let the helper decide posts_per_week (based on profile/goal)
        plan_slots = generate_ai_posting_plan(
            profile=profile,
            platform=platform,
            posts_per_week=None,
        )

        if not plan_slots:
            # fallback safety: 4 posts/week
            plan_slots = generate_ai_posting_plan(
                profile=profile,
                platform=platform,
                posts_per_week=4,
            )

        # user timezone (for interpreting naive datetimes)
        tz_name = getattr(profile, "timezone", None) or "UTC"
        try:
            user_tz = zoneinfo.ZoneInfo(tz_name)
        except Exception:
            user_tz = zoneinfo.ZoneInfo("UTC")

        now_utc = dt_timezone.now()
        valid_slots = []

        # 1️⃣ First pass: normalize datetimes + filter out past ones
        for slot in plan_slots:
            dt_str = slot.get("scheduled_at") or slot.get("datetime")
            if not dt_str:
                continue

            dt_local = parse_datetime(dt_str)
            if dt_local is None:
                continue

            if dt_local.tzinfo is None:
                dt_local = dt_local.replace(tzinfo=user_tz)

            dt_utc = dt_local.astimezone(zoneinfo.ZoneInfo("UTC"))

            if dt_utc < now_utc:
                continue

            plat = slot.get("platform", platform)
            title = slot.get("title") or "Planned post"
            notify_flag = bool(slot.get("notify", True))
            note_text = slot.get("note") or title or "Planned post"

            valid_slots.append(
                {
                    "scheduled_at": dt_utc,
                    "platform": plat,
                    "title": title,
                    "notify": notify_flag,
                    "note": note_text,
                }
            )

        # 2️⃣ Check plan limit for reminders (all new slots at once)
        if valid_slots:
            if not check_usage_allowed(user, "reminder", amount=len(valid_slots)):
                return Response(
                    {
                        "detail": (
                            "This posting plan would exceed your monthly limit of scheduled reminders "
                            "for your current plan."
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        created_slots = []

        # 3️⃣ Second pass: actually create PlannedPostSlot + PostingReminder
        for vs in valid_slots:
            planned_slot, _ = PlannedPostSlot.objects.get_or_create(
                user=user,
                platform=vs["platform"],
                scheduled_at=vs["scheduled_at"],
                defaults={
                    "title": vs["title"],
                    "notify": vs["notify"],
                },
            )

            # Create matching calendar reminder
            reminder, _ = PostingReminder.objects.get_or_create(
                user=user,
                scheduled_at=planned_slot.scheduled_at,
                defaults={
                    "platform": planned_slot.platform,
                    "note": vs["note"],
                    "notify_email": planned_slot.notify,
                },
            )

            created_slots.append(planned_slot)

        data = PlannedPostSlotSerializer(created_slots, many=True).data

        # For debugging/UX, return which platforms were used
        used_platforms = sorted({s.get("platform", platform) for s in plan_slots}) or [
            platform
        ]

        return Response(
            {
                "platforms": used_platforms,
                "created_count": len(created_slots),
                "slots": data,
            },
            status=status.HTTP_201_CREATED,
        )

    
class PostingReminderDetailView(views.APIView):
    """
    Allow the current user to delete a reminder.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, reminder_id, *args, **kwargs):
        try:
            reminder = PostingReminder.objects.get(
                id=reminder_id, user=request.user
            )
        except PostingReminder.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        reminder.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class NotificationUnreadCountView(views.APIView):
    """
    Returns the number of unread notifications for the current user.
    Shape matches the navbar expectation: { "unread": <int> }
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        count = Notification.objects.filter(
            user=request.user,
            read_at__isnull=True,
        ).count()
        return Response({"unread": count}, status=status.HTTP_200_OK)


class NotificationListView(views.APIView):
    """
    Simple list of notifications for the current user.
    You can later add pagination / mark-as-read etc.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        qs = Notification.objects.filter(user=request.user).order_by("-created_at")[:50]
        serializer = NotificationSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class IdeaActionPlanView(views.APIView):
    """
    Turn a generated idea into a concrete execution plan.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = CreatorProfile.objects.filter(user=user).first()

        idea = request.data.get("idea") or {}
        # fallback to profile's default_platform like in GenerateIdeasView
        platform = request.data.get("platform") or getattr(
            profile, "default_platform", "instagram"
        )

        if not isinstance(idea, dict) or not idea:
            return Response(
                {"detail": "idea field (object) is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 🔥 resolve language (payload -> profile -> IP / default)
        raw_lang = request.data.get("preferred_language")
        lang = get_request_lang(request, raw_lang)

        plan = generate_idea_action_plan(
            profile=profile,
            idea=idea,
            platform=platform,
            lang=lang,
        )

        return Response(plan, status=status.HTTP_200_OK)
    
class BioVariantsView(views.APIView):
    """
    POST /api/brand/bio-variants/

    Expects:
    {
      "base_bio": "string",
      "platform": "instagram" | ... (optional)
      "preferred_language": "en" | "fr" | ... (optional)
      "niche": "fitness" (optional)
      "target_audience": "Gen Z women" (optional)
      "vibe": "Fun" (optional)
      "tone": "Playful" (optional)
      "creator_stage": "starter" | ... (optional)
    }

    Returns JSON object with:
    {
      "short_bio": "...",
      "long_bio": "...",
      "cta_bio": "...",
      "fun_bio": "..."
    }
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = CreatorProfile.objects.filter(user=user).first()

        base_bio = request.data.get("base_bio", "").strip()
        if not base_bio:
            return Response(
                {"detail": "base_bio is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        platform = request.data.get("platform") or "instagram"

        # 🔥 Same logic as GenerateIdeasView / ActionPlan
        profile_lang = getattr(profile, "preferred_language", None) or "en"
        override_lang = request.data.get("preferred_language") or None
        lang = (override_lang or profile_lang).lower()

        print(f"[BIO_LANG] profile={profile_lang!r} override={override_lang!r} -> used={lang!r}")

        niche = request.data.get("niche") or ""
        target = request.data.get("target_audience") or ""
        vibe = request.data.get("vibe") or ""
        tone = request.data.get("tone") or ""
        stage = request.data.get("creator_stage") or ""

        context_bits = []
        if niche:
            context_bits.append(f"niche: {niche}")
        if target:
            context_bits.append(f"target audience: {target}")
        if vibe:
            context_bits.append(f"vibe: {vibe}")
        if tone:
            context_bits.append(f"tone: {tone}")
        if stage:
            context_bits.append(f"creator stage: {stage}")

        context_str = "; ".join(context_bits) if context_bits else "no extra info"

        try:
            completion = client.chat.completions.create(
                model="gpt-4.1-mini",
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a social media branding assistant. "
                            "Given an existing bio and some creator context, "
                            "you generate multiple variants of that bio.\n\n"
                            "Return a *single* JSON object with these keys:\n"
                            "- short_bio: a concise 1–2 line version.\n"
                            "- long_bio: a 3–4 line version with more detail.\n"
                            "- cta_bio: a version optimized around a strong call to action.\n"
                            "- fun_bio: a playful, witty version.\n"
                            "Do not wrap it in any additional text, only valid JSON.\n\n"
                            f"IMPORTANT: All text in all fields MUST be written in the language "
                            f"with ISO code '{lang}'. Do NOT use English if '{lang}' is not 'en'."
                        ),
                    },
                    {
                        "role": "user",
                        "content": (
                            f"Platform: {platform}\n"
                            f"Language (ISO code): {lang}\n"
                            f"Context: {context_str}\n\n"
                            f"Base bio:\n{base_bio}"
                        ),
                    },
                ],
            )

            raw_content = completion.choices[0].message.content

            try:
                parsed = json.loads(raw_content)
            except json.JSONDecodeError:
                return Response(
                    {
                        "detail": "Model did not return valid JSON.",
                        "raw": raw_content,
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            result = {
                "short_bio": parsed.get("short_bio", "").strip(),
                "long_bio": parsed.get("long_bio", "").strip(),
                "cta_bio": parsed.get("cta_bio", "").strip(),
                "fun_bio": parsed.get("fun_bio", "").strip(),
            }

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"detail": f"OpenAI error: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class DetectLanguageView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip

    def get(self, request, *args, **kwargs):
        if settings.DEBUG:
            # Dev-only: force a test IP so you can see language switching locally
            ip = "81.185.76.55"  # French IP for testing
        else:
            ip = self.get_client_ip(request)

        country_code = get_country_code_from_ip(ip)
        lang = language_from_country_code(country_code)

        return Response({"language": lang}, status=status.HTTP_200_OK)

class PlanListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        currency = detect_currency_from_request(request)
        plans = Plan.objects.filter(slug__in=["free", "monthly", "quarterly", "yearly"]).order_by("id")

        data = []
        for p in plans:
            local_price = convert_usd_to(currency, p.price_usd)
            symbol = CURRENCY_MAP.get(currency, CURRENCY_MAP["USD"])["symbol"]
            data.append(
                {
                    "id": p.id,
                    "slug": p.slug,
                    "name": p.name,
                    "price": f"{local_price:.2f}",
                    "currency": currency,
                    "currency_symbol": symbol,
                    # optional: quota info if you want
                    "ideas_per_month": p.ideas_per_month,
                    "captions_per_month": p.captions_per_month,
                    "drafts_limit": p.drafts_limit,
                    "media_uploads_per_month": p.media_uploads_per_month,
                    "posting_reminders_per_month": p.posting_reminders_per_month,
                    "max_upload_mb": p.max_upload_mb,
                    "max_video_seconds": p.max_video_seconds,
                }
            )

        return Response(data)

class CancelSubscriptionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        sub = Subscription.objects.filter(
            user=user,
            stripe_subscription_id__isnull=False,
            plan__isnull=False,
        ).first()

        if not sub or not sub.is_active():
            return Response(
                {"detail": "No active paid subscription to cancel."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            stripe_sub = stripe.Subscription.modify(
                sub.stripe_subscription_id,
                cancel_at_period_end=True,
            )
        except Exception as e:
            return Response(
                {"detail": f"Stripe error: {e}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # Get end-of-period date from Stripe
        period_end_ts = stripe_sub.get("current_period_end")
        end_date = (
            datetime.fromtimestamp(period_end_ts, tz=dt_timezone.utc)
            if period_end_ts
            else None
        )

        sub.will_cancel_at_period_end = True
        if end_date:
            sub.end_date = end_date
        sub.save()

        # Send confirmation email
        frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173").rstrip("/")
        account_url = f"{frontend}/account"
        end_date_str = end_date.strftime("%Y-%m-%d") if end_date else ""

        send_postly_email_task.delay(
            user.email,
            "Your Polypost subscription will be cancelled",
            (
                "Hi,<br><br>"
                "This is a confirmation that your Polypost subscription will not renew.<br>"
                f"Your access to Pro features remains active until <b>{end_date_str}</b>.<br><br>"
                "You can manage your account anytime from your dashboard."
            ),
            "Manage account",
            account_url,
        )

        return Response(
            {
                "detail": "Subscription will be cancelled at the end of the current period.",
                "end_date": end_date.isoformat() if end_date else None,
            },
            status=status.HTTP_200_OK,
        )