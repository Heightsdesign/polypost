// src/pages/SupportPage.tsx
import React, { useState } from "react";
import { submitSupportTicket } from "../api";

const CATEGORIES = [
  { value: "bug", label: "Bug / something broke" },
  { value: "billing", label: "Billing & subscriptions" },
  { value: "idea", label: "Feature request / idea" },
  { value: "other", label: "Other" },
];

const SupportPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<"bug" | "billing" | "idea" | "other">(
    "bug"
  );
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
      setSuccess(
        "✅ Thanks! Your message has been sent. We’ll get back to you by email."
      );
      setEmail("");
      setSubject("");
      setCategory("bug");
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-offwhite">
      {/* soft background, same vibe as register */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `
            radial-gradient(120% 200% at 0% 0%, rgba(255, 111, 145, 0.12), transparent 60%),
            radial-gradient(120% 200% at 100% 100%, rgba(88, 80, 235, 0.16), transparent 60%)
          `,
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple/80 mb-2">
            Need help?
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-2">
            Contact <span className="text-purple">support</span>
          </h1>
          <p className="text-sm md:text-[0.95rem] text-dark/70 max-w-2xl">
            Found a bug, billing issue or have an idea? Send us a message and
            we’ll usually reply within 1–2 business days.
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
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-purple/20 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple/40"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark/70">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Short summary of your issue"
                  className="w-full rounded-2xl border border-purple/20 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple/40"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark/70">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as typeof category)
                  }
                  className="w-full rounded-2xl border border-purple/20 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple/40"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-dark/70">
                  Message
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what’s going on, steps to reproduce, links, etc."
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
                  {submitting ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          </section>

          {/* RIGHT: helper text */}
          <aside className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-purple/10 px-5 py-5 text-xs md:text-sm text-dark/75">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-purple mb-2">
              What to include
            </p>
            <ul className="space-y-2">
              <li>• Which platform(s) you’re using (IG, TikTok, OF…)</li>
              <li>• What you were trying to do when the issue happened</li>
              <li>• Any error messages or screenshots</li>
            </ul>
            <p className="mt-4 text-[0.8rem] text-dark/60">
              For billing questions, please mention the email used on Stripe.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
