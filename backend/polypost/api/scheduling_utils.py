# backend/postly/api/scheduling_utils.py
from datetime import datetime, timedelta
import zoneinfo

import json
from django.conf import settings

try:
    import openai
except ImportError:  # safety: if openai is not installed
    openai = None
    
DEFAULT_SLOTS = {
    "instagram": [11, 18],
    "tiktok": [13, 19],
    "twitter": [9, 15, 20],
    "onlyfans": [12, 21],
    "youtube": [10, 19],
    "twitch": [18, 21],
    "mym": [11, 20],
    "snapchat": [12, 17],
    "general": [11, 18],
}

DEFAULT_DAYS = [1, 2, 3, 4, 6]  # Tue–Sat-ish

CONTENT_TYPE_ROTATION = {
    "instagram": ["Feed post", "Story", "Reel", "Live"],
    "tiktok": ["Short video", "Live"],
    "twitter": ["Tweet", "Thread"],
    "onlyfans": ["Post", "Story"],
    "youtube": ["Video", "Short", "Live"],
    "twitch": ["Stream"],
    "mym": ["Post"],
    "snapchat": ["Story", "Spotlight"],
    "general": ["Post"],
}

def generate_posting_suggestions(platform: str, timezone_str: str = "UTC", days_ahead: int = 7):
    tz = zoneinfo.ZoneInfo(timezone_str)
    now = datetime.now(tz=tz)
    slots = DEFAULT_SLOTS.get(platform, [11, 18])

    suggestions = []

    for i in range(days_ahead):
        day = now + timedelta(days=i)
        # only suggest on nice days
        if day.weekday() not in DEFAULT_DAYS:
            continue

        for hour in slots:
            dt = day.replace(hour=hour, minute=0, second=0, microsecond=0)
            if dt <= now:
                continue
            suggestions.append({
                "datetime": dt.isoformat(),
                "platform": platform,
                "reason": "Recommended posting window for this platform",
            })

    return suggestions[:10]


def _decide_posts_per_week(profile) -> int:
    """
    Very simple heuristic based on profile fields.
    You can refine this later with the brand assistant answers.
    """
    stage = (getattr(profile, "creator_stage", "") or "").lower()
    goals = (getattr(profile, "target_audience", "") or "").lower()  # placeholder

    # default
    posts = 4

    if "growth" in stage or "grow" in goals:
        posts = 7
    elif "income" in goals or "hustle" in stage:
        posts = 6
    elif "chill" in stage:
        posts = 3

    return posts


def generate_ai_posting_plan(
    profile,
    platform: str = "instagram",
    posts_per_week: int | None = None,
):
    """
    Returns a list of dicts:
    [
      {
        "platform": "instagram",
        "scheduled_at": "2025-12-01T10:00:00+01:00",
        "note": "Instagram Reel",
      },
      ...
    ]
    """

    # --- Timezone ---
    tz_name = getattr(profile, "timezone", None) or "UTC"
    try:
        tz = zoneinfo.ZoneInfo(tz_name)
    except Exception:
        tz = zoneinfo.ZoneInfo("UTC")

    now = datetime.now(tz)

    # --- Determine which platforms to plan for ---
    preferred = getattr(profile, "preferred_platforms", None) or []

    if platform == "all":
        platforms = preferred or ["instagram"]
    else:
        platforms = [platform]

    # --- Decide posting frequency ---
    if posts_per_week is None:
        posts_per_week = _decide_posts_per_week(profile)

    # Evenly distribute posts across platforms
    num_platforms = max(1, len(platforms))
    per_platform = max(1, posts_per_week // num_platforms)

    days_ahead = 7
    today = now.date()

    plan: list[dict] = []

    for plat in platforms:
        hours = DEFAULT_SLOTS.get(plat, DEFAULT_SLOTS["general"])
        content_types = CONTENT_TYPE_ROTATION.get(plat, CONTENT_TYPE_ROTATION["general"])

        slots_for_this_platform = 0
        day_offset = 0

        # walk forward through days until we have enough slots
        while slots_for_this_platform < per_platform and day_offset < days_ahead * 2:
            day = today + timedelta(days=day_offset)
            day_offset += 1

            # skip non-preferred weekdays
            if day.weekday() not in DEFAULT_DAYS:
                continue

            for hour in hours:
                dt = datetime(
                    year=day.year,
                    month=day.month,
                    day=day.day,
                    hour=hour,
                    minute=0,
                    second=0,
                    tzinfo=tz,
                )
                if dt <= now:
                    continue

                content_type = content_types[
                    slots_for_this_platform % len(content_types)
                ]
                note = f"{plat.capitalize()} {content_type}"

                plan.append(
                    {
                        "platform": plat,
                        "scheduled_at": dt.isoformat(),
                        "note": note,
                    }
                )

                slots_for_this_platform += 1
                if slots_for_this_platform >= per_platform:
                    break

    return plan