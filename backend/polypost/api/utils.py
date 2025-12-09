
# api/utils.py
import os
import requests
import json

from datetime import date, datetime
from openai import OpenAI

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.timezone import now
from django.utils import timezone

from .email_templates import POSTLY_EMAIL_TEMPLATE, normalize_lang_code, EMAIL_FOOTER
from .models import MonthlyUsage, Subscription, Plan, Draft, MediaUpload, PostingReminder

client = OpenAI(api_key=settings.OPENAI_API_KEY)


def render_postly_email_html(
    title: str,
    message: str,
    button_text: str,
    button_url: str,
    lang: str = "en",
) -> str:
    """
    Render the branded Polypost email HTML, with language-aware footer.
    """
    lang = normalize_lang_code(lang)
    html = POSTLY_EMAIL_TEMPLATE

    html = html.replace("{{LANG}}", lang or "en")
    html = html.replace("{{TITLE}}", title)
    # turn \n into <br/> for nice paragraphs
    html = html.replace("{{MESSAGE}}", message.replace("\n", "<br/>"))
    html = html.replace("{{BUTTON_URL}}", button_url)
    html = html.replace("{{BUTTON_TEXT}}", button_text)
    html = html.replace("{{YEAR}}", str(datetime.utcnow().year))
    html = html.replace(
        "{{FOOTER_LINE}}",
        EMAIL_FOOTER.get(lang, EMAIL_FOOTER["en"]),
    )

    return html


def send_postly_email(
    to_email: str,
    subject: str,
    message_text: str,
    button_text: str,
    button_url: str,
    lang: str = "en",
    fail_silently: bool = True,
):
    """
    Reusable helper to send a branded Polypost HTML email with a button,
    plus a plain-text fallback.
    """
    from_email = getattr(
        settings,
        "DEFAULT_FROM_EMAIL",
        "no-reply@polypost-platform.com",
    )

    # normalise language
    lang = normalize_lang_code(lang)

    html_body = render_postly_email_html(
        title=subject,
        message=message_text,
        button_text=button_text,
        button_url=button_url,
        lang=lang,
    )

    # plain text fallback with link appended
    text_fallback = f"{message_text}\n\n{button_url}"

    email = EmailMultiAlternatives(
        subject=subject,
        body=text_fallback,
        from_email=from_email,
        to=[to_email],
    )
    email.attach_alternative(html_body, "text/html")

    try:
        email.send(fail_silently=fail_silently)
    except Exception:
        if not fail_silently:
            raise
        # in fail_silently=True mode, swallow SES/network errors

def get_trending_topics():
    """
    Fetch trending topics from an external API.
    This is a flexible placeholder:
    - you can hit TMDB for trending movies
    - or your own microservice that aggregates TikTok/IG trends
    - if it fails, we fall back to a static list
    """
    # Example: use your own env var for a trend API
    trend_api_url = os.getenv("TREND_API_URL")
    if trend_api_url:
        try:
            resp = requests.get(trend_api_url, timeout=4)
            if resp.status_code == 200:
                data = resp.json()
                # expect something like: {"trends": ["Dune 3 trailer", "Taylor Swift ...", ...]}
                trends = data.get("trends") or data.get("results") or []
                # normalize to strings
                return [str(t) for t in trends][:10]
        except Exception:
            pass  # fall back below

    # fallback: static
    return [
        "New movie/series everyone is talking about",
        "A currently viral TikTok sound",
        "A meme format that's being remixed",
    ]


def get_trending_movies_from_tmdb():
    tmdb_key = os.getenv("TMDB_API_KEY")
    if not tmdb_key:
        return []
    url = f"https://api.themoviedb.org/3/trending/movie/day?api_key={tmdb_key}"
    resp = requests.get(url, timeout=4)
    if resp.status_code == 200:
        data = resp.json()
        return [m["title"] for m in data.get("results", [])][:5]
    return []


