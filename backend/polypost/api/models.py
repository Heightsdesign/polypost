# backend/api/models.py
import uuid
from django.conf import settings
from django.db import models
from django.utils import timezone as dj_timezone


# ------------------------------------------------------------------
# 1.  USER-RELATED
# ------------------------------------------------------------------

# api/models.py
from django.contrib.auth.models import User
from django.db import models
from time import timezone

class CreatorProfile(models.Model):

   
    VIBES  = [("fun", "Fun"), ("chill", "Chill"), ("bold", "Bold"),
              ("educational", "Educational"), ("cozy", "Cozy"), ("high-energy", "High-energy"),
              ("luxury", "Luxury"), ("luxury", "Luxury"),
              ("sporty", "Sporty"), ("edgy", "Edgy"), ("mysterious", "Mysterious")]
    

    TONES  = [("casual", "Casual"), ("professional", "Professional"),  ("flirty", "Flirty"),
              ("playful", "Playful"), ("inspirational", "Inspirational"),
              ("sarcastic", "Sarcastic"), ("empathetic", "Empathetic"), ("confident", "Confident"),]
    
    timezone = models.CharField(max_length=50, default="UTC", blank=True)

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    vibe = models.CharField(max_length=100, blank=True, null=True)
    tone = models.CharField(max_length=100, blank=True, null=True)
    example_caps = models.TextField(blank=True, null=True)

    avatar = models.ImageField(
        upload_to="avatars/",
        null=True,
        blank=True,
        help_text="Optional profile picture for the creator."
    )

    # personalization we added earlier:
    always_add_emojis = models.BooleanField(default=True)
    always_add_cta = models.BooleanField(default=False)
    default_platform = models.CharField(
        max_length=50,
        choices=[
            ("youtube", "Youtube"),
            ("tiktok", "TikTok"),
            ("instagram", "Instagram"),
            ("twitter", "Twitter/X"),
            ("twitch", "Twitch"),
            ("onlyfans", "OnlyFans"),
            ("mym", "MYM Fans"),
            ("snapchat", "Snapchat"),
            ("general", "General"),
            ("entertainment", "Entertainment"),
            ],
        default="instagram",
    )
     # NEW: list of platforms this creator actively uses
    preferred_platforms = models.JSONField(default=list, blank=True)

    def get_active_platforms(self):
        """
        Returns the list of platforms this creator is active on.
        - If preferred_platforms is set -> use that
        - Else fall back to default_platform
        """
        if self.preferred_platforms:
            return self.preferred_platforms

        if getattr(self, "default_platform", None):
            return [self.default_platform]

        return ["instagram"]

    # NEW fields:
    niche = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="e.g. fitness, OF, beauty, cosplay, foodie, gamer"
    )
    target_audience = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="e.g. male fans, OF subscribers, IG followers"
    )

    preferred_language = models.CharField(
        max_length=5,
        choices=[
            ("en", "English"),
            ("fr", "French"),
            ("de", "German"),
            ("es", "Spanish"),
        ],
        default="en",
        help_text="Preferred language for captions and ideas."
    )

    country = models.CharField(max_length=64, blank=True, null=True)
    city = models.CharField(max_length=64, blank=True, null=True)

    phone = models.CharField(max_length=30, blank=True, null=True)

    # comma-separated list of language codes, e.g. "fr,en"
    content_languages = models.CharField(max_length=100, blank=True, null=True)

    onboarding_completed = models.BooleanField(default=False)
    marketing_opt_in = models.BooleanField(default=False)
    notifications_enabled = models.BooleanField(default=False)

    notify_email = models.BooleanField(default=True)
    notify_inapp = models.BooleanField(default=True)

    CREATOR_STAGES = [
        ("starter", "Starter"),
        ("growing", "Growing"),
        ("pro", "Pro"),
    ]
    creator_stage = models.CharField(
        max_length=20,
        choices=CREATOR_STAGES,
        default="starter",
    )

    brand_persona = models.TextField(
        blank=True,
        null=True,
        help_text="JSON blob with AI-generated brand persona (summary, pillars, etc.).",
    )


    def __str__(self):
        return f"{self.user.username} Profile"



