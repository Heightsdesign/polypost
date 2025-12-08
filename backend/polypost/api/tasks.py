# api/tasks.py
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from celery import shared_task
from .models import GlobalTrend, PlatformTiming, PlannedPostSlot, Draft, CreatorProfile, Notification, PostingReminder
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
from django.core.mail import send_mail
from.email_templates import normalize_lang_code, get_email_text


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

def get_user_email_lang_from_profile(user) -> str:
    """
    Best-effort way to get the user's email language from CreatorProfile.
    Falls back to English.
    """
    try:
        profile = CreatorProfile.objects.filter(user=user).first()
        if profile and getattr(profile, "preferred_language", None):
            return normalize_lang_code(profile.preferred_language)
    except Exception:
        pass
    return "en"



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
def send_postly_email_task(to_email, subject, message_text, button_text, button_url, lang: str = "en",):
    """
    Thin async wrapper around the HTML email helper.
    """
    send_postly_email(
        to_email=to_email,
        subject=subject,
        message_text=message_text,
        button_text=button_text,
        button_url=button_url,
        lang=lang,
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

    # Determine language from CreatorProfile (or whatever you use)
    lang = get_user_email_lang_from_profile(user)  # falls back to "en"

    # Get language-specific subject/message/button_text
    email_copy = get_email_text("login_alert", lang)

    # Fill the placeholders in the message
    message_text = email_copy["message"].format(
        username=user.username,
        ip=ip or "unknown",
        device=user_agent or "unknown",
        timestamp=ts,
    )

    frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
    reset_url = f"{frontend}/forgot-password"

    send_postly_email(
        to_email=user.email,
        subject=email_copy["subject"],
        message_text=message_text,
        button_text=email_copy["button_text"],
        button_url=reset_url,
        lang=lang,
        fail_silently=True,
    )


@shared_task
def send_weekly_summary_email():
    User = get_user_model()
    frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173")

    users = User.objects.filter(is_active=True)

    for user in users:
        usage = get_current_usage(user)
        drafts_count = Draft.objects.filter(user=user).count() if hasattr(user, "drafts") else 0

        lang = get_user_email_lang_from_profile(user)

        email_copy = get_email_text("weekly_summary", lang)

        message_text = email_copy["message"].format(
            username=user.username,
            ideas=usage.ideas_used,
            captions=usage.captions_used,
            drafts=drafts_count,
        )

        send_postly_email(
            to_email=user.email,
            subject=email_copy["subject"],
            message_text=message_text,
            button_text=email_copy["button_text"],
            button_url=f"{frontend}/dashboard",
            lang=lang,
            fail_silently=True,
        )

# api/tasks.py
@shared_task
def send_newsletter_email_task(blast_id: int, subject: str, body_text: str, html_body: str | None):
    from .models import CreatorProfile, NewsletterBlast
    from django.contrib.auth import get_user_model

    blast = NewsletterBlast.objects.get(id=blast_id)

    qs = CreatorProfile.objects.filter(
        marketing_opt_in=True,
        user__is_active=True,
    ).select_related("user")

    from_email = settings.DEFAULT_FROM_EMAIL
    count = 0

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
            count += 1
        except Exception as e:
            print(f"Failed to send newsletter to {email}: {e}")

    blast.sent_at = timezone.now()
    blast.recipients_count = count
    blast.save()

@shared_task
def check_upcoming_posts():
    now = timezone.now()
    one_hour_from_now = now + timedelta(hours=1)

    reminders = PostingReminder.objects.filter(
        notified=False,
        scheduled_at__lte=one_hour_from_now,
        scheduled_at__gte=now,
    )

    frontend = getattr(settings, "FRONTEND_URL", "http://localhost:5173")

    for reminder in reminders:
        user = reminder.user
        profile = CreatorProfile.objects.filter(user=user).first()
        if not profile:
            continue

        lang = normalize_lang_code(getattr(profile, "preferred_language", None))

        msg = (
            f"Reminder: your {reminder.platform.capitalize()} post is scheduled "
            f"in 1 hour at {reminder.scheduled_at:%Y-%m-%d %H:%M}.\n\n"
            "You can review it from your Polypost dashboard."
        )

        # ----- EMAIL NOTIFICATION -----
        if profile.notify_email:
            lang = get_user_email_lang_from_profile(user)
            email_copy = get_email_text("posting_reminder", lang)

            message_text = email_copy["message"].format(
                username=user.username,
                platform=reminder.platform.capitalize(),
                scheduled_time=reminder.scheduled_at.strftime("%Y-%m-%d %H:%M"),
                note=reminder.note or "—",
            )

            send_postly_email(
                to_email=user.email,
                subject=email_copy["subject"],
                message_text=message_text,
                button_text=email_copy["button_text"],
                button_url=f"{frontend}/dashboard#scheduler",
                lang=lang,
                fail_silently=True,
            )

        # ----- IN-APP NOTIFICATION -----
        if profile.notify_inapp:
            Notification.objects.create(
                user=user,
                message=msg,
                url="/dashboard#scheduler",
            )

        # Always create an in-app notification (you already do)
        Notification.objects.create(
            user=reminder.user,
            kind="reminder",
            message=(
                f"Upcoming {reminder.platform} post at "
                f"{reminder.scheduled_at:%Y-%m-%d %H:%M}: {reminder.note}"
            ),
            related_reminder=reminder,
        )

        # Prevent duplicate notifications
        reminder.notified = True
        reminder.save()

