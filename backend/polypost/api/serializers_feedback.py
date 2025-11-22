# api/serializers_feedback.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import SupportTicket, AppReview


class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = [
            "id",
            "user",
            "email",
            "subject",
            "category",
            "message",
            "status",
            "created_at",
        ]
        read_only_fields = ["id", "user", "status", "created_at"]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            validated_data["user"] = request.user
            # if user didn't fill email, default to account email
            if not validated_data.get("email"):
                validated_data["email"] = request.user.email
        return super().create(validated_data)


class AppReviewSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AppReview
        fields = [
            "id",
            "username",   # derived
            "rating",
            "title",
            "comment",
            "is_public",
            "is_featured",
            "created_at",
        ]
        read_only_fields = ["id", "is_featured", "created_at", "is_public"]

    def get_username(self, obj):
        return obj.user.username if obj.user else None

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user if request and request.user.is_authenticated else None
        return AppReview.objects.create(user=user, **validated_data)
