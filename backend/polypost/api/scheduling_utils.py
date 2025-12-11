# backend/postly/api/scheduling_utils.py
from datetime import datetime, timedelta
import zoneinfo
import math

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
    days_ahead: int = 14,  # plan roughly the next 2 weeks by default
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

    # --- Decide posting frequency per week ---
    if posts_per_week is None:
        posts_per_week = _decide_posts_per_week(profile)

    # Scale by planning window (days_ahead)
    weeks_factor = days_ahead / 7.0
    total_posts = max(1, int(math.ceil(posts_per_week * weeks_factor)))

    num_platforms = max(1, len(platforms))
    per_platform = max(1, int(math.ceil(total_posts / num_platforms)))

    plan: list[dict] = []

    for plat in platforms:
        # 1) Get candidate suggestions spread over the requested window
        suggestions = generate_posting_suggestions(
            plat,
            timezone_str=tz_name,
            days_ahead=days_ahead,
        )

        # 2) Keep only future suggestions (with tz info)
        future_suggestions: list[tuple[datetime, dict]] = []
        for s in suggestions:
            try:
                dt = datetime.fromisoformat(s["datetime"])
            except Exception:
                continue
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=tz)
            if dt <= now:
                continue
            future_suggestions.append((dt, s))

        if not future_suggestions:
            continue

               # sort by datetime just in case
        future_suggestions.sort(key=lambda x: x[0])

        # 3) Pick slots spread across the whole window
        total_candidates = len(future_suggestions)
        if total_candidates == 0:
            continue

        count = min(per_platform, total_candidates)

        # Evenly spaced indices across [0, total_candidates - 1]
        if count == 1:
            indices = [total_candidates // 2]  # middle
        else:
            indices = []
            for i in range(count):
                # e.g. for count=3 and total_candidates=10 → indices ~ [0, 4, 9]
                idx = int(round(i * (total_candidates - 1) / (count - 1)))
                idx = max(0, min(total_candidates - 1, idx))
                indices.append(idx)
            # remove duplicates while preserving order
            seen = set()
            indices = [i for i in indices if not (i in seen or seen.add(i))]

        chosen = [future_suggestions[i] for i in indices]


        content_types = CONTENT_TYPE_ROTATION.get(
            plat, CONTENT_TYPE_ROTATION["general"]
        )

        for idx, (dt, s) in enumerate(chosen):
            content_type = content_types[idx % len(content_types)]
            note = f"{plat.capitalize()} {content_type}"

            plan.append(
                {
                    "platform": plat,
                    "scheduled_at": dt.isoformat(),
                    "note": note,
                }
            )

    return plan