class SocialAccount(models.Model):
    """Stores OAuth tokens for IG / Twitter, etc."""
    PROVIDERS = [("instagram", "Instagram"), ("twitter", "Twitter")]
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user            = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        on_delete=models.CASCADE,
                                        related_name="social_accounts")
    provider        = models.CharField(max_length=15, choices=PROVIDERS)
    external_id     = models.CharField(max_length=128)     # the platform user ID
    access_token    = models.TextField()
    refresh_token   = models.TextField(blank=True)
    token_expires   = models.DateTimeField(null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "provider")

# ------------------------------------------------------------------
# 2.  CONTENT & CAPTIONS
# ------------------------------------------------------------------

class MediaUpload(models.Model):
    """Original photos / videos the creator uploads."""
    MEDIA_TYPES = [("photo", "Photo"), ("video", "Video")]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                     on_delete=models.CASCADE,
                                     related_name="uploads")
    file         = models.FileField(upload_to="uploads/%Y/%m/")
    media_type   = models.CharField(max_length=10, choices=MEDIA_TYPES)
    uploaded_at  = models.DateTimeField(auto_now_add=True)

class GeneratedCaption(models.Model):
    """AI caption tied 1-to-1 with a media upload."""
    media           = models.OneToOneField(MediaUpload,
                                           on_delete=models.CASCADE,
                                           related_name="caption")
    text            = models.TextField()
    is_user_edited  = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)

# ------------------------------------------------------------------
# 3.  SCHEDULING & REMINDERS
# ------------------------------------------------------------------

class ScheduledPost(models.Model):
    """Represents a future post or OF reminder."""
    PLATFORMS = [
        ("youtube", "Youtube"),
        ("tiktok", "TikTok"),
        ("instagram", "Instagram"),
        ("twitter", "Twitter/X"),
        ("twitch", "Twitch"),
        ("onlyfans", "OnlyFans"),
        ("mym", "MYM Fans"),
        ("snapchat", "Snapchat"),
        ("general", "General"),
        ("entertainment", "Entertainment"),
        ]

    STATUSES  = [("scheduled", "Scheduled"), ("posted", "Posted"),
                 ("failed", "Failed"), ("cancelled", "Cancelled")]

    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user            = models.ForeignKey(settings.AUTH_USER_MODEL,
                                        on_delete=models.CASCADE,
                                        related_name="scheduled_posts")
    media           = models.ForeignKey(MediaUpload, on_delete=models.CASCADE)
    caption         = models.ForeignKey(GeneratedCaption, on_delete=models.SET_NULL,
                                        null=True, blank=True)
    platform        = models.CharField(max_length=20, choices=PLATFORMS)
    scheduled_time  = models.DateTimeField()
    status          = models.CharField(max_length=12, choices=STATUSES, default="scheduled")
    posted_time     = models.DateTimeField(null=True, blank=True)
    error_message   = models.TextField(blank=True)

class EngagementTip(models.Model):
    """Daily/weekly AI-generated growth ideas."""
    user        = models.ForeignKey(settings.AUTH_USER_MODEL,
                                    on_delete=models.CASCADE,
                                    related_name="tips")
    text        = models.TextField()
    generated_at= models.DateTimeField(auto_now_add=True)

# ------------------------------------------------------------------
# 4.  BILLING (very lean MVP)
# ------------------------------------------------------------------

class GlobalTrend(models.Model):
    PLATFORM_CHOICES = [
        ("youtube", "Youtube"),
        ("tiktok", "TikTok"),
        ("instagram", "Instagram"),
        ("twitter", "Twitter/X"),
        ("twitch", "Twitch"),
        ("onlyfans", "OnlyFans"),
        ("mym", "MYM Fans"),
        ("snapchat", "Snapchat"),
        ("general", "General"),
        ("entertainment", "Entertainment"),
    ]

    platform = models.CharField(max_length=32, choices=PLATFORM_CHOICES)
    title = models.CharField(max_length=255)
    url = models.URLField(blank=True)
    metric = models.FloatField(default=0)
    category = models.CharField(max_length=64, blank=True)
    fetched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fetched_at"]

    def __str__(self):
        return f"{self.platform} - {self.title}"
    
