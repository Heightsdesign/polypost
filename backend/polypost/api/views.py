import os
import json
import zoneinfo
import stripe

from rest_framework import generics, permissions, viewsets, parsers, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

from django.conf import settings

from .models import (
    MediaUpload, GeneratedCaption, CreatorProfile, 
    GlobalTrend, PlannedPostSlot, UseCaseTemplate,
    PlatformTiming, PostPerformance, Plan, 
    Subscription, Draft, MediaUpload, GeneratedCaption,
    
    )

from .serializers import (
    MediaUploadSerializer, RegisterSerializer, CaptionGenerateSerializer,
    GeneratedCaptionSerializer, PlannedPostSlotSerializer, CreatorProfileSerializer,
    PostPerformanceSerializer, DraftSerializer, UseCaseTemplateSerializer,
    )

from .utils import (
    build_caption_prompt, get_seasonal_hooks, get_floating_event_hooks,
    get_trending_stub_hooks, get_trending_topics, get_trending_movies_from_tmdb
    )

from .utils import check_usage_allowed, increment_usage

from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse, JsonResponse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings


from openai import OpenAI
from datetime import date, datetime, timedelta
from .scheduling_utils import generate_posting_suggestions


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # or use decouple
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


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

        # Generate confirmation values
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Build confirmation URL for the frontend
        frontend_base = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        confirm_url = f"{frontend_base}/confirm-email?uid={uid}&token={token}"

        subject = "Confirm your Postly account"
        message = (
            "Welcome to Postly!\n\n"
            "Please confirm your email address by clicking the link below:\n\n"
            f"{confirm_url}\n\n"
            "If you didn't create this account, just ignore this email."
        )

        send_mail(
            subject,
            message,
            getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@postly.local"),
            [user.email],
            fail_silently=True,   # avoids dev crashes if email backend not configured
        )

        return Response(
            {
                "detail": "Account created. Check your email inbox for the confirmation link.",
                "username": user.username,
            },
            status=status.HTTP_201_CREATED,
        )
    
    
class MeProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update the current user's creator profile (including avatar).
    """
    serializer_class = CreatorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_object(self):
        return CreatorProfile.objects.get(user=self.request.user)

class MediaUploadViewSet(viewsets.ModelViewSet):
    queryset           = MediaUpload.objects.all()
    serializer_class   = MediaUploadSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [parsers.MultiPartParser, parsers.FormParser]

    def get_queryset(self):
        # user-scoped
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GenerateCaptionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = CaptionGenerateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        media = serializer.validated_data["media"]

        platform = request.data.get("platform", "instagram")

        profile = CreatorProfile.objects.filter(user=request.user).first()
        prompt = build_caption_prompt(profile, media, platform=platform)

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a social-media caption generator."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=80,
        )
        caption_text = completion.choices[0].message.content.strip()

        caption_obj, _ = GeneratedCaption.objects.update_or_create(
            media=media,
            defaults={"text": caption_text, "is_user_edited": False},
        )
        return Response(GeneratedCaptionSerializer(caption_obj).data, status=status.HTTP_201_CREATED)
    

class GenerateIdeasView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        profile = CreatorProfile.objects.filter(user=user).first()

        # ---------------------------------------------------------------------
        # 1. Plan usage check
        # ---------------------------------------------------------------------
        if not check_usage_allowed(user, "idea"):
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

        increment_usage(user, "idea")
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
        if dt_utc < timezone.now():
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
        qs = PlannedPostSlot.objects.filter(user=user, scheduled_at__gte=timezone.now()).order_by("scheduled_at")
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

        today = timezone.now().date()

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


    
class MySubscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sub = Subscription.objects.filter(user=request.user).first()
        if not sub or not sub.is_active():
            # return free
            plan = Plan.objects.filter(slug="free").first()
            return Response({
                "plan": plan.slug if plan else "free",
                "is_active": False,
            })

        return Response({
            "plan": sub.plan.slug if sub.plan else "free",
            "is_active": sub.is_active(),
        })


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
        serializer.save(user=self.request.user)


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

class StripeCheckoutSessionView(views.APIView):
    """
    POST /api/billing/create-checkout-session/
    Body: { "plan_id": <Plan.id> }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        plan_id = request.data.get("plan_id")

        if not plan_id:
            return Response(
                {"detail": "You must provide plan_id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            plan = Plan.objects.get(id=plan_id)
        except Plan.DoesNotExist:
            return Response(
                {"detail": "Invalid plan_id."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # FREE PLAN: no Stripe checkout, just assign locally
        if plan.price_usd == 0 or not plan.stripe_price_id:
            sub, _ = Subscription.objects.update_or_create(
                user=user,
                defaults={
                    "plan": plan,
                    # For free plan we don't need stripe_customer_id / subscription_id
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
                        "price": plan.stripe_price_id,  # <-- from Plan model
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
            # Invalid payload
            return Response(status=400)
        except stripe.error.SignatureVerificationError:
            # Invalid signature
            return Response(status=400)

        event_type = event["type"]
        data = event["data"]["object"]

        # Import here to avoid circular imports
        from .models import Subscription, SubscriptionPlan
        from django.contrib.auth.models import User

        # 1) Checkout completed: new subscription created
        if event_type == "checkout.session.completed":
            # Only handle subscription mode
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

            # Fetch subscription from Stripe to get price & period data
            sub = stripe.Subscription.retrieve(stripe_sub_id)

            # Stripe: latest invoice’s line item price id → matches SubscriptionPlan.stripe_id
            items = sub.get("items", {}).get("data", [])
            price_id = None
            if items:
                price_id = items[0]["price"]["id"]

            plan = None
            if price_id:
                plan = SubscriptionPlan.objects.filter(stripe_id=price_id).first()

            # Compute period start/end
            current_period_end = timezone.datetime.fromtimestamp(
                sub["current_period_end"], tz=timezone.utc
            )

            # Create or update Subscription
            subscription_obj, _ = Subscription.objects.update_or_create(
                user=user,
                defaults={
                    "plan": plan,
                    "stripe_sub_id": stripe_sub_id,
                    "started_at": timezone.datetime.fromtimestamp(
                        sub["start_date"], tz=timezone.utc
                    ),
                    "current_period_end": current_period_end,
                    "cancelled_at": None,
                },
            )

        # 2) Subscription updated (renewal, plan swap, etc.)
        if event_type == "customer.subscription.updated":
            stripe_sub_id = data["id"]
            try:
                subscription_obj = Subscription.objects.get(stripe_sub_id=stripe_sub_id)
            except Subscription.DoesNotExist:
                return Response(status=200)

            current_period_end = timezone.datetime.fromtimestamp(
                data["current_period_end"], tz=timezone.utc
            )

            # If canceled_at is present, set cancelled_at; otherwise clear it.
            cancelled_at_value = None
            if data.get("cancel_at_period_end"):
                # We consider it "cancelled" at the time it ends, but you could use a different rule.
                cancelled_at_ts = data.get("canceled_at")
                if cancelled_at_ts:
                    cancelled_at_value = timezone.datetime.fromtimestamp(
                        cancelled_at_ts, tz=timezone.utc
                    )

            subscription_obj.current_period_end = current_period_end
            subscription_obj.cancelled_at = cancelled_at_value
            subscription_obj.save()

        # 3) Subscription deleted (hard cancel)
        if event_type == "customer.subscription.deleted":
            stripe_sub_id = data["id"]
            try:
                subscription_obj = Subscription.objects.get(stripe_sub_id=stripe_sub_id)
            except Subscription.DoesNotExist:
                return Response(status=200)

            subscription_obj.cancelled_at = timezone.now()
            subscription_obj.save()

        return Response(status=200)
