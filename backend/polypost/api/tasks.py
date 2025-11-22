# api/tasks.py
from django.utils import timezone
from celery import shared_task
from .models import GlobalTrend, PlatformTiming, PlannedPostSlot
from .external_sources import (
    get_tmdb_trending,
    get_tiktok_trends_from_apify,
    get_instagram_trends_from_apify,
    get_twitter_trends_from_apify,
)
from collections import Counter
from datetime import datetime, timezone as dt_timezone
from datetime import timedelta


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