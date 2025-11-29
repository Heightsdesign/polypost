from django.contrib import admin
from .tasks import send_newsletter_email_task
from django.utils.html import format_html
from django.shortcuts import redirect

# Register your models here.
from .models import  GlobalTrend, PlatformTiming, PlannedPostSlot, MediaUpload, CreatorProfile, NewsletterBlast, SupportTicket, AppReview

@admin.register(CreatorProfile)
class CreatorProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "vibe", "tone", "default_platform", "always_add_emojis", "always_add_cta")
    list_filter = ("default_platform", "always_add_emojis", "always_add_cta")
    search_fields = ("user__username", "vibe", "tone")

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
  list_display = ("subject", "email", "category", "status", "created_at")
  list_filter = ("category", "status", "created_at")
  search_fields = ("subject", "email", "message")


@admin.register(AppReview)
class AppReviewAdmin(admin.ModelAdmin):
  list_display = ("rating", "title", "user", "is_public", "is_featured", "created_at")
  list_filter = ("rating", "is_public", "is_featured", "created_at")
  search_fields = ("title", "comment", "user__username")

from django.contrib import admin
from django.utils.html import format_html
from .models import NewsletterBlast
from .tasks import send_newsletter_email_task


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
            f"./{obj.pk}/send/"
        )
    send_newsletter.short_description = "Send now"


    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()

        custom = [
            path("<int:pk>/send/", self.admin_site.admin_view(self.process_send), name="newsletter-send"),
        ]
        return custom + urls

    def process_send(self, request, pk: int):
        obj = NewsletterBlast.objects.get(pk=pk)
        if obj.sent_at:
            self.message_user(request, "Already sent.")
            return redirect(f"../../{pk}/change/")

        # queue celery job
        send_newsletter_email_task.delay(
            obj.id,
            obj.subject,
            obj.body,
            obj.html_body or None,
        )

        self.message_user(request, "Newsletter queued! It will be sent shortly.")
        return redirect(f"../../{pk}/change/")

  
admin.site.register(GlobalTrend)
admin.site.register(PlatformTiming)
admin.site.register(PlannedPostSlot)
admin.site.register(MediaUpload)
