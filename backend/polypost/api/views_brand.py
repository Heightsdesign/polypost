import os
import json
from openai import OpenAI

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from .models import CreatorProfile
from .serializers import BrandPersonaRequestSerializer



client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class BrandPersonaView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = BrandPersonaRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user if request.user.is_authenticated else None
        profile = CreatorProfile.objects.filter(user=user).first()

        # Build a compact prompt using what we know + user answers
        lines = [
            "You are a brand strategist helping a social media creator define their brand personality.",
            "Return ONLY JSON, no extra text, no markdown.",
            "JSON keys: persona_name, brand_summary, recommended_vibe, recommended_tone, content_pillars, brand_bio, do_more_of, avoid.",
            "",
            f"Creator stage: {data.get('creator_stage') or getattr(profile, 'creator_stage', '')}",
            f"Platforms: {', '.join(data.get('platforms') or [getattr(profile, 'default_platform', 'instagram')])}",
            f"Niche: {data.get('niche') or getattr(profile, 'niche', '')}",
            f"Target audience: {data.get('target_audience') or getattr(profile, 'target_audience', '')}",
            f"Goals: {data.get('goals') or 'grow audience & earn more from content'}",
            f"Comfort level: {data.get('comfort_level') or 'average'}",
        ]

        prompt = "\n".join(lines)

        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You create clear, practical brand personas for creators."},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=500,
            )
            raw = completion.choices[0].message.content.strip()
            persona = json.loads(raw)
        except Exception as e:
            return Response(
                {"detail": f"Could not generate brand persona: {e}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # Optional: store on profile
        if profile:
            profile.vibe = persona.get("recommended_vibe") or profile.vibe
            profile.tone = persona.get("recommended_tone") or profile.tone
            profile.niche = persona.get("niche") or profile.niche
            profile.target_audience = persona.get("target_audience") or profile.target_audience
            profile.brand_persona = json.dumps(persona)
            profile.save()

        return Response(persona, status=status.HTTP_200_OK)
