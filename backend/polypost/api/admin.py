from django.contrib import admin
from .models import SupportTicket, AppReview

# Register your models here.
from .models import  GlobalTrend, PlatformTiming, PlannedPostSlot, MediaUpload, CreatorProfile

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
  
admin.site.register(GlobalTrend)
admin.site.register(PlatformTiming)
admin.site.register(PlannedPostSlot)
admin.site.register(MediaUpload)
