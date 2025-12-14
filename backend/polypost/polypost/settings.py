"""
Django settings for Polypost project.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from celery.schedules import crontab
import django_ses
# -----------------------------------------------------------------------------
# PATHS
# -----------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent            # .../backend/polypost
PROJECT_ROOT = BASE_DIR.parent.parent                        # .../Polypost (root)

# Load environment variables from the real project root
load_dotenv(PROJECT_ROOT / ".env", override=True)

# -----------------------------------------------------------------------------
# BASIC SETTINGS
# -----------------------------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set")

DEBUG = os.getenv("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = [h.strip() for h in os.getenv("ALLOWED_HOSTS", "localhost").split(",") if h.strip()]
CSRF_TRUSTED_ORIGINS = [o.strip() for o in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if o.strip()]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
REFERRER_POLICY = "strict-origin-when-cross-origin"

# -----------------------------------------------------------------------------
# THIRD-PARTY SERVICES
# -----------------------------------------------------------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# -----------------------------------------------------------------------------
# MEDIA & STATIC
# -----------------------------------------------------------------------------
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

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
    "whitenoise.middleware.WhiteNoiseMiddleware",
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
        "NAME": os.getenv("POSTGRES_DB", "polypost"),
        "USER": os.getenv("POSTGRES_USER", "polypost_user"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", ""),
        "HOST": os.getenv("POSTGRES_HOST", "localhost"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
    }
}

# -----------------------------------------------------------------------------
# CELERY SCHEDULES
# -----------------------------------------------------------------------------
# Celery / Redis
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"

CELERY_BEAT_SCHEDULE = {
    "refresh-global-trends-every-hour": {
        "task": "api.tasks.refresh_global_trends",
        "schedule": crontab(minute=0, hour=6),
    },
    "weekly-summary-email": {
        "task": "api.tasks.send_weekly_summary_email",
        "schedule": crontab(hour=9, minute=0, day_of_week="1"),  # Monday 09:00
    },
    "check-upcoming-posts-every-15-min": {
        "task": "api.tasks.check_upcoming_posts",
        "schedule": 60 * 15,  # every 15 minutes
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
    "https://polypost-platform.com",
    "https://www.polypost-platform.com",
]

if not DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "https://polypost-platform.com",
        "https://www.polypost-platform.com",
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


# Where your frontend lives (for links in emails)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Dev email backend: prints emails to the console so you can copy the link
if DEBUG:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django_ses.SESBackend")


# -------------------------------------------------------------------------
# STRIPE
# -------------------------------------------------------------------------
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
STRIPE_FRONTEND_URL = os.getenv("STRIPE_FRONTEND_URL", "http://localhost:5173")



AWS_SES_REGION_NAME = os.getenv("AWS_SES_REGION_NAME", "eu-west-1")
AWS_SES_REGION_ENDPOINT = os.getenv(
    "AWS_SES_REGION_ENDPOINT",
    "email.eu-west-1.amazonaws.com"
)

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "Polypost <polypost-management@polypost-platform.com>")


MAXMIND_ACCOUNT_ID = os.environ.get("MAXMIND_ACCOUNT_ID", "")
MAXMIND_LICENSE_KEY = os.environ.get("MAXMIND_LICENSE_KEY", "")