def get_seasonal_hooks(today: date | None = None):
    """Yearly recurring events, based only on month/day."""
    if today is None:
        today = date.today()
    month = today.month

    hooks = []

    # Winter
    if month == 12:
        hooks += [
            "Christmas / holiday content",
            "Year-in-review carousel",
            "New Year resolutions teaser",
        ]
    # January
    if month == 1:
        hooks += [
            "New year, new goals",
            "Behind-the-scenes of upcoming content",
        ]
    # February
    if month == 2:
        hooks += [
            "Valentine's Day content / self-love",
            "Galentine's ideas",
        ]
    # October
    if month == 10:
        hooks += [
            "Halloween costumes / spooky aesthetic",
            "Fall cozy vibes",
        ]
    # November
    if month == 11:
        hooks += [
            "Thanksgiving gratitude post",
            "Black Friday / promo teaser",
        ]

    # Always-useful evergreen hooks
    hooks += [
        "Ask-your-audience Q&A",
        "Behind-the-scenes / process post",
        "Before/after or glow-up post",
        "Poll: what content do you want next?",
    ]

    return hooks


def get_floating_event_hooks(today: date | None = None):
    """
    Events that happen every year but not on the same date.
    For now it's a static approximation; later you can
    generate these from a small JSON or an external API.
    """
    if today is None:
        today = date.today()
    month = today.month

    hooks = []

    # Super Bowl: usually early February
    if month == 2:
        hooks.append("Super Bowl themed content (outfits, snacks, predictions, reactions)")

    # Champions League Final: usually late May / early June
    if month in (5, 6):
        hooks.append("Champions League final reactions / football-themed content")

    # Oscars / awards season: late Feb / March
    if month in (2, 3):
        hooks.append("Award show / red carpet reaction or 'rate this outfit' content")

    # Met Gala: early May
    if month == 5:
        hooks.append("Met Gala inspired looks / recreate the outfit challenge")

    return hooks


def get_trending_stub_hooks():
    """
    Placeholder for 'current trending' topics.
    In MVP this is hardcoded; later you can plug in a real source.
    """
    return [
        "TikTok trend: use a trending audio and adapt it to your niche",
        "React to a viral meme format of the week",
        "New movie/series drop: share a look inspired by it",
        "Do a 'POV:' style reel matching your persona",
    ]


def build_caption_prompt(profile, media_obj, platform: str = None):
    vibe = getattr(profile, "vibe", "fun")
    tone = getattr(profile, "tone", "casual")
    examples_raw = getattr(profile, "example_caps", "") or ""
    examples = [e.strip() for e in examples_raw.split("\n") if e.strip()]

    # Use profile default if no explicit platform passed
    platform = platform or getattr(profile, "default_platform", "instagram")

    # Platform hints
    hints = {
        "instagram": "Instagram: short, engaging, can use emojis and hashtags.",
        "twitter": "Twitter/X: concise, punchy, limited characters.",
        "onlyfans": "OnlyFans: warm, personal, invite followers to message or engage.",
        "tiktok": "TikTok: playful, trendy, short phrases with personality.",
        "general": "General social caption: neutral tone, works across platforms."
    }
    platform_hint = hints.get(platform, hints["general"])

    parts = [
        "You are an assistant that writes social media captions.",
        f"Creator's vibe: {vibe}.",
        f"Creator's tone: {tone}.",
        f"Target platform: {platform_hint}",
        f"The content is a {media_obj.media_type}.",
        "Write exactly one caption.",
    ]

    if examples:
        few = examples[:3]
        parts.append("Here are some example captions from this creator:")
        for ex in few:
            parts.append(f"- {ex}")
        parts.append("Keep similar energy, length, and punctuation.")

    # Personalization flags
    if getattr(profile, "always_add_emojis", True):
        parts.append("You may include emojis naturally when it fits the vibe.")
    else:
        parts.append("Avoid using emojis unless absolutely necessary.")

    if getattr(profile, "always_add_cta", False):
        parts.append("Include a subtle call-to-action encouraging engagement or visiting their link.")

    parts.append("Do not wrap the caption in quotes.")
    return "\n".join(parts)

