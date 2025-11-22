# backend/postly/api/external_sources.py
import os
import requests
from datetime import datetime, timezone as dt_timezone
import time

APIFY_TOKEN = os.getenv("APIFY_TOKEN")
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

APIFY_BASE = "https://api.apify.com/v2/acts"
APIFY_TIKTOK_ACTOR = os.getenv("APIFY_TIKTOK_ACTOR")
APIFY_INSTAGRAM_ACTOR = os.getenv("APIFY_INSTAGRAM_ACTOR")
APIFY_TWITTER_ACTOR = os.getenv("APIFY_TWITTER_ACTOR")

def apify_run_and_get_items(actor_id: str, payload: dict | None = None, limit: int = 20):
    """
    Try to run an Apify actor and return items.
    1) try run-sync-dataset
    2) fall back to normal run + poll
    3) handle responses that wrap data under "data"
    """
    if not APIFY_TOKEN or not actor_id:
        return []

    payload = payload or {}

    # 1) try run-sync-dataset (most scrapers support this)
    sync_url = f"{APIFY_BASE}/{actor_id}/run-sync-dataset?token={APIFY_TOKEN}"
    sync_resp = requests.post(sync_url, json=payload, timeout=30)
    if sync_resp.status_code == 200:
        try:
            data = sync_resp.json()
            if isinstance(data, list):
                return data[:limit]
        except Exception:
            pass  # we'll fall back

    # 2) normal run
    run_url = f"{APIFY_BASE}/{actor_id}/runs?token={APIFY_TOKEN}"
    run_resp = requests.post(run_url, json=payload, timeout=30)
    run_resp.raise_for_status()
    run_data = run_resp.json()

    # some actors return {"data": {...}}
    if "id" in run_data:
        run_id = run_data["id"]
    elif "data" in run_data and "id" in run_data["data"]:
        run_id = run_data["data"]["id"]
    else:
        # print to see what we actually got
        print("[Apify] unexpected run response for", actor_id, "->", run_data)
        return []

    # 2b) poll the run until finished
    for _ in range(10):  # up to ~15s
        status_url = f"https://api.apify.com/v2/actor-runs/{run_id}"
        status_resp = requests.get(status_url, timeout=15)
        status_data = status_resp.json()
        status = status_data.get("status")
        dataset_id = status_data.get("defaultDatasetId")
        if status in ("SUCCEEDED", "FAILED", "ABORTED"):
            break
        time.sleep(1.5)

    # 3) try to read dataset
    dataset_id = status_data.get("defaultDatasetId")
    if dataset_id:
        items_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?clean=true&limit={limit}"
        items_resp = requests.get(items_url, timeout=30)
        if items_resp.status_code == 200:
            return items_resp.json()

    # 4) try KV store
    kv_id = status_data.get("defaultKeyValueStoreId")
    if kv_id:
        kv_url = f"https://api.apify.com/v2/key-value-stores/{kv_id}/records/OUTPUT?raw=1"
        kv_resp = requests.get(kv_url, timeout=30)
        if kv_resp.status_code == 200:
            try:
                data = kv_resp.json()
                if isinstance(data, list):
                    return data[:limit]
                if isinstance(data, dict) and "items" in data:
                    return data["items"][:limit]
            except Exception:
                pass

    return []


def apify_sync_items(actor_id: str, payload: dict | None = None, limit: int = 20):
    if not APIFY_TOKEN or not actor_id:
        return []

    payload = payload or {}
    url = f"{APIFY_BASE}/{actor_id}/run-sync-get-dataset-items?token={APIFY_TOKEN}"

    resp = requests.post(url, json=payload, timeout=40)

    # 👇 accept both 200 and 201
    if resp.status_code not in (200, 201):
        print(f"[Apify] {actor_id} failed:", resp.status_code, resp.text[:200])
        return []

    try:
        data = resp.json()
    except Exception:
        return []

    # sometimes it's already a list
    if isinstance(data, list):
        return data[:limit]

    # sometimes it's {"items": [...]}
    if isinstance(data, dict) and "items" in data:
        return data["items"][:limit]

    print(f"[Apify] {actor_id} unexpected shape:", data)
    return []

def get_tiktok_trends_from_apify():
    actor = os.getenv("APIFY_TIKTOK_ACTOR")
    if not actor:
        return []
    items = apify_sync_items(
        actor,
        {"hashtags": ["fyp", "trending"], "maxItems": 10},
        limit=10,
    )
    now = datetime.now(dt_timezone.utc)
    trends = []
    for it in items:
        trends.append({
            "platform": "tiktok",
            "title": it.get("desc") or it.get("title") or it.get("text") or "TikTok content",
            "url": it.get("webVideoUrl") or it.get("shareUrl") or it.get("url") or "",
            "metric": it.get("playCount") or it.get("diggCount") or it.get("likes") or 0,
            "category": "video",
            "fetched_at": now,
        })
    return trends

def get_instagram_trends_from_apify():
    actor = os.getenv("APIFY_INSTAGRAM_ACTOR")
    if not actor:
        return []
    items = apify_sync_items(
        actor,
        {
            "hashtags": ["love"],   # super common, public
            "resultsLimit": 10,
        },
        limit=10,
    )
    now = datetime.now(dt_timezone.utc)
    trends = []
    for it in items:
        trends.append({
            "platform": "instagram",
            "title": it.get("caption") or "Instagram post",
            "url": it.get("url") or "",
            "metric": it.get("likesCount") or it.get("playCount") or 0,
            "category": "reel",
            "fetched_at": now,
        })
    return trends


def get_twitter_trends_from_apify():
    actor = os.getenv("APIFY_TWITTER_ACTOR")
    if not actor:
        return []
    items = apify_sync_items(
        actor,
        {"searchTerms": ["trending"], "maxItems": 10, "tweetLanguage": "en"},
        limit=10,
    )
    now = datetime.now(dt_timezone.utc)
    trends = []
    for it in items:
        # skip demo rows
        if it.get("demo") is True:
            continue
        trends.append({
            "platform": "twitter",
            "title": it.get("text") or it.get("title") or "Twitter trend",
            "url": it.get("url") or "",
            "metric": it.get("retweetCount") or it.get("favoriteCount") or 0,
            "category": "trend",
            "fetched_at": now,
        })
    return trends



def get_tmdb_trending():
    if not TMDB_API_KEY:
        return []
    url = f"https://api.themoviedb.org/3/trending/all/day?api_key={TMDB_API_KEY}"
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
    except Exception:
        return []

    data = resp.json()
    trends = []
    for item in data.get("results", [])[:10]:
        title = item.get("title") or item.get("name")
        if not title:
            continue
        trends.append({
            "platform": "entertainment",
            "title": title,
            "url": f"https://www.themoviedb.org/{item.get('media_type','movie')}/{item.get('id')}",
            "metric": item.get("popularity") or 0,
            "category": "movie_or_tv",
        })
    return trends
