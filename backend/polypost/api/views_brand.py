# api/views_brand.py
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from .serializers import BrandPersonaRequestSerializer
from .utils import build_brand_personas 

from rest_framework import serializers
from .utils import client
from .email_templates import normalize_lang_code
from .views import get_request_lang
from .models import CreatorProfile

class BrandPersonaView(APIView):
    """
    Public endpoint: returns 3 persona options.
    Used both during registration (anonymous) and for logged-in users.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = BrandPersonaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # 🔥 Resolve language:
        # 1) if payload provides preferred_language, use it
        # 2) otherwise let get_request_lang fall back to profile/IP/default
        raw_lang = data.get("preferred_language") or request.data.get("preferred_language")
        lang = get_request_lang(request, raw_lang)

        print(f"[BRAND_PERSONA_VIEW] raw_lang={raw_lang!r} -> resolved_lang={lang!r}")

        personas_data = build_brand_personas(
            niche=data.get("niche", ""),
            target_audience=data.get("target_audience", ""),
            goals=data.get("goals", ""),
            comfort_level=data.get("comfort_level", ""),
            user=request.user if request.user.is_authenticated else None,
            lang=lang,
        )

        return Response(personas_data, status=status.HTTP_200_OK)


class BrandSampleCaptionsSerializer(serializers.Serializer):
    persona_name = serializers.CharField(required=False, allow_blank=True)
    recommended_vibe = serializers.CharField(required=False, allow_blank=True)
    recommended_tone = serializers.CharField(required=False, allow_blank=True)
    niche = serializers.CharField(required=False, allow_blank=True)
    target_audience = serializers.CharField(required=False, allow_blank=True)
    platform = serializers.CharField(required=False, allow_blank=True)  # e.g. instagram


class BrandSampleCaptionsView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = BrandSampleCaptionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        platform = data.get("platform") or "instagram"
        lang = get_request_lang(request)

        prompt_lines = [
            "You write short social media posts that match a brand persona.",
            f"The captions you output MUST be written in the language with ISO code '{lang}'. "
            "Do NOT output English if that code is not 'en'.",
            "",
            f"Persona name: {data.get('persona_name') or 'Creator'}",
            f"Vibe: {data.get('recommended_vibe') or 'Fun'}",
            f"Tone: {data.get('recommended_tone') or 'Casual'}",
            f"Niche: {data.get('niche') or 'general creator'}",
            f"Target audience: {data.get('target_audience') or 'followers'}",
            f"Platform: {platform}",
            "",
            "Generate EXACTLY 3 short caption ideas (1–2 sentences each).",
            "They should feel aligned with the vibe & tone and speak to the audience.",
            "",
            "Return ONLY JSON in this shape:",
            '{ "captions": ["...", "...", "..."] }',
        ]
        prompt = "\n".join(prompt_lines)

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You generate on-brand social captions."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=300,
        )
        raw = completion.choices[0].message.content.strip()

        try:
            data = json.loads(raw)
        except Exception:
            # fallback: simple splitting
            data = {"captions": [raw]}

        if not isinstance(data, dict) or "captions" not in data:
            data = {"captions": [raw]}

        return Response(data, status=status.HTTP_200_OK)