def get_or_create_free_plan():
    # make sure we always have a fallback plan
    free, _ = Plan.objects.get_or_create(
        slug="free",
        defaults={
            "name": "Free",
            "price_usd": 0,
            "ideas_per_month": 20,     # tweak
            "captions_per_month": 20,  # tweak
        },
    )
    return free


def get_or_create_free_plan():
    """
    Assuming you already have this somewhere; if not,
    implement it to return the 'free' Plan.
    """
    plan, _ = Plan.objects.get_or_create(
        slug="free",
        defaults={
            "name": "Free",
            "price_usd": 0,
            "ideas_per_month": 20,
            "captions_per_month": 10,
            # if you added extra fields, you can also set defaults here
        },
    )
    return plan


def get_user_plan(user):
    sub = getattr(user, "subscription", None)
    if sub and sub.plan:
        return sub.plan
    # no sub → fallback to free
    return get_or_create_free_plan()


def get_current_usage(user):
    today = date.today()
    usage, _ = MonthlyUsage.objects.get_or_create(
        user=user,
        year=today.year,
        month=today.month,
        defaults={"ideas_used": 0, "captions_used": 0},
    )
    return usage


def check_usage_allowed(user, kind: str, amount: int = 1) -> bool:
    """
    kind:
      - 'idea'
      - 'caption'
      - 'draft'
      - 'media_upload'
      - 'reminder'

    amount = how many units we want to consume.
    """
    plan = get_user_plan(user)  # never None now

    # -----------------------------------------
    # 1) Per-month counters: ideas / captions
    # -----------------------------------------
    if kind in ("idea", "caption"):
        usage = get_current_usage(user)

        if kind == "idea":
            limit = plan.ideas_per_month or 0
            # allow only if after this call we are still <= limit
            return usage.ideas_used + amount <= limit

        if kind == "caption":
            limit = plan.captions_per_month or 0
            return usage.captions_used + amount <= limit

    # -----------------------------------------
    # 2) Total active drafts (not archived)
    # -----------------------------------------
    if kind == "draft":
        # Plan must have a drafts_limit field (int)
        limit = getattr(plan, "drafts_limit", 0)
        if not limit:
            # 0 or None = considered unlimited (for safety)
            return True

        active_count = Draft.objects.filter(user=user, archived=False).count()
        return active_count + amount <= limit

    # -----------------------------------------
    # 3) Monthly media uploads
    # -----------------------------------------
    if kind == "media_upload":
        # Plan must have media_uploads_per_month (int)
        limit = getattr(plan, "media_uploads_per_month", 0)
        if not limit:
            return True

        now = timezone.now()
        uploads_this_month = MediaUpload.objects.filter(
            user=user,
            uploaded_at__year=now.year,
            uploaded_at__month=now.month,
        ).count()
        return uploads_this_month + amount <= limit

    # -----------------------------------------
    # 4) Monthly posting reminders
    # -----------------------------------------
    if kind == "reminder":
        # Plan must have posting_reminders_per_month (int)
        limit = getattr(plan, "posting_reminders_per_month", 0)
        if not limit:
            return True

        now = timezone.now()
        reminders_this_month = PostingReminder.objects.filter(
            user=user,
            scheduled_at__year=now.year,
            scheduled_at__month=now.month,
        ).count()
        return reminders_this_month + amount <= limit

    # unknown kind → allow (safer than blocking everything)
    return True


