# backend/polypost/api/management/commands/seed_plans.py

from django.core.management.base import BaseCommand
from api.models import Plan


class Command(BaseCommand):
    help = "Seed or update the default pricing plans (Free, Monthly, Quarterly, Yearly)."

    # Your real Stripe recurring price IDs
    STRIPE_PRICE_MONTHLY = "price_1ScWA7CFmc14QD2eOIGgrZzW"
    STRIPE_PRICE_QUARTERLY = "price_1ScW6pCFmc14QD2e0rrAJCYD"
    STRIPE_PRICE_YEARLY = "price_1ScWBNCFmc14QD2eEB0nsDpC"

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING("Deleting existing Plan entries..."))
        Plan.objects.all().delete()

        self.stdout.write(self.style.SUCCESS("✔ Cleared existing plans."))

        plan_specs = [
            # FREE PLAN
            {
                "slug": "free",
                "name": "Free",
                "price_usd": 0,
                "stripe_price_id": None,
                "ideas_per_month": 50,
                "captions_per_month": 30,
                "drafts_limit": 25,
                "media_uploads_per_month": 20,
                "posting_reminders_per_month": 20,
                "max_upload_mb": 20,
                "max_video_seconds": 60,
            },

            # MONTHLY
            {
                "slug": "monthly",
                "name": "Pro – Monthly",
                "price_usd": 11.99,  # charm pricing
                "stripe_price_id": self.STRIPE_PRICE_MONTHLY,
                "ideas_per_month": 300,
                "captions_per_month": 200,
                "drafts_limit": 200,
                "media_uploads_per_month": 150,
                "posting_reminders_per_month": 200,
                "max_upload_mb": 200,
                "max_video_seconds": 180,
            },

            # QUARTERLY
            {
                "slug": "quarterly",
                "name": "Pro – Quarterly",
                "price_usd": 32.40,  # your calculated discount
                "stripe_price_id": self.STRIPE_PRICE_QUARTERLY,
                "ideas_per_month": 900,    # 3× monthly
                "captions_per_month": 600, # 3× monthly
                "drafts_limit": 600,
                "media_uploads_per_month": 450,
                "posting_reminders_per_month": 600,
                "max_upload_mb": 200,
                "max_video_seconds": 180,
            },

            # YEARLY
            {
                "slug": "yearly",
                "name": "Pro – Yearly",
                "price_usd": 115.20,  # 20% discount
                "stripe_price_id": self.STRIPE_PRICE_YEARLY,
                "ideas_per_month": 3600,
                "captions_per_month": 2400,
                "drafts_limit": 2400,
                "media_uploads_per_month": 1800,
                "posting_reminders_per_month": 2400,
                "max_upload_mb": 200,
                "max_video_seconds": 180,
            },
        ]

        for spec in plan_specs:
            slug = spec["slug"]
            defaults = {k: v for k, v in spec.items() if k != "slug"}

            obj = Plan.objects.create(slug=slug, **defaults)
            self.stdout.write(self.style.SUCCESS(f"✔ Created plan: {obj.slug}"))

        self.stdout.write(self.style.SUCCESS("\nAll plans seeded successfully!"))
