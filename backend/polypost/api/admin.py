# backend/polypost/api/admin.py

from django.contrib import admin
from django.utils.html import format_html
from django.shortcuts import redirect
from django.urls import path

from .tasks import send_newsletter_email_task

from .models import (
    # Existing
    CreatorProfile,
    MediaUpload,
    NewsletterBlast,
    SupportTicket,
    AppReview,
    GlobalTrend,
    PlatformTiming,
    PlannedPostSlot,

    # Billing / usage
    Plan,
    Subscription,
    MonthlyUsage,

    # Presets
    UseCaseTemplate,

    # Content / drafts
    Draft,
    GeneratedCaption,

    # Notifications / scheduling
    PostingReminder,
    Notification,

    # Social/perf (optional visibility)
    SocialAccount,
    PostPerformance,
)


# ---------------------------
# Admin site branding
# ---------------------------
admin.site.site_header = "Polypost Admin"
admin.site.site_title = "Polypost Admin"
admin.site.index_title = "Administration"


# ---------------------------
# Core user/profile
# ---------------------------
@admin.register(CreatorProfile)
class CreatorProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "default_platform",
        "preferred_language",
        "creator_stage",
        "vibe",
        "tone",
        "niche",
        "target_audience",
        "onboarding_completed",
        "notifications_enabled",
        "always_add_emojis",
        "always_add_cta",
    )
    list_filter = (
        "default_platform",
        "preferred_language",
        "creator_stage",
        "onboarding_completed",
        "notifications_enabled",
        "always_add_emojis",
        "always_add_cta",
    )
    search_fields = (
        "user__username",
        "user__email",
        "vibe",
        "tone",
        "niche",
        "target_audience",
        "city",
        "country",
    )


# ---------------------------
# Support & reviews
# ---------------------------
@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ("subject", "email", "category", "status", "created_at")
    list_filter = ("category", "status", "created_at")
    search_fields = ("subject", "email", "message")
    ordering = ("-created_at",)


@admin.register(AppReview)
class AppReviewAdmin(admin.ModelAdmin):
    list_display = ("rating", "title", "user", "is_public", "is_featured", "created_at")
    list_filter = ("rating", "is_public", "is_featured", "created_at")
    search_fields = ("title", "comment", "user__username", "user__email")
    ordering = ("-created_at",)


# ---------------------------
# Newsletter
# ---------------------------
@admin.register(NewsletterBlast)
class NewsletterBlastAdmin(admin.ModelAdmin):
    list_display = ("subject", "created_at", "sent_at", "recipients_count", "send_button")
    readonly_fields = ("created_at", "sent_at", "recipients_count", "send_newsletter")

    fields = (
        "subject",
        "body",
        "html_body",
        "send_newsletter",
        "created_at",
        "sent_at",
        "recipients_count",
    )

    def send_button(self, obj):
        if obj.sent_at:
            return "✓ Already sent"
        return "—"

    send_button.short_description = "Send status"

    def send_newsletter(self, obj):
        if obj.id is None:
            return "Save first, then you can send."

        if obj.sent_at:
            return format_html("<strong>Already sent</strong>")

        return format_html(
            '<a class="button" href="{}">Send newsletter now</a>',
            f"./{obj.pk}/send/",
        )

    send_newsletter.short_description = "Send now"

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path(
                "<int:pk>/send/",
                self.admin_site.admin_view(self.process_send),
                name="newsletter-send",
            ),
        ]
        return custom + urls

    def process_send(self, request, pk: int):
        obj = NewsletterBlast.objects.get(pk=pk)
        if obj.sent_at:
            self.message_user(request, "Already sent.")
            return redirect(f"../../{pk}/change/")

        send_newsletter_email_task.delay(
            obj.id,
            obj.subject,
            obj.body,
            obj.html_body or None,
        )

        self.message_user(request, "Newsletter queued! It will be sent shortly.")
        return redirect(f"../../{pk}/change/")


# ---------------------------
# Billing / subscriptions / usage
# ---------------------------
@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("slug", "name", "price_usd", "stripe_price_id")
    search_fields = ("slug", "name", "stripe_price_id")
    ordering = ("price_usd",)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "plan",
        "is_active",
        "start_date",
        "end_date",
        "will_cancel_at_period_end",
        "stripe_customer_id",
        "stripe_subscription_id",
    )
    list_filter = ("plan", "will_cancel_at_period_end")
    search_fields = (
        "user__username",
        "user__email",
        "stripe_customer_id",
        "stripe_subscription_id",
    )
    ordering = ("-start_date",)


@admin.register(MonthlyUsage)
class MonthlyUsageAdmin(admin.ModelAdmin):
    list_display = ("user", "year", "month", "ideas_used", "captions_used")
    list_filter = ("year", "month")
    search_fields = ("user__username", "user__email")
    ordering = ("-year", "-month")


# ---------------------------
# Presets / use cases
# ---------------------------
@admin.register(UseCaseTemplate)
class UseCaseTemplateAdmin(admin.ModelAdmin):
    list_display = ("slug", "title", "main_platform", "preferred_language", "created_at")
    list_filter = ("main_platform", "preferred_language")
    search_fields = ("slug", "title", "short_description")
    ordering = ("title",)


# ---------------------------
# Content library / drafts / uploads
# ---------------------------
@admin.register(MediaUpload)
class MediaUploadAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "media_type", "uploaded_at", "file")
    list_filter = ("media_type",)
    search_fields = ("id", "user__username", "user__email")
    ordering = ("-uploaded_at",)


@admin.register(GeneratedCaption)
class GeneratedCaptionAdmin(admin.ModelAdmin):
    list_display = ("media", "created_at", "is_user_edited")
    list_filter = ("is_user_edited",)
    ordering = ("-created_at",)


@admin.register(Draft)
class DraftAdmin(admin.ModelAdmin):
    list_display = ("user", "draft_type", "title", "pinned", "archived", "created_at")
    list_filter = ("draft_type", "pinned", "archived")
    search_fields = ("user__username", "user__email", "title", "description")
    ordering = ("-created_at",)


# ---------------------------
# Notifications / scheduling
# ---------------------------
@admin.register(PostingReminder)
class PostingReminderAdmin(admin.ModelAdmin):
    list_display = ("user", "scheduled_at", "platform", "notify_email", "notified", "created_at")
    list_filter = ("platform", "notify_email", "notified")
    search_fields = ("user__username", "user__email", "note")
    ordering = ("-scheduled_at",)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "kind", "created_at", "read_at")
    list_filter = ("kind",)
    search_fields = ("user__username", "user__email", "message")
    ordering = ("-created_at",)


# ---------------------------
# Simple registrations (keep what you had)
# ---------------------------
admin.site.register(GlobalTrend)
admin.site.register(PlatformTiming)
admin.site.register(PlannedPostSlot)

# Optional: visibility for these if they exist in your DB and you want them
admin.site.register(SocialAccount)
admin.site.register(PostPerformance)
