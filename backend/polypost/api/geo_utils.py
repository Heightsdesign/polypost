
from geoip2.webservice import Client as MaxMindClient
from django.conf import settings

# Put these in your settings.py (or env vars)
# MAXMIND_ACCOUNT_ID = "your_account_id"
# MAXMIND_LICENSE_KEY = "your_license_key"


COUNTRY_LANG_MAP = {
    "FR": "fr", "BE": "fr", "CA": "fr", "CH": "fr",
    "ES": "es", "MX": "es", "AR": "es", "CO": "es",
    "PT": "pt", "BR": "pt",
}

def get_country_code_from_ip(ip: str) -> str | None:
    """
    Returns a 2-letter country code like 'FR', 'US', 'BR', or None on failure.
    """
    account_id = getattr(settings, "MAXMIND_ACCOUNT_ID", None)
    license_key = getattr(settings, "MAXMIND_LICENSE_KEY", None)

    if not account_id or not license_key:
        return None

    try:
        client = MaxMindClient(account_id, license_key)

        # choose the service you have access to:
        # - client.country(ip)
        # - client.city(ip)
        # - client.insights(ip)
        response = client.country(ip)  # cheapest, enough for language by country

        return response.country.iso_code  # ex: "FR"
    except Exception:
        return None
    

def language_from_country_code(code: str | None) -> str:
    if not code:
        return "en"
    return COUNTRY_LANG_MAP.get(code.upper(), "en")