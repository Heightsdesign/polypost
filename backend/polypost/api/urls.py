from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from .views import RegisterView, GenerateIdeasView

from rest_framework.routers import DefaultRouter
from .views import (
    MediaUploadViewSet, GenerateCaptionView, GenerateIdeasView,
    PostingSuggestionView, MyPlannedSlotsView, PlanSlotView,
    SchedulerSuggestionsView, AnalyticsIngestView, StripeCheckoutSessionView,
    StripeWebhookView, MySubscriptionView, DraftListCreateView,
    DraftPinView, DraftArchiveView, UseCaseTemplateListView,
    ApplyUseCaseTemplateView, MeProfileView, UsageSummaryView
    )
from .views_auth import PasswordResetRequestView, PasswordResetConfirmView, LoginView, EmailConfirmView, ChangePasswordView

from .views_feedback import (
    SupportTicketCreateView,
    AppReviewListCreateView,
    AppReviewFeaturedListView,
)


router = DefaultRouter()
router.register(r"uploads", MediaUploadViewSet, basename="uploads")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="api-register"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("captions/generate/", GenerateCaptionView.as_view(), name="caption-generate"),
    path("ideas/generate/", GenerateIdeasView.as_view(), name="ideas-generate"),
    path("scheduler/suggestions/", PostingSuggestionView.as_view(), name="posting-suggestions"),
    path("scheduler/plan/", PlanSlotView.as_view(), name="scheduler-plan"),
    path("scheduler/my/", MyPlannedSlotsView.as_view(), name="scheduler-my"),
    path("scheduler/suggestions/", SchedulerSuggestionsView.as_view(), name="scheduler-suggestions"),
    path("analytics/ingest/", AnalyticsIngestView.as_view(), name="analytics-ingest"),
    path("billing/create-checkout-session/", StripeCheckoutSessionView.as_view(), name="stripe-checkout"),
    path("billing/webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
    path("billing/me/", MySubscriptionView.as_view(), name="billing-me"),
    path("drafts/", DraftListCreateView.as_view(), name="draft-list-create"),
    path("drafts/<uuid:pk>/pin/", DraftPinView.as_view(), name="draft-pin"),
    path("drafts/<uuid:pk>/archive/", DraftArchiveView.as_view(), name="draft-archive"),

    path("auth/password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change-password"),
    
    path("auth/login/", LoginView.as_view(), name="token_obtain_pair"),
    path("use-cases/", UseCaseTemplateListView.as_view(), name="use-case-templates"),
    path("use-cases/apply/", ApplyUseCaseTemplateView.as_view(), name="use-case-apply"),
    path("auth/me/profile/", MeProfileView.as_view(), name="me-profile"),
    path("auth/confirm-email/", EmailConfirmView.as_view(), name="confirm-email"),

    # Support / contact
    path("support/", SupportTicketCreateView.as_view(), name="support-create"),

    # Reviews & ratings
    path("reviews/", AppReviewListCreateView.as_view(), name="reviews-list-create"),
    path("reviews/featured/", AppReviewFeaturedListView.as_view(), name="reviews-featured"),

    path("usage/summary/", UsageSummaryView.as_view(), name="usage-summary"),

] + router.urls
