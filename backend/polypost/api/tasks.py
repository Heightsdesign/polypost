# api/tasks.py
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from celery import shared_task
from .models import GlobalTrend, PlatformTiming, PlannedPostSlot, Draft
from .external_sources import (
    get_tmdb_trending,
    get_tiktok_trends_from_apify,
    get_instagram_trends_from_apify,
    get_twitter_trends_from_apify,
)
from collections import Counter
from datetime import datetime, timezone as dt_timezone
from datetime import timedelta
from .utils import send_postly_email, get_current_usage



@shared_task
def refresh_global_trends():
    # 1) entertainment
    for t in get_tmdb_trending():
        t.setdefault("fetched_at", timezone.now())
        GlobalTrend.objects.create(**t)

    # 2) tiktok
    for t in get_tiktok_trends_from_apify():
        GlobalTrend.objects.create(**t)

    # 3) instagram
    for t in get_instagram_trends_from_apify():
        GlobalTrend.objects.create(**t)

    # 4) twitter (may be empty for now)
    for t in get_twitter_trends_from_apify():
        GlobalTrend.objects.create(**t)

    # 5) update posting-time table
    update_platform_timing_from_trends()


def update_platform_timing_from_trends():
    platforms = GlobalTrend.objects.values_list("platform", flat=True).distinct()
    now = datetime.now(dt_timezone.utc)
    weekday = now.weekday()

    for platform in platforms:
        trends = GlobalTrend.objects.filter(platform=platform)
        hours = [t.fetched_at.hour for t in trends if t.fetched_at]
        if not hours:
            continue
        counts = Counter(hours)
        for hour, count in counts.items():
            PlatformTiming.objects.update_or_create(
                platform=platform,
                day_of_week=weekday,
                hour=hour,
                defaults={"engagement_rate": float(count)},
            )


@shared_task
def send_post_reminders():
    now = timezone.now()
    window_start = now - timedelta(minutes=2)
    window_end = now + timedelta(minutes=2)

    slots = PlannedPostSlot.objects.filter(
        notify=True,
        reminded_at__isnull=True,
        scheduled_at__gte=window_start,
        scheduled_at__lte=window_end,
    )

    for slot in slots:
        # TODO: replace with real notification (email, push, websocket)
        print(f"[REMINDER] Tell {slot.user} to post on {slot.platform} at {slot.scheduled_at}")

        slot.reminded_at = now
        slot.save(update_fields=["reminded_at"])


@shared_task
def send_postly_email_task(to_email, subject, message_text, button_text, button_url):
    """
    Thin async wrapper around the HTML email helper.
    """
    send_postly_email(
        to_email=to_email,
        subject=subject,
        message_text=message_text,
        button_text=button_text,
        button_url=button_url,
        fail_silently=True,
    )


@shared_task
def send_login_alert_email(user_id, ip, user_agent):
    """
    Called after a successful login.
    """
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return

    ts = timezone.now().strftime("%Y-%m-%d %H:%M:%S")

    msg = (
        f"Hi {user.username},<br><br>"
        "A login was detected on your Polypost account:<br><br>"
        f"<b>IP:</b> {ip or 'unknown'}<br>"
        f"<b>Device:</b> {user_agent or 'unknown'}<br>"
        f"<b>Time:</b> {ts}<br><br>"
        "If this wasn’t you, please reset your password immediately."
    )

    frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
    reset_url = f"{frontend}/forgot-password"

    send_postly_email(
        to_email=user.email,
        subject="Login alert for your Polypost account",
        message_text=msg,
        button_text="Reset password",
        button_url=reset_url,
        fail_silently=True,
    )


@shared_task
def send_weekly_summary_email():
    """
    Runs weekly via Celery Beat and sends a summary to all active users.
    """
    User = get_user_model()
    frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173")

    # Keep it simple for MVP: all active users
    users = User.objects.filter(is_active=True)

    for user in users:
        usage = get_current_usage(user)  # your MonthlyUsage helper

        # If you track drafts via Draft model:
        drafts_count = Draft.objects.filter(user=user).count() if hasattr(user, "drafts") else 0

        msg = (
            f"Hi {user.username},<br><br>"
            "Here’s your content summary for this period:<br><br>"
            f"- Ideas generated: <b>{usage.ideas_used}</b><br>"
            f"- Captions generated: <b>{usage.captions_used}</b><br>"
            f"- Drafts saved: <b>{drafts_count}</b><br><br>"
            "Keep up the momentum — consistent posting wins 🎯"
        )

        send_postly_email(
            to_email=user.email,
            subject="Your weekly Polypost summary 📊",
            message_text=msg,
            button_text="Open dashboard",
            button_url=f"{frontend}/dashboard",
            fail_silently=True,
        )

# api/tasks.py
from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail


@shared_task
def send_newsletter_email_task(subject: str, body_text: str, html_body: str | None = None):
    """
    Send a newsletter email to all users who opted in (marketing_opt_in=True).
    Runs in the background via Celery.
    """
    from django.contrib.auth import get_user_model
    from .models import CreatorProfile

    User = get_user_model()

    # Only profiles that have opted in & whose user is active + has an email
    qs = CreatorProfile.objects.filter(
        marketing_opt_in=True,
        user__is_active=True,
    ).select_related("user")

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "Polypost <no-reply@example.com>")

    for profile in qs.iterator():
        email = profile.user.email
        if not email:
            continue

        try:
            send_mail(
                subject,
                body_text,
                from_email,
                [email],
                html_message=html_body,
                fail_silently=False,
            )
        except Exception as e:
            # For MVP: just log, don't crash the task
            print(f"[NEWSLETTER] Failed to send to {email}: {e}")
