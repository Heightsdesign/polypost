# api/auth_serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import serializers

class PostlyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        if not self.user.is_active:
            raise AuthenticationFailed(
                "Please confirm your email before logging in."
            )

        return data
    

class NewsletterSendSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=200)
    body = serializers.CharField()
    html_body = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        # Basic sanity: avoid totally empty body
        if not attrs.get("body") and not attrs.get("html_body"):
            raise serializers.ValidationError("Provide at least a text body or an HTML body.")
        return attrs
