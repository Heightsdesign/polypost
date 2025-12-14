# backend/polypost/api/management/commands/seed_plans.py
import os
from django.core.management.base import BaseCommand, CommandError
from api.models import Plan


class Command(BaseCommand):
    help = "Seed or update the default pricing plans (Free, Monthly, Quarterly, Yearly)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete all existing Plan entries before seeding.",
        )

    def handle(self, *args, **options):
        if options.get("--reset") or options.get("reset"):
            self.stdout.write(self.style.WARNING("Deleting existing Plan entries..."))
            Plan.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("✔ Cleared existing plans."))

        monthly = os.getenv("STRIPE_PRICE_MONTHLY")
        quarterly = os.getenv("STRIPE_PRICE_QUARTERLY")
        yearly = os.getenv("STRIPE_PRICE_YEARLY")

        # Free is fine to be None; paid plans must be set in prod
        if not monthly or not quarterly or not yearly:
            raise CommandError(
                "Missing Stripe price env vars. Set STRIPE_PRICE_MONTHLY, "
                "STRIPE_PRICE_QUARTERLY, STRIPE_PRICE_YEARLY in your .env."
            )

        plan_specs = [
            {
                "slug": "free",
                "defaults": {
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
            },
            {
                "slug": "monthly",
                "defaults": {
                    "name": "Pro – Monthly",
                    "price_usd": 11.99,
                    "stripe_price_id": monthly,
                    "ideas_per_month": 300,
                    "captions_per_month": 200,
                    "drafts_limit": 200,
                    "media_uploads_per_month": 150,
                    "posting_reminders_per_month": 200,
                    "max_upload_mb": 200,
                    "max_video_seconds": 180,
                },
            },
            {
                "slug": "quarterly",
                "defaults": {
                    "name": "Pro – Quarterly",
                    "price_usd": 32.40,
                    "stripe_price_id": quarterly,
                    "ideas_per_month": 900,
                    "captions_per_month": 600,
                    "drafts_limit": 600,
                    "media_uploads_per_month": 450,
                    "posting_reminders_per_month": 600,
                    "max_upload_mb": 200,
                    "max_video_seconds": 180,
                },
            },
            {
                "slug": "yearly",
                "defaults": {
                    "name": "Pro – Yearly",
                    "price_usd": 115.20,
                    "stripe_price_id": yearly,
                    "ideas_per_month": 3600,
                    "captions_per_month": 2400,
                    "drafts_limit": 2400,
                    "media_uploads_per_month": 1800,
                    "posting_reminders_per_month": 2400,
                    "max_upload_mb": 200,
                    "max_video_seconds": 180,
                },
            },
        ]

        created = 0
        updated = 0

        for spec in plan_specs:
            slug = spec["slug"]
            obj, was_created = Plan.objects.update_or_create(
                slug=slug,
                defaults=spec["defaults"],
            )
            created += int(was_created)
            updated += int(not was_created)
            self.stdout.write(self.style.SUCCESS(f"✔ Seeded plan: {obj.slug}"))

        self.stdout.write(self.style.SUCCESS(f"\nDone. Created={created}, Updated={updated}."))
