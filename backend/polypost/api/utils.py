
# api/utils.py
from datetime import date
import os
import requests


from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.utils.timezone import now

from .email_templates import POSTLY_EMAIL_TEMPLATE
from .models import MonthlyUsage, Subscription, Plan



def render_postly_email_html(title: str, message: str, button_text: str, button_url: str) -> str:
    """
    Simple string-based templating using the base POSTLY_EMAIL_TEMPLATE.
    """
    html = (
        POSTLY_EMAIL_TEMPLATE
        .replace("{{TITLE}}", title)
        .replace("{{MESSAGE}}", message)
        .replace("{{BUTTON_TEXT}}", button_text)
        .replace("{{BUTTON_URL}}", button_url)
        .replace("{{YEAR}}", str(now().year))
    )
    return html


def send_postly_email(
    to_email: str,
    subject: str,
    message_text: str,
    button_text: str,
    button_url: str,
    fail_silently: bool = True,
):
    """
    Reusable helper to send a branded Postly HTML email with a button,
    plus a plain-text fallback.
    """
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@polypost-platform.com")

    html_body = render_postly_email_html(
        title=subject,
        message=message_text,
        button_text=button_text,
        button_url=button_url,
    )

    email = EmailMultiAlternatives(
        subject=subject,
        body=message_text,  # plain text fallback
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
    kind = "idea" or "caption"
    amount = how many units we want to consume (e.g. 5 ideas per generation)
    """
    plan = get_user_plan(user)          # never None now
    usage = get_current_usage(user)

    if kind == "idea":
        limit = plan.ideas_per_month or 0
        # allow only if after this call we are still <= limit
        return usage.ideas_used + amount <= limit

    elif kind == "caption":
        limit = plan.captions_per_month or 0
        return usage.captions_used + amount <= limit

    # unknown kind → block
    return False


def increment_usage(user, kind: str, amount: int = 1):
    """
    Increment usage counters and send upgrade nudges when limits are hit.
    """
    from .tasks import send_postly_email_task

    plan = get_user_plan(user)
    usage = get_current_usage(user)

    frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
    pricing_url = f"{frontend}/pricing"

    # ---- APPLY USAGE INCREASE ----
    if kind == "idea":
        usage.ideas_used += amount
        usage.save()

        limit = plan.ideas_per_month or 0

        # If limit reached/exceeded → send upgrade email ONCE
        if limit > 0 and usage.ideas_used >= limit:
            # avoid sending multiple nudges in the same month
            if usage.ideas_used - amount < limit:  
                send_postly_email_task.delay(
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
        usage.captions_used += amount
        usage.save()

        limit = plan.captions_per_month or 0

        if limit > 0 and usage.captions_used >= limit:
            # only fire the email on the EXACT step crossing the limit
            if usage.captions_used - amount < limit:
                send_postly_email_task.delay(
                    user.email,
                    "You've reached your monthly caption limit",
                    (
                        "You've used all caption generations included in your Polypost plan.<br><br>"
                        "Upgrade now to continue generating captions."
                    ),
                    "View plans",
                    pricing_url,
                )

def user_has_active_subscription(user):
    if not user.is_authenticated:
        return False
    try:
        sub = user.subscription  # OneToOne
    except Subscription.DoesNotExist:
        return False
    return sub.is_active()