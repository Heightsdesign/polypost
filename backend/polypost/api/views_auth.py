import base64
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings

from django.contrib.auth.tokens import default_token_generator

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import PostlyTokenObtainPairSerializer

from .serializers_password import (
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

token_generator = PasswordResetTokenGenerator()

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        # Try to find the user. If none, we still return 200 to avoid user enumeration.
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Pretend success
            return Response({"detail": "If that email exists, a reset link was sent."})

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        # Link for the frontend page that will handle the reset (your page will read uid/token from query params)
        frontend_base = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        reset_url = f"{frontend_base}/reset-password?uid={uid}&token={token}"

        subject = "Polypost — Reset your password"
        message = (
            "You requested a password reset for your Polypost account.\n\n"
            f"Click the link below to set a new password:\n\n{reset_url}\n\n"
            "If you didn’t request this, you can ignore this email."
        )

        send_mail(
            subject,
            message,
            getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@polypost.local"),
            [email],
            fail_silently=True,  # in dev we don't want to blow up the request
        )

        return Response({"detail": "If that email exists, a reset link was sent."})


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uid = serializer.validated_data["uid"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            uid_int = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_int)
        except Exception:
            return Response({"detail": "Invalid reset link."}, status=400)

        if not token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token."}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password has been reset successfully."}, status=200)
    

class LoginView(TokenObtainPairView):
    """
    Custom login that returns JWT tokens with username and email embedded.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = PostlyTokenObtainPairSerializer


class EmailConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        uidb64 = request.data.get("uid")
        token = request.data.get("token")

        if not uidb64 or not token:
            return Response({"detail": "Missing uid or token."}, status=400)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response({"detail": "Invalid confirmation link."}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired confirmation link."}, status=400)

        user.is_active = True
        user.save()

        return Response({"detail": "Email confirmed. You can now log in."}, status=200)