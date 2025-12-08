// src/pages/PricingPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { t } from "../i18n/translations";
import { useLanguage } from "../i18n/LanguageContext";

type PlanCard = {
  id?: number; // DB id for paid plans
  slug: string;
  name: string;
  priceLabel: string;
  periodLabel: string;
  description: string;
  features: string[];
  highlight?: string;
  isFree?: boolean;
};

export default function PricingPage() {
  const { lang } = useLanguage();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Build plans with translated labels
  const plans: PlanCard[] = [
    {
      slug: "free",
      name: t(lang, "pricing_plan_free_name"),
      priceLabel: t(lang, "pricing_plan_free_price"),
      periodLabel: t(lang, "pricing_plan_free_period"),
      description: t(lang, "pricing_plan_free_description"),
      features: [
        t(lang, "pricing_plan_free_feature_ideas"),
        t(lang, "pricing_plan_free_feature_captions"),
        t(lang, "pricing_plan_free_feature_platforms"),
        t(lang, "pricing_plan_free_feature_scheduler"),
        t(lang, "pricing_plan_free_feature_storage"),
      ],
      isFree: true,
    },
    {
      slug: "monthly",
      name: t(lang, "pricing_plan_monthly_name"),
      priceLabel: t(lang, "pricing_plan_monthly_price"),
      periodLabel: t(lang, "pricing_plan_monthly_period"),
      description: t(lang, "pricing_plan_monthly_description"),
      features: [
        t(lang, "pricing_plan_monthly_feature_ideas"),
        t(lang, "pricing_plan_monthly_feature_captions"),
        t(lang, "pricing_plan_monthly_feature_platforms"),
        t(lang, "pricing_plan_monthly_feature_scheduler"),
        t(lang, "pricing_plan_monthly_feature_storage"),
      ],
      highlight: t(lang, "pricing_plan_monthly_highlight"),
      // ⚠️ replace with the real Plan.id from your DB
      id: 2,
    },
    {
      slug: "quarterly",
      name: t(lang, "pricing_plan_quarterly_name"),
      priceLabel: t(lang, "pricing_plan_quarterly_price"),
      periodLabel: t(lang, "pricing_plan_quarterly_period"),
      description: t(lang, "pricing_plan_quarterly_description"),
      features: [
        t(lang, "pricing_plan_quarterly_feature_ideas"),
        t(lang, "pricing_plan_quarterly_feature_captions"),
        t(lang, "pricing_plan_quarterly_feature_platforms"),
        t(lang, "pricing_plan_quarterly_feature_scheduler"),
        t(lang, "pricing_plan_quarterly_feature_storage"),
      ],
      highlight: t(lang, "pricing_plan_quarterly_highlight"),
      // ⚠️ replace with the real Plan.id from your DB
      id: 3,
    },
    {
      slug: "yearly",
      name: t(lang, "pricing_plan_yearly_name"),
      priceLabel: t(lang, "pricing_plan_yearly_price"),
      periodLabel: t(lang, "pricing_plan_yearly_period"),
      description: t(lang, "pricing_plan_yearly_description"),
      features: [
        t(lang, "pricing_plan_yearly_feature_ideas"),
        t(lang, "pricing_plan_yearly_feature_captions"),
        t(lang, "pricing_plan_yearly_feature_platforms"),
        t(lang, "pricing_plan_yearly_feature_scheduler"),
        t(lang, "pricing_plan_yearly_feature_storage"),
      ],
      highlight: t(lang, "pricing_plan_yearly_highlight"),
      // ⚠️ replace with the real Plan.id from your DB
      id: 4,
    },
  ];

  async function handleCheckout(plan: PlanCard) {
    setError("");

    if (plan.isFree) {
      // Free plan: redirect to registration
      window.location.href = "/register";
      return;
    }

    if (!plan.id) {
      setError(t(lang, "pricing_error_not_configured"));
      return;
    }

    try {
      setLoadingSlug(plan.slug);

      const res = await api.post("/billing/create-checkout-session/", {
        plan_id: plan.id,
      });

      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else if (res.data.detail) {
        setError(res.data.detail);
      } else {
        setError(t(lang, "pricing_error_checkout_generic"));
      }
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) {
        setError(t(lang, "pricing_error_login_required"));
      } else {
        setError(t(lang, "pricing_error_checkout_stripe"));
      }
    } finally {
      setLoadingSlug(null);
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-offwhite px-4 md:px-8 py-10 md:py-16">
      {/* Soft background aura like landing */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `
            radial-gradient(120% 200% at 0% 0%, rgba(255, 111, 145, 0.12), transparent 60%),
            radial-gradient(120% 200% at 100% 100%, rgba(88, 80, 235, 0.16), transparent 60%)
          `,
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10 md:mb-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-purple/80 mb-2">
            {t(lang, "pricing_header_badge")}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-3">
            {t(lang, "pricing_header_title")}
          </h1>
          <p className="text-sm md:text-[0.95rem] text-dark/70 max-w-2xl mx-auto">
            {t(lang, "pricing_header_subtitle")}
          </p>
        </header>

        {/* Error banner (if any) */}
        {error && (
          <div className="mb-6 max-w-3xl mx-auto rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Plans grid */}
        <section className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const isPopular = plan.slug === "monthly";
            const loading = loadingSlug === plan.slug;

            return (
              <div
                key={plan.slug}
                className={`relative flex flex-col rounded-3xl border border-purple/10 bg-white/95 backdrop-blur shadow-xl px-5 py-6 md:px-6 md:py-7 ${
                  isPopular ? "ring-2 ring-purple/40" : ""
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 right-4 rounded-full bg-purple text-white text-[10px] font-semibold px-3 py-1 shadow-md shadow-purple/40">
                    {plan.highlight}
                  </div>
                )}

                <h2 className="text-lg md:text-xl font-bold text-dark mb-1">
                  {plan.name}
                </h2>
                <p className="text-xs text-dark/60 mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl md:text-3xl font-extrabold text-dark">
                    {plan.priceLabel}
                  </span>
                </div>
                <div className="text-[11px] uppercase tracking-wide text-dark/50 mb-5">
                  {plan.periodLabel}
                </div>

                <ul className="text-xs md:text-[0.85rem] text-dark/75 space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 items-start">
                      <span className="mt-0.5 text-purple">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.isFree ? (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-2xl text-sm font-semibold border border-purple/20 text-purple bg-white hover:bg-purple/5 transition-all"
                  >
                    {t(lang, "pricing_plan_free_cta")}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCheckout(plan)}
                    disabled={loading}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-purple to-pink shadow-md shadow-purple/30 hover:shadow-purple/40 hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Redirecting…" : "Choose plan"}
                  </button>
                )}
              </div>
            );
          })}
        </section>

        {/* Small reassurance footnote */}
        <p className="mt-8 text-[11px] text-center text-dark/50">
          {t(lang, "pricing_footer_note")}
        </p>
      </div>
    </div>
  );
}