def increment_usage(user, kind: str, amount: int = 1):
    """
    Increment usage counters and send upgrade nudges when limits are hit.

    NOTE:
      - We ONLY keep monthly counters (and emails) for ideas / captions.
      - Draft, media, reminders limits are enforced by counting rows,
        so they don't need persisted counters here.
    """
    plan = get_user_plan(user)
    usage = get_current_usage(user)

    frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
    pricing_url = f"{frontend}/pricing"

    # ---- APPLY USAGE INCREASE ----
    if kind == "idea":
        before = usage.ideas_used
        usage.ideas_used += amount
        usage.save()

        limit = plan.ideas_per_month or 0

        # If limit reached/exceeded → send upgrade email ONCE
        if limit > 0 and usage.ideas_used >= limit:
            # avoid sending multiple nudges in the same month
            if before < limit:
                send_postly_email.delay(
                    user.email,
                    "You've reached your monthly idea limit",
                    (
                        "You've used all idea generations included in your Polypost plan.<br><br>"
                        "Upgrade to unlock more ideas instantly."
                    ),
                    "View plans",
                    pricing_url,
                )

    elif kind == "caption":
        before = usage.captions_used
        usage.captions_used += amount
        usage.save()

        limit = plan.captions_per_month or 0

        if limit > 0 and usage.captions_used >= limit:
            # only fire the email on the EXACT step crossing the limit
            if before < limit:
                send_postly_email.delay(
                    user.email,
                    "You've reached your monthly caption limit",
                    (
                        "You've used all caption generations included in your Polypost plan.<br><br>"
                        "Upgrade now to continue generating captions."
                    ),
                    "View plans",
                    pricing_url,
                )

def build_brand_personas(
    niche: str,
    target_audience: str,
    goals: str,
    comfort_level: str,
    user=None,
    lang: str = "en",
):
    """
    Returns a dict: { "personas": [ { ... }, { ... }, { ... } ] }
    Each persona has: persona_name, brand_summary, recommended_vibe, recommended_tone,
                      niche, target_audience, content_pillars, brand_bio
    """

    # ---- Normalise language a bit ----
    lang = (lang or "en").split("-")[0].lower()
    if lang not in {"en", "fr", "es", "pt"}:
        lang = "en"

    print(f"[BRAND_PERSONA_LANG] used={lang!r}")

    # Basic safety defaults
    niche = niche or "general creator"
    target_audience = target_audience or "social media followers"
    goals = goals or "grow audience and increase engagement"
    comfort_level = comfort_level or "comfortable being a bit bold but still authentic"

    prompt_lines = [
        "You are a brand strategist for social media creators.",
        "Based on the details below, generate EXACTLY 3 different brand persona options.",
        "",
        f"Language: {lang.upper()}",
        (
            "All FREE-TEXT fields must be written in this language "
            "(persona_name, brand_summary, niche, target_audience, "
            "content_pillars, brand_bio)."
        ),
        (
            "HOWEVER, recommended_vibe and recommended_tone MUST stay in English "
            "and match one of the following values exactly."
        ),
        "",
        f"Niche: {niche}",
        f"Target audience: {target_audience}",
        f"Goals: {goals}",
        f"Comfort level on camera / social: {comfort_level}",
        "",
        "Allowed values for recommended_vibe:",
        "- Fun, Chill, Bold, Educational, Luxury, Cozy, High-energy, Mysterious, Wholesome",
        "Allowed values for recommended_tone:",
        "- Casual, Professional, Playful, Flirty, Inspirational, Sarcastic, Empathetic, Confident",
        "",
        "For each persona, include:",
        "- persona_name (short, catchy, like 'Bold Big Sis' or 'Cozy Expert')",
        "- brand_summary (2–3 sentences explaining vibe & value)",
        "- recommended_vibe (one of the allowed English values)",
        "- recommended_tone (one of the allowed English values)",
        "- niche (reuse or refine the niche, in the target language)",
        "- target_audience (refined audience description, in the target language)",
        "- content_pillars (array of 3–5 content topics, in the target language)",
        "- brand_bio (1–2 sentence social bio in first person, in the target language)",
        "",
        "Return ONLY JSON in this shape (no markdown, no commentary):",
        "{",
        '  "personas": [',
        "    {",
        '      "persona_name": "...",',
        '      "brand_summary": "...",',
        '      "recommended_vibe": "...",',
        '      "recommended_tone": "...",',
        '      "niche": "...",',
        '      "target_audience": "...",',
        '      "content_pillars": ["...", "..."],',
        '      "brand_bio": "..."',
        "    },",
        "    { ... },",
        "    { ... }",
        "  ]",
        "}",
    ]

    prompt = "\n".join(prompt_lines)

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You generate brand personas for creators. "
                    "You MUST respect the requested language for all free-text fields, "
                    "and keep recommended_vibe/recommended_tone in the allowed English values."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens=900,
        temperature=0.7,
    )

    raw = resp.choices[0].message.content.strip()

    try:
        data = json.loads(raw)
    except Exception:
        # In worst case, wrap into a single fallback persona
        data = {
            "personas": [
                {
                    "persona_name": "Default Creator",
                    "brand_summary": raw[:300],
                    "recommended_vibe": "Fun",
                    "recommended_tone": "Casual",
                    "niche": niche,
                    "target_audience": target_audience,
                    "content_pillars": [],
                    "brand_bio": "",
                }
            ]
        }

    # Ensure we always return a "personas" list
    if not isinstance(data, dict) or "personas" not in data:
        data = {"personas": data if isinstance(data, list) else [data]}

    return data