# api/models.py
class PlatformTiming(models.Model):
    platform = models.CharField(max_length=30)
    day_of_week = models.IntegerField()  # Monday=0
    hour = models.IntegerField()         # 0-23
    engagement_rate = models.FloatField(default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("platform", "day_of_week", "hour")

    def __str__(self):
        return f"{self.platform} D{self.day_of_week} {self.hour}:00 -> {self.engagement_rate}"


class PlannedPostSlot(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    platform = models.CharField(max_length=30)  # "instagram", "tiktok", "onlyfans", ...
    scheduled_at = models.DateTimeField()       # store in UTC
    title = models.CharField(max_length=200, blank=True)
    notify = models.BooleanField(default=False)
    reminded_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.user} - {self.platform} at {self.scheduled_at}"
    
class PostPerformance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    platform = models.CharField(max_length=30)  # "instagram", "tiktok", "onlyfans", ...
    external_id = models.CharField(max_length=100, blank=True)  # e.g. IG media ID
    posted_at = models.DateTimeField(null=True, blank=True)

    likes = models.IntegerField(null=True, blank=True)
    comments = models.IntegerField(null=True, blank=True)
    views = models.IntegerField(null=True, blank=True)
    shares = models.IntegerField(null=True, blank=True)

    source = models.CharField(
        max_length=30,
        default="manual",
    )  # "manual", "instagram_api", "agent"
    created_at = models.DateTimeField(auto_now_add=True)
    
# api/models.py
class Plan(models.Model):
    slug = models.CharField(max_length=50, unique=True)  # "free", "monthly", "quarterly", "yearly"
    name = models.CharField(max_length=100)
    price_usd = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    stripe_price_id = models.CharField(max_length=200, blank=True, null=True)

    # core usage
    ideas_per_month = models.IntegerField(default=50)
    captions_per_month = models.IntegerField(default=30)

    # NEW: hard limits / extra quotas
    drafts_limit = models.IntegerField(default=50)
    media_uploads_per_month = models.IntegerField(default=30)
    posting_reminders_per_month = models.IntegerField(default=30)

    # upload constraints (per file)
    max_upload_mb = models.IntegerField(default=25)
    max_video_seconds = models.IntegerField(default=90)



class Subscription(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True)
    stripe_customer_id = models.CharField(max_length=200, blank=True, null=True)
    stripe_subscription_id = models.CharField(max_length=200, blank=True, null=True)
    start_date = models.DateTimeField(default=dj_timezone.now)
    end_date = models.DateTimeField(blank=True, null=True)
    will_cancel_at_period_end = models.BooleanField(default=False)

    def is_active(self):
        return self.end_date is None or self.end_date > dj_timezone.now()

class MonthlyUsage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    year = models.IntegerField()
    month = models.IntegerField()
    ideas_used = models.IntegerField(default=0)
    captions_used = models.IntegerField(default=0)

    class Meta:
        unique_together = ("user", "year", "month")

class Draft(models.Model):
    """
    Generic saved item for the gallery.
    Can be:
      - an idea (text-only)
      - a media-based draft (upload + caption)
    """
    TYPE_CHOICES = [
        ("idea", "Idea"),
        ("media", "Media draft"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="drafts",
    )
    draft_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="idea")

    # idea fields
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    suggested_caption_starter = models.TextField(blank=True)
    hook_used = models.CharField(max_length=255, blank=True)
    personal_twist = models.TextField(blank=True)
    execution_plan = models.TextField(blank=True)


    # media fields (optional)
    media = models.ForeignKey(
        "MediaUpload",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="drafts",
    )
    caption = models.ForeignKey(
        "GeneratedCaption",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="drafts",
    )

    pinned = models.BooleanField(default=False)
    archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-pinned", "-created_at"]

    def __str__(self):
        return f"{self.user} - {self.title or self.draft_type}"
    
class UseCaseTemplate(models.Model):
    """
    Preset configuration for a typical creator use case.
    When a user picks one, we copy these values into their CreatorProfile.
    """

    PLATFORM_CHOICES = [
        ("youtube", "Youtube"),
        ("tiktok", "TikTok"),
        ("instagram", "Instagram"),
        ("twitter", "Twitter/X"),
        ("twitch", "Twitch"),
        ("onlyfans", "OnlyFans"),
        ("mym", "MYM Fans"),
        ("snapchat", "Snapchat"),
        ("general", "General"),
    ]

    slug = models.SlugField(max_length=80, unique=True)  # e.g. "fr-of-flirty"
    title = models.CharField(max_length=150)             # display name
    short_description = models.TextField()

    # Main platform this preset is aimed at
    main_platform = models.CharField(
        max_length=50,
        choices=PLATFORM_CHOICES,
        default="general",
    )


    # CreatorProfile-style fields we’ll copy over
    vibe = models.CharField(max_length=100, blank=True, null=True)
    tone = models.CharField(max_length=100, blank=True, null=True)
    niche = models.CharField(max_length=100, blank=True, null=True)
    target_audience = models.CharField(max_length=100, blank=True, null=True)

    preferred_language = models.CharField(
        max_length=10,
        default="en",      # "fr", "de", "es" etc.
        help_text="ISO code like 'en', 'fr', 'es'.",
    )
    country = models.CharField(max_length=80, blank=True, null=True)
    city = models.CharField(max_length=80, blank=True, null=True)

    # defaults for caption style
    always_add_emojis = models.BooleanField(default=True)
    always_add_cta = models.BooleanField(default=False)
    default_platform = models.CharField(
        max_length=50,
        choices=PLATFORM_CHOICES,
        default="instagram",
    )

    # optional: a couple sample lines we could show in UI later
    example_caption_hint = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

# --------------------------------------------------
#  FEEDBACK: SUPPORT TICKETS + APP REVIEWS
# --------------------------------------------------

class SupportTicket(models.Model):
    CATEGORY_CHOICES = [
        ("bug", "Bug / something broke"),
        ("billing", "Billing & subscriptions"),
        ("idea", "Feature request / idea"),
        ("other", "Other"),
    ]
    STATUS_CHOICES = [
        ("open", "Open"),
        ("in_progress", "In progress"),
        ("closed", "Closed"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="support_tickets",
    )
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, default="other"
    )
    message = models.TextField()
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="open"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        who = self.user.username if self.user else self.email
        return f"[{self.get_category_display()}] {who}: {self.subject}"


class AppReview(models.Model):
    """
    Public reviews / ratings for the app.
    Can be anonymous or linked to a user.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="app_reviews",
    )
    rating = models.PositiveSmallIntegerField()  # 1–5
    title = models.CharField(max_length=120, blank=True)
    comment = models.TextField()
    is_public = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        who = self.user.username if self.user else "anonymous"
        return f"{self.rating}★ by {who}"


# ... existing models ...

class PostingReminder(models.Model):
    """
    A scheduled reminder to post content.
    Optionally tied to a draft.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posting_reminders",
    )
    scheduled_at = models.DateTimeField()
    platform = models.CharField(max_length=32, blank=True)
    # if Draft exists in your project, this will resolve
    draft = models.ForeignKey(
        "Draft",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="posting_reminders",
    )
    note = models.TextField(blank=True)

    notify_email = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    notified = models.BooleanField(default=False)

    class Meta:
        ordering = ["scheduled_at"]

    def __str__(self):
        return f"{self.user} @ {self.scheduled_at} ({self.platform})"

class NewsletterBlast(models.Model):
    subject = models.CharField(max_length=200)
    body = models.TextField()
    html_body = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(blank=True, null=True)
    recipients_count = models.IntegerField(default=0)

    def __str__(self):
        return f"Newsletter: {self.subject} ({self.created_at.date()})"
 
class Notification(models.Model):
    """
    Simple in-app notification (shown in bell + notifications page).
    Typically created when we send a reminder email or other important event.
    """
    KIND_CHOICES = [
        ("reminder", "Reminder"),
        ("system", "System"),
        ("usage", "Usage / limits"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    kind = models.CharField(max_length=20, choices=KIND_CHOICES, default="reminder")
    message = models.TextField()

    # Optional link to a reminder / scheduled post if you want
    related_reminder = models.ForeignKey(
        "PostingReminder",  # or just a string if model is below
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="notifications",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} – {self.kind} – {self.message[:40]}"

    @property
    def is_read(self) -> bool:
        return self.read_at is not None