// src/pages/PricingPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

type PlanCard = {
  id?: number;               // DB id for paid plans
  slug: string;
  name: string;
  priceLabel: string;
  periodLabel: string;
  description: string;
  features: string[];
  highlight?: string;
  isFree?: boolean;
};

const plans: PlanCard[] = [
  {
    slug: "free",
    name: "Free",
    priceLabel: "$0",
    periodLabel: "Forever",
    description: "Perfect if you're just trying Postly out.",
    features: [
      "20 ideas per month",
      "10 AI captions per month",
      "1 main platform",
      "Basic scheduling",
    ],
    isFree: true,
  },
  {
    slug: "monthly",
    name: "Monthly",
    priceLabel: "$12",
    periodLabel: "/month",
    description: "Flexible month-to-month access.",
    features: [
      "300 ideas per month",
      "200 AI captions per month",
      "Multi-platform support",
      "Smart posting times",
    ],
    highlight: "Most popular",
    // ⚠️ replace with the real Plan.id from your DB
    id: 2,
  },
  {
    slug: "quarterly",
    name: "3-Month Plan",
    priceLabel: "$32.40",
    periodLabel: "every 3 months",
    description: "Save 10% when you pay quarterly.",
    features: [
      "900 ideas per 3 months",
      "600 AI captions per 3 months",
      "Multi-platform support",
      "Priority support",
    ],
    highlight: "Save 10%",
    // ⚠️ replace with the real Plan.id from your DB
    id: 3,
  },
  {
    slug: "yearly",
    name: "Yearly",
    priceLabel: "$115.20",
    periodLabel: "/year",
    description: "Best value for serious creators.",
    features: [
      "3600 ideas per year",
      "2400 AI captions per year",
      "Multi-platform support",
      "Priority support",
      "Early access to new features",
    ],
    highlight: "Save 20%",
    // ⚠️ replace with the real Plan.id from your DB
    id: 4,
  },
];

export default function PricingPage() {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleCheckout(plan: PlanCard) {
    setError("");

    if (plan.isFree) {
      // Free plan: just send them to registration
      // (they'll be assigned Free by default / via backend logic)
      window.location.href = "/register";
      return;
    }

    if (!plan.id) {
      setError("This plan is not configured yet. Please try again later.");
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
        // e.g. Free plan or some non-redirect flow
        setError(res.data.detail);
      } else {
        setError("Could not start checkout. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 401) {
        setError("Please log in to upgrade your plan.");
      } else {
        setError("Stripe checkout could not be started.");
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
            Pricing
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-3">
            Choose the <span className="text-purple">plan</span> that fits your creator journey
          </h1>
          <p className="text-sm md:text-[0.95rem] text-dark/70 max-w-2xl mx-auto">
            Start free, then upgrade when you&apos;re ready. Cancel anytime. All paid plans include
            unlimited projects and access to our best AI tools.
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
                    Get started for free
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
          Payments are handled securely by Stripe. You can cancel your subscription at any time.
        </p>
      </div>
    </div>
  );
}