def generate_idea_action_plan(
    profile,
    idea: dict,
    platform: str = "instagram",
    lang: str = "en",
) -> dict:
    """
    Given an idea dict like:
      {
        "title": "...",
        "description": "...",
        "suggested_caption_starter": "...",
        "personal_twist": "..."
      }

    Return a JSON-ready dict describing an execution plan.
    All free-text content is generated in the requested language.
    """

    # ---- Minimal language normalisation ----
    lang = (lang or "en").split("-")[0].lower()
    if lang not in {"en", "fr", "es", "pt"}:
        lang = "en"

    user_niche = getattr(profile, "niche", "") if profile else ""
    user_stage = getattr(profile, "creator_stage", "") if profile else ""
    target_audience = getattr(profile, "target_audience", "") if profile else ""

    system_msg = (
        "You are an expert content coach for online creators. "
        "You turn abstract ideas into very concrete, step-by-step action plans. "
        "Always respond as a JSON object with short, practical steps. "
        "No emojis, no hashtags, no long essays.\n\n"
        f"IMPORTANT: All free-text fields in the JSON MUST be written in the language "
        f"with ISO code '{lang}'. Do not output English if '{lang}' is not 'en'."
    )

    user_msg = {
        "role": "user",
        "content": (
            "Generate a practical execution plan for this content idea.\n\n"
            f"Language: {lang.upper()}\n"
            f"Platform: {platform}\n"
            f"Niche: {user_niche or 'not specified'}\n"
            f"Creator stage: {user_stage or 'not specified'}\n"
            f"Target audience: {target_audience or 'not specified'}\n\n"
            "Idea JSON:\n"
            f"{idea}\n\n"
            "Return JSON with this shape:\n"
            "{\n"
            '  \"idea_title\": string,\n'
            '  \"concept_summary\": string,\n'
            '  \"sections\": [\n'
            '    {\"title\": string, \"steps\": [string, ...]},\n'
            '    ...\n'
            "  ],\n"
            '  \"extra_tips\": [string, ...]\n'
            "}\n"
        ),
    }

    resp = client.chat.completions.create(
        model="gpt-4.1-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_msg},
            user_msg,
        ],
        temperature=0.7,
    )

    content = resp.choices[0].message.content
    try:
        data = json.loads(content)
    except Exception:
        # very defensive fallback
        data = {
            "idea_title": idea.get("title") or "Content idea",
            "concept_summary": "Execution steps could not be parsed; show raw text.",
            "sections": [
                {
                    "title": "Plan",
                    "steps": [content],
                }
            ],
            "extra_tips": [],
        }

    return data
