// src/pages/SupportPage.tsx
import React, { useState } from "react";
import { submitSupportTicket } from "../api";
import { useLanguage } from "../i18n/LanguageContext";
import SoftBackground from "../components/SoftBackground";

type Category = "bug" | "billing" | "idea" | "other";

const CATEGORY_VALUES: Category[] = ["bug", "billing", "idea", "other"];

const SupportPage: React.FC = () => {
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Category>("bug");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      await submitSupportTicket({ email, subject, category, message });
      setSuccess(t("support_success"));
      setEmail("");
      setSubject("");
      setCategory("bug");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError(t("support_error"));
    } finally {
      setSubmitting(false);
    }
  }

  const categoryOptions = CATEGORY_VALUES.map((value) => ({
    value,
    label: t(`support_category_${value}`),
  }));

  return (
     <div className="relative min-h-screen bg-offwhite overflow-hidden">
      {/* shared soft background */}
      <SoftBackground opacity={0.45} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple/80 mb-2">
            {t("support_eyebrow")}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-2">
            {t("support_title_prefix")}{" "}
            <span className="text-purple">
              {t("support_title_accent")}
            </span>
          </h1>
          <p className="text-sm md:text-[0.95rem] text-dark/70 max-w-2xl">
            {t("support_subtitle")}
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-[minmax(0,3fr),minmax(0,2fr)] items-start">
          {/* LEFT: form */}
          <section className="bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-purple/10 px-5 py-6 md:px-7 md:py-7">
            {success && (
              <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs md:text-sm text-emerald-900 flex items-start gap-2">
                <span className="mt-[2px]">✅</span>
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs md:text-sm text-red-900 flex items-start gap-2">
                <span className="mt-[2px]">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark/70">
                  {t("support_label_email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("support_placeholder_email")}
                  className="w-full rounded-2xl border border-purple/20 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple/40"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark/70">
                  {t("support_label_subject")}
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t("support_placeholder_subject")}
                  className="w-full rounded-2xl border border-purple/20 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple/40"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark/70">
                  {t("support_label_category")}
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as Category)
                  }
                  className="w-full rounded-2xl border border-purple/20 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple/40"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark/70">
                  {t("support_label_message")}
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("support_placeholder_message")}
                  rows={5}
                  className="w-full rounded-2xl border border-purple/20 bg-white/90 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple/40"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-purple to-pink shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? t("support_button_sending")
                    : t("support_button_send")}
                </button>
              </div>
            </form>
          </section>

          {/* RIGHT: helper text */}
          <aside className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-purple/10 px-5 py-5 text-xs md:text-sm text-dark/75">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-purple mb-2">
              {t("support_sidebar_title")}
            </p>
            <ul className="space-y-2">
              <li>• {t("support_sidebar_item_platforms")}</li>
              <li>• {t("support_sidebar_item_action")}</li>
              <li>• {t("support_sidebar_item_errors")}</li>
            </ul>
            <p className="mt-4 text-[0.8rem] text-dark/60">
              {t("support_sidebar_billing_note")}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
