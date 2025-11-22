# api/views_feedback.py
from django.db.models import Avg, Count
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import SupportTicket, AppReview
from .serializers_feedback import SupportTicketSerializer, AppReviewSerializer


# ---------- SUPPORT / CONTACT ----------

class SupportTicketCreateView(generics.CreateAPIView):
    """
    POST /api/support/
    Body: { email, subject, category, message }
    If user is authenticated, we attach request.user automatically.
    """
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.AllowAny]


# ---------- REVIEWS / RATINGS ----------

class AppReviewListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/reviews/           -> list public reviews + stats
    POST /api/reviews/           -> submit a new review (1–5 stars + comment)
    """
    serializer_class = AppReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Only display public reviews
        return AppReview.objects.filter(is_public=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        response = super().list(request, *args, **kwargs)

        stats = queryset.aggregate(
            avg_rating=Avg("rating"),
            total_reviews=Count("id"),
        )
        avg = stats["avg_rating"] or 0

        # Wrap list + stats together
        response.data = {
            "stats": {
                "average_rating": round(float(avg), 2) if avg else 0,
                "total_reviews": stats["total_reviews"],
            },
            "results": response.data,
        }
        return response

    def perform_create(self, serializer):
        # user already attached in serializer.create
        serializer.save()


class AppReviewFeaturedListView(generics.ListAPIView):
    """
    GET /api/reviews/featured/
    Returns a small set of highlighted reviews for your marketing section.
    """
    serializer_class = AppReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = AppReview.objects.filter(is_public=True, is_featured=True)
        if not qs.exists():
            # fallback: top 5 highest ratings if no manual featured reviews
            qs = AppReview.objects.filter(is_public=True).order_by("-rating", "-created_at")
        return qs[:5]
