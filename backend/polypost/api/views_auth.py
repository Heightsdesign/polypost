import base64
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import update_session_auth_hash

from django.contrib.auth.tokens import default_token_generator

from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializers import PostlyTokenObtainPairSerializer, NewsletterSendSerializer

from .serializers_password import (
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    ChangePasswordSerializer,
)

from .utils import send_postly_email
from .tasks import send_login_alert_email, send_newsletter_email_task
from .email_templates import get_email_text


token_generator = PasswordResetTokenGenerator()

def get_user_email_lang(user) -> str:
  """
  Best-effort lookup of the user's language for emails.
  """
  from api.email_templates import normalize_lang_code  # adjust import if needed

  lang = None

  # Try CreatorProfile.preferred_language if it exists
  try:
      profile = getattr(user, "creatorprofile", None)
      if profile is not None:
          lang = getattr(profile, "preferred_language", None)
  except Exception:
      lang = None

  # Optionally: if you ever add user.preferred_language directly on User
  if not lang:
      lang = getattr(user, "preferred_language", None)

  return normalize_lang_code(lang)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Pretend success
            return Response({"detail": "If that email exists, a reset link was sent."})

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        frontend_base = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        reset_url = f"{frontend_base}/reset-password?uid={uid}&token={token}"

        # Figure out language from user profile
        lang = get_user_email_lang(user)
        email_copy = get_email_text("password_reset", lang)

        send_postly_email(
            to_email=email,
            subject=email_copy["subject"],
            message_text=email_copy["message"],
            button_text=email_copy["button_text"],
            button_url=reset_url,
            lang=lang,
            fail_silently=True,
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
    Sends a login alert email asynchronously via Celery.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = PostlyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # 👇 Call the parent implementation (keeps your existing logic)
        response = super().post(request, *args, **kwargs)

        # If authentication failed, response.data won't have refresh/access
        if response.status_code != 200:
            return response

        # The serializer used by TokenObtainPairView attaches "user" to context
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=False)
        user = serializer.user

        # Extract IP + User Agent
        ip = (
            request.META.get("HTTP_X_FORWARDED_FOR")
            or request.META.get("REMOTE_ADDR")
        )
        ua = request.META.get("HTTP_USER_AGENT", "")

        # 🔔 Trigger login alert email (async via Celery)
        send_login_alert_email.delay(user.id, ip, ua)

        return response

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

        # Activate user
        user.is_active = True
        user.save()

        # Build dashboard URL
        frontend_base = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        dashboard_url = f"{frontend_base}/dashboard"

        # Language from user profile
        lang = get_user_email_lang(user)
        email_copy = get_email_text("welcome_after_confirm", lang)

        send_postly_email(
            to_email=user.email,
            subject=email_copy["subject"],
            message_text=email_copy["message"],
            button_text=email_copy["button_text"],
            button_url=dashboard_url,
            lang=lang,
            fail_silently=True,
        )

        return Response({"detail": "Email confirmed. You can now log in."}, status=200)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        old_password = serializer.validated_data["old_password"]
        new_password = serializer.validated_data["new_password"]

        if not user.check_password(old_password):
            return Response(
                {"detail": "Your current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        # keep user logged in after password change
        update_session_auth_hash(request, user)

        return Response(
            {"detail": "Password updated successfully."},
            status=status.HTTP_200_OK,
        )
    

class NewsletterSendView(APIView):
    """
    POST /api/newsletter/send/

    Admin-only endpoint to broadcast a newsletter to all
    users who have marketing_opt_in=True.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = NewsletterSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        subject = serializer.validated_data["subject"]
        body = serializer.validated_data["body"]
        html_body = serializer.validated_data.get("html_body") or None

        # queue background job
        send_newsletter_email_task.delay(subject, body, html_body)

        return Response(
            {
                "detail": "Newsletter queued.",
                "subject": subject,
            },
            status=status.HTTP_202_ACCEPTED,
        )