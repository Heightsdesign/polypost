
COUNTRY_LANG_MAP = {
    "FR": "fr",
    "BE": "fr",
    "CA": "fr",
    "CH": "fr",

    "ES": "es",
    "MX": "es",
    "AR": "es",
    "CO": "es",
    # etc…

    "PT": "pt",
    "BR": "pt",

    # Default to English for everything else
}

def language_from_country_code(country_code: str) -> str:
    if not country_code:
        return "en"
    country_code = country_code.upper()
    return COUNTRY_LANG_MAP.get(country_code, "en")