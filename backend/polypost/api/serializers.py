from django.contrib.auth.models import User
from rest_framework import serializers
from .models import MediaUpload, GeneratedCaption, PlannedPostSlot, PostPerformance, Draft, MediaUpload, GeneratedCaption, CreatorProfile, UseCaseTemplate


class RegisterSerializer(serializers.Serializer):
    # step 1 - account
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    # step 2 - creator basics
    preferred_language = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    default_platform = serializers.CharField(required=False, allow_blank=True)

    # step 3 - tone / niche
    vibe = serializers.CharField(required=False, allow_blank=True)
    tone = serializers.CharField(required=False, allow_blank=True)
    niche = serializers.CharField(required=False, allow_blank=True)
    target_audience = serializers.CharField(required=False, allow_blank=True)

    # extras / future
    phone = serializers.CharField(required=False, allow_blank=True)
    content_languages = serializers.CharField(required=False, allow_blank=True)
    marketing_opt_in = serializers.BooleanField(required=False, default=False)
    notifications_enabled = serializers.BooleanField(required=False, default=False)
    creator_stage = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def create(self, validated_data):
        # pull out user fields
        username = validated_data.pop("username")
        email = validated_data.pop("email")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

         # user must confirm email before login
        user.is_active = False
        user.save()

        # everything else -> profile
        CreatorProfile.objects.create(
            user=user,
            **validated_data,
            onboarding_completed=True,  # since they went through the flow
        )

        return user
    
class CreatorProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = CreatorProfile
        fields = (
            "id",
            "username",
            "email",
            "vibe",
            "tone",
            "niche",
            "target_audience",
            "always_add_emojis",
            "always_add_cta",
            "default_platform",
            "notifications_enabled",
            "marketing_opt_in",
            "creator_stage",
            "avatar",
        )
        read_only_fields = ("id", "username", "email")

class MediaUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MediaUpload
        fields = ("id", "file", "media_type", "uploaded_at")
        read_only_fields = ("id", "uploaded_at", "media_type")

    def create(self, validated):
        # auto-detect type from mimetype
        file = validated["file"]
        ext  = file.content_type.split("/")[0]
        validated["media_type"] = "video" if ext == "video" else "photo"
        return super().create(validated)


class CaptionGenerateSerializer(serializers.Serializer):
    media_id = serializers.UUIDField()

    def validate(self, attrs):
        user = self.context["request"].user
        media_id = attrs["media_id"]

        try:
            media = MediaUpload.objects.get(id=media_id, user=user)
        except MediaUpload.DoesNotExist:
            raise serializers.ValidationError("Media not found or not owned by you.")

        attrs["media"] = media
        return attrs


class GeneratedCaptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedCaption
        fields = ("id", "text", "is_user_edited", "created_at")


class PlannedPostSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlannedPostSlot
        fields = [
            "id",
            "platform",
            "scheduled_at",
            "title",
            "notify",
            "reminded_at",
            "created_at",
        ]
        read_only_fields = ["id", "reminded_at", "created_at"]


class PostPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostPerformance
        fields = [
            "id",
            "platform",
            "external_id",
            "posted_at",
            "likes",
            "comments",
            "views",
            "shares",
            "source",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate_platform(self, value):
        allowed = ["instagram", "tiktok", "twitter", "onlyfans"]
        if value not in allowed:
            raise serializers.ValidationError(f"Unsupported platform: {value}")
        return value


class DraftSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = Draft
        fields = [
            "id",
            "draft_type",
            "title",
            "description",
            "suggested_caption_starter",
            "hook_used",
            "personal_twist",
            "pinned",
            "archived",
            "created_at",
            "media",
            "caption",
            "media_url",
        ]

    def get_media_url(self, obj):
        if obj.media and obj.media.file:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.media.file.url)
            return obj.media.file.url
        return None

class UseCaseTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UseCaseTemplate
        fields = [
            "id",
            "slug",
            "title",
            "short_description",
            "main_platform",
            "vibe",
            "tone",
            "niche",
            "target_audience",
            "preferred_language",
            "country",
            "city",
            "always_add_emojis",
            "always_add_cta",
            "default_platform",
            "example_caption_hint",
        ]
