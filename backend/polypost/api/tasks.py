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
        notified=False,                     # <-- REQUIRED FLAG
        scheduled_at__lte=one_hour_from_now,
        scheduled_at__gte=now
    )

    for reminder in reminders:
        user = reminder.user
        profile = CreatorProfile.objects.filter(user=user).first()
        if not profile:
            continue

        msg = f"Reminder: Your {reminder.platform.capitalize()} post is scheduled in 1 hour at {reminder.scheduled_at}."

        # ----- EMAIL NOTIFICATION -----
        if profile.notify_email:
            send_postly_email(
                to=user.email,
                subject="⏰ Posting Reminder",
                template_name="posting_reminder.html",
                context={
                    "username": user.username,
                    "platform": reminder.platform,
                    "scheduled_at": reminder.scheduled_at,
                    "note": reminder.note,
                }
            )

        # ----- IN-APP NOTIFICATION -----
        if profile.notify_inapp:
            Notification.objects.create(
                user=user,
                message=msg,
                url="/dashboard#scheduler"
            )
        
        Notification.objects.create(
            user=reminder.user,
            kind="reminder",
            message=f"Upcoming {reminder.platform} post at {reminder.scheduled_at:%Y-%m-%d %H:%M}: {reminder.note}",
            related_reminder=reminder,
        )

        
        # always create an in-app notification
       
        # Prevent duplicate notifications
        reminder.notified = True
        reminder.save()

