# api/plan_limits.py
from django.utils import timezone
from .models import Subscription, Plan, MonthlyUsage

def get_user_plan(user) -> Plan:
    """
    Returns the user's active plan, or the 'free' plan as fallback.
    """
    # 1) try subscription
    try:
        sub = Subscription.objects.select_related("plan").get(user=user)
        if sub.plan and sub.is_active():
            return sub.plan
    except Subscription.DoesNotExist:
        pass

    # 2) fallback to free
    return Plan.objects.get(slug="free")


def get_monthly_usage(user) -> MonthlyUsage:
    now = timezone.now()
    usage, _ = MonthlyUsage.objects.get_or_create(
        user=user,
        year=now.year,
        month=now.month,
        defaults={"ideas_used": 0, "captions_used": 0},
    )
    return usage
