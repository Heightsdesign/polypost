# backend/postly/api/scheduling_utils.py
from datetime import datetime, timedelta
import zoneinfo



DEFAULT_SLOTS = {
    "instagram": [11, 18],      # 11:00, 18:00
    "onlyfans": [12, 21],       # noon + evening
    "tiktok": [13, 19],
    "twitter": [9, 15, 20],
}

DEFAULT_DAYS = [1, 2, 3, 4, 6]  # Mon=0 … Sun=6 → we pick Tue-Sat-ish


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
