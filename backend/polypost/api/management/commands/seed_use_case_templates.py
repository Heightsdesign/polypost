# backend/polypost/api/management/commands/seed_use_case_templates.py
from django.core.management.base import BaseCommand
from api.models import UseCaseTemplate


TEMPLATES = [
    # ---------- Instagram ----------
    {
        "slug": "ig-fitness-genz-fun",
        "title": "Instagram Fitness (Gen Z, fun)",
        "short_description": "Trendy workout + lifestyle content with short captions, hooks, and relatable humor.",
        "main_platform": "instagram",
        "preferred_language": "en",
        "vibe": "high-energy",
        "tone": "playful",
        "niche": "fitness",
        "target_audience": "Gen Z followers",
        "country": None,
        "city": None,
        "always_add_emojis": True,
        "always_add_cta": True,
        "default_platform": "instagram",
        "example_caption_hint": "POV: you promised ‘just one cookie’… then hit legs day 🍪💪",
    },
    {
        "slug": "ig-beauty-luxury-fr",
        "title": "Instagram Beauty (French, luxury)",
        "short_description": "Polished beauty, skincare and aesthetic reels with a premium tone.",
        "main_platform": "instagram",
        "preferred_language": "fr",
        "vibe": "luxury",
        "tone": "professional",
        "niche": "beauty",
        "target_audience": "Femmes 18–34",
        "country": "France",
        "city": "Paris",
        "always_add_emojis": False,
        "always_add_cta": True,
        "default_platform": "instagram",
        "example_caption_hint": "Routine glow du soir — simple, chic, efficace.",
    },
    {
        "slug": "ig-foodie-cozy",
        "title": "Instagram Foodie (cozy, aesthetic)",
        "short_description": "Recipe carousels + short reels with cozy hooks and simple CTAs.",
        "main_platform": "instagram",
        "preferred_language": "en",
        "vibe": "cozy",
        "tone": "inspirational",
        "niche": "foodie",
        "target_audience": "Home cooks & food lovers",
        "country": None,
        "city": None,
        "always_add_emojis": True,
        "always_add_cta": True,
        "default_platform": "instagram",
        "example_caption_hint": "Save this for your next cozy dinner night.",
    },

    # ---------- TikTok ----------
    {
        "slug": "tt-comedy-sarcastic",
        "title": "TikTok Comedy (sarcastic, fast hooks)",
        "short_description": "Short punchy skits with strong hooks, quick cuts, and bold punchlines.",
        "main_platform": "tiktok",
        "preferred_language": "en",
        "vibe": "bold",
        "tone": "sarcastic",
        "niche": "entertainment",
        "target_audience": "18–30 viewers",
        "country": None,
        "city": None,
        "always_add_emojis": False,
        "always_add_cta": False,
        "default_platform": "tiktok",
        "example_caption_hint": "I tried being productive today. It didn’t try back.",
    },
    {
        "slug": "tt-gamer-edgy",
        "title": "TikTok Gaming (edgy, clips)",
        "short_description": "Gaming highlights, meme edits, and quick commentary with bold tone.",
        "main_platform": "tiktok",
        "preferred_language": "en",
        "vibe": "edgy",
        "tone": "playful",
        "niche": "gamer",
        "target_audience": "Gamers & meme culture",
        "country": None,
        "city": None,
        "always_add_emojis": True,
        "always_add_cta": False,
        "default_platform": "tiktok",
        "example_caption_hint": "If you blink, you miss the clutch.",
    },

    # ---------- YouTube ----------
    {
        "slug": "yt-education-pro",
        "title": "YouTube Education (professional)",
        "short_description": "Educational scripts with clear structure, credibility, and simple calls-to-action.",
        "main_platform": "youtube",
        "preferred_language": "en",
        "vibe": "educational",
        "tone": "professional",
        "niche": "education",
        "target_audience": "Learners & curious viewers",
        "country": None,
        "city": None,
        "always_add_emojis": False,
        "always_add_cta": True,
        "default_platform": "youtube",
        "example_caption_hint": "In this video, we’ll break it down step by step.",
    },
    {
        "slug": "yt-business-inspirational",
        "title": "YouTube Business (inspirational)",
        "short_description": "Founder / business storytelling: lessons, frameworks, and weekly consistency.",
        "main_platform": "youtube",
        "preferred_language": "en",
        "vibe": "bold",
        "tone": "inspirational",
        "niche": "business",
        "target_audience": "Entrepreneurs",
        "country": None,
        "city": None,
        "always_add_emojis": False,
        "always_add_cta": True,
        "default_platform": "youtube",
        "example_caption_hint": "Here’s what I’d do if I had to start from zero again.",
    },

    # ---------- Twitter/X ----------
    {
        "slug": "x-personal-brand-confident",
        "title": "Twitter/X Personal Brand (confident threads)",
        "short_description": "Concise insights, strong POV, and thread-first content to build authority.",
        "main_platform": "twitter",
        "preferred_language": "en",
        "vibe": "bold",
        "tone": "confident",
        "niche": "personal brand",
        "target_audience": "Professionals",
        "country": None,
        "city": None,
        "always_add_emojis": False,
        "always_add_cta": True,
        "default_platform": "twitter",
        "example_caption_hint": "A thread on what nobody tells you about consistency:",
    },

    # ---------- OnlyFans / MYM ----------
    {
        "slug": "of-flirty-french",
        "title": "OnlyFans (French, flirty)",
        "short_description": "Flirty, playful posts with safe teasing, strong CTAs, and consistent schedule.",
        "main_platform": "onlyfans",
        "preferred_language": "fr",
        "vibe": "bold",
        "tone": "flirty",
        "niche": "onlyfans",
        "target_audience": "Abonnés",
        "country": "France",
        "city": None,
        "always_add_emojis": True,
        "always_add_cta": True,
        "default_platform": "onlyfans",
        "example_caption_hint": "Tu veux la suite ? 😉 (lien en bio / DM)",
    },
    {
        "slug": "mym-playful-es",
        "title": "MYM Fans (Spanish, playful)",
        "short_description": "Playful content with consistent engagement prompts and “next post” anticipation.",
        "main_platform": "mym",
        "preferred_language": "es",
        "vibe": "fun",
        "tone": "playful",
        "niche": "mym",
        "target_audience": "Suscriptores",
        "country": None,
        "city": None,
        "always_add_emojis": True,
        "always_add_cta": True,
        "default_platform": "mym",
        "example_caption_hint": "¿Quieres la parte 2? 😏",
    },

    # ---------- General ----------
    {
        "slug": "general-starter-friendly",
        "title": "Starter Creator (simple + consistent)",
        "short_description": "Low-pressure, beginner-friendly content plan: simple hooks, clear CTAs, repeatable formats.",
        "main_platform": "general",
        "preferred_language": "en",
        "vibe": "chill",
        "tone": "empathetic",
        "niche": "general creator",
        "target_audience": "New followers",
        "country": None,
        "city": None,
        "always_add_emojis": True,
        "always_add_cta": True,
        "default_platform": "instagram",
        "example_caption_hint": "If you’re starting out too, save this and try it this week.",
    },
]


class Command(BaseCommand):
    help = "Seed (create/update) the UseCaseTemplate presets."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete all existing UseCaseTemplate rows before seeding.",
        )

    def handle(self, *args, **options):
        if options.get("reset"):
            count, _ = UseCaseTemplate.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Deleted {count} UseCaseTemplate rows."))

        created = 0
        updated = 0

        for tpl in TEMPLATES:
            slug = tpl["slug"]
            obj, was_created = UseCaseTemplate.objects.update_or_create(
                slug=slug,
                defaults=tpl,
            )
            created += int(was_created)
            updated += int(not was_created)

        self.stdout.write(self.style.SUCCESS(
            f"Seed complete. Created={created}, Updated={updated}, Total={UseCaseTemplate.objects.count()}."
        ))
