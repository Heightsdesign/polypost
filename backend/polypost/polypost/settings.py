"""
Django settings for Polypost project.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from celery.schedules import crontab

# -----------------------------------------------------------------------------
# PATHS
# -----------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent            # .../backend/polypost
PROJECT_ROOT = BASE_DIR.parent.parent                        # .../Postly (root)

# Load environment variables from the real project root
load_dotenv(PROJECT_ROOT / ".env", override=True)

# -----------------------------------------------------------------------------
# BASIC SETTINGS
# -----------------------------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",") if os.getenv("ALLOWED_HOSTS") else []

# -----------------------------------------------------------------------------
# THIRD-PARTY SERVICES
# -----------------------------------------------------------------------------
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# -----------------------------------------------------------------------------
# MEDIA & STATIC
# -----------------------------------------------------------------------------
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STATIC_URL = "static/"

# -----------------------------------------------------------------------------
# APPLICATIONS
# -----------------------------------------------------------------------------
INSTALLED_APPS = [
    # Django core apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders", 

    # Third-party
    "rest_framework",
    "rest_framework.authtoken",

    # Local
    "api.apps.ApiConfig",
]

# -----------------------------------------------------------------------------
# MIDDLEWARE / TEMPLATES / WSGI
# -----------------------------------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "polypost.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "polypost.wsgi.application"

# -----------------------------------------------------------------------------
# DATABASE
# -----------------------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "polypost_db"),
        "USER": os.getenv("DB_USER", "polypost_user"),
        "PASSWORD": os.getenv("DB_PASSWORD", ""),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}

# -----------------------------------------------------------------------------
# CELERY SCHEDULES
# -----------------------------------------------------------------------------
CELERY_BEAT_SCHEDULE = {
    "refresh-global-trends-every-hour": {
        "task": "api.tasks.refresh_global_trends",
        "schedule": crontab(minute=0, hour="*"),  # every hour
    },
}

# -----------------------------------------------------------------------------
# REST FRAMEWORK / JWT
# -----------------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=2),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
}

# -----------------------------------------------------------------------------
# MISC
# -----------------------------------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Allow your dev origins
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# If you want to be quick-and-dirty in dev, you can use:
# CORS_ALLOW_ALL_ORIGINS = True

# Since you use JWT in headers, make sure Authorization header is accepted:
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "origin",
    "user-agent",
    "dnt",
    "x-csrftoken",
    "x-requested-with",
]

# Not strictly needed unless you’re sending cookies:
CORS_ALLOW_CREDENTIALS = False

# Also allow hosts for dev
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]

# Where your frontend lives (for links in emails)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Dev email backend: prints emails to the console so you can copy the link
if DEBUG:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


# -------------------------------------------------------------------------
# STRIPE
# -------------------------------------------------------------------------
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
STRIPE_FRONTEND_URL = os.getenv("STRIPE_FRONTEND_URL", "http://localhost:5173")
