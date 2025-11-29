// src/pages/UseCasesPage.tsx
import { useEffect, useState } from "react";
import api from "../api";

interface UseCaseTemplate {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  main_platform: string;
  preferred_language: string;
  vibe: string | null;
  tone: string | null;
  niche: string | null;
}

export default function UseCasesPage() {
  const [templates, setTemplates] = useState<UseCaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  // BRAND ASSISTANT (AI persona generator)
  const [openBrandModal, setOpenBrandModal] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandForm, setBrandForm] = useState({
    niche: "",
    target_audience: "",
    goals: "",
    comfort_level: "",
  });
  const [brandPersona, setBrandPersona] = useState<any | null>(null);
  const [brandToast, setBrandToast] = useState<string | null>(null);

  async function generateBrandPersona() {
    setBrandLoading(true);
    setBrandPersona(null);

    try {
      const res = await api.post("/brand/persona/", {
        niche: brandForm.niche,
        target_audience: brandForm.target_audience,
        goals: brandForm.goals,
        comfort_level: brandForm.comfort_level,
      });
      setBrandPersona(res.data);
    } catch (err) {
      console.error(err);
      setBrandToast("⚠️ Could not generate brand persona.");
      setTimeout(() => setBrandToast(null), 3500);
    } finally {
      setBrandLoading(false);
    }
  }


  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await api.get("/use-cases/");
        setTemplates(res.data);
      } catch (err) {
        console.error("Failed to load templates:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, []);

  async function applyTemplate(id: number) {
    try {
      await api.post("/use-cases/apply/", { template_id: id });
      setToast("🎉 Preset applied! Your vibe, tone & niche were updated.");
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      console.error(err);
      setToast("⚠️ Failed to apply preset. Please try again.");
      setTimeout(() => setToast(null), 3500);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-offwhite">
      {/* soft diagonal background like landing/dashboard */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `
            radial-gradient(120% 200% at 0% 0%, rgba(255, 111, 145, 0.14), transparent 60%),
            radial-gradient(120% 200% at 100% 100%, rgba(88, 80, 235, 0.18), transparent 60%)
          `,
          opacity: 0.45,
        }}
      />

      {/* center blur glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <div
          className="hidden md:block absolute"
          style={{
            width: 280,
            height: 280,
            borderRadius: "999px",
            background: "rgba(212, 109, 238, 0.35)",
            filter: "blur(70px)",
            top: -40,
            left: -160,
          }}
        />
        <div
          className="hidden md:block absolute"
          style={{
            width: 320,
            height: 320,
            borderRadius: "999px",
            background: "rgba(69, 1, 255, 0.35)",
            filter: "blur(80px)",
            top: 120,
            left: 80,
          }}
        />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Header + explainer */}
        <header className="mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple/80 mb-2">
            Use cases
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-3">
            Make Postly <span className="text-purple">work for your style</span>
          </h1>
          <p className="text-sm md:text-[0.96rem] text-dark/75 max-w-2xl">
            Pick a preset that matches your platform, language and vibe. We&apos;ll
            copy its settings directly into your creator profile
            (vibe, tone, niche, audience…) so ideas and captions feel on-brand
            from day one.
          </p>
        </header>

        {/* Brand Assistant intro card */}
        <section className="mb-10 rounded-3xl bg-white/60 backdrop-blur border border-purple/10 shadow-sm px-5 py-6">
          <h2 className="text-sm md:text-base font-semibold text-dark mb-1 flex items-center gap-2">
            🎭 Define your creator brand (AI-powered)
          </h2>
          <p className="text-xs md:text-sm text-dark/70 mb-3 max-w-2xl">
            Not sure about your vibe, tone or niche? Answer a few questions and Postly
            will generate a personalized brand persona with suggested style, bio and content pillars.
          </p>

          <button
            onClick={() => setOpenBrandModal(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] transition-all"
          >
            Start brand assistant
          </button>
        </section>


        {/* Two-column content: how it works + presets intro */}
        <section className="mb-10 grid gap-6 md:grid-cols-[1.1fr,1fr]">
          {/* How to use Postly / use cases */}
          <div className="rounded-3xl bg-white/40 backdrop-blur border border-purple/10 shadow-sm px-5 py-5 md:px-6 md:py-6">
            <h2 className="text-sm md:text-base font-semibold text-dark mb-3">
              How creators use Postly
            </h2>
            <ul className="text-xs md:text-sm text-dark/75 space-y-2.5">
              <li>
                <strong className="text-dark">1. Pick a preset</strong>{" "}
                that matches your main platform (e.g. OF, IG Reels, TikTok trends…).
              </li>
              <li>
                <strong className="text-dark">2. We copy the settings</strong>{" "}
                (vibe, tone, niche, target audience, language) into your profile.
              </li>
              <li>
                <strong className="text-dark">3. Generate ideas & captions</strong>{" "}
                from the Dashboard — they&apos;ll be aligned with the preset.
              </li>
              <li>
                <strong className="text-dark">4. Tweak anytime</strong>{" "}
                from your Account page if you change style or target.
              </li>
            </ul>
          </div>

          {/* Presets info */}
          <div className="rounded-3xl bg-white/40 backdrop-blur border border-purple/10 shadow-sm px-5 py-5 md:px-6 md:py-6">
            <h2 className="text-sm md:text-base font-semibold text-dark mb-2">
              Preset library
            </h2>
            <p className="text-xs md:text-sm text-dark/75 mb-3">
              We&apos;re adding curated setups for typical creator profiles:
              OF, Instagram models, cosplay, fitness, gaming and more.
            </p>
            <p className="text-xs md:text-[0.8rem] text-dark/60">
              After applying a preset, go to your{" "}
              <span className="font-semibold text-purple">Dashboard</span> and
              start generating — no extra setup needed.
            </p>
          </div>
        </section>

        {/* Templates grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-6 w-6 rounded-full border-2 border-purple/30 border-t-purple animate-spin" />
            <span className="ml-3 text-sm text-dark/70">Loading presets…</span>
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-3xl bg-white/40 backdrop-blur border border-purple/10 shadow-sm px-6 py-10 text-center text-sm text-dark/70">
            No presets yet. We&apos;re still seeding the library — check back soon!
          </div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-semibold text-dark">
                Available presets
              </h2>
              <p className="text-[0.8rem] text-dark/60">
                Click <span className="font-semibold">Apply preset</span> to
                update your creator profile instantly.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <article
                  key={t.id}
                  className="relative rounded-3xl bg-white/80 backdrop-blur border border-purple/10 shadow-sm hover:shadow-lg hover:border-purple/30 transition-all px-4 py-4 md:px-5 md:py-5"
                >
                  <h3 className="text-sm md:text-[0.95rem] font-semibold text-dark mb-1">
                    {t.title}
                  </h3>
                  <p className="text-[0.78rem] md:text-xs text-dark/70 mb-3 line-clamp-3">
                    {t.short_description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4 text-[0.68rem] md:text-[0.7rem]">
                    <span className="inline-flex items-center rounded-full bg-purple/5 border border-purple/15 px-2 py-0.5 text-purple font-medium">
                      {t.main_platform}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-teal/5 border border-teal/15 px-2 py-0.5 text-teal font-medium">
                      {t.preferred_language.toUpperCase()}
                    </span>
                    {t.vibe && (
                      <span className="inline-flex items-center rounded-full bg-yellow/10 border border-yellow/20 px-2 py-0.5 text-[0.7rem] text-yellow-700">
                        {t.vibe}
                      </span>
                    )}
                    {t.tone && (
                      <span className="inline-flex items-center rounded-full bg-pink/10 border border-pink/20 px-2 py-0.5 text-[0.7rem] text-pink-700">
                        {t.tone}
                      </span>
                    )}
                    {t.niche && (
                      <span className="inline-flex items-center rounded-full bg-dark/5 border border-dark/10 px-2 py-0.5 text-[0.7rem] text-dark/80">
                        {t.niche}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => applyTemplate(t.id)}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-3 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
                  >
                    Apply preset
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* BRAND ASSISTANT MODAL */}
        {openBrandModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-xl rounded-3xl bg-white/95 p-5 md:p-6 shadow-2xl border border-purple/10">
              {/* Close button */}
              <button
                onClick={() => setOpenBrandModal(false)}
                className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-purple/5 text-dark/70 hover:bg-purple/10"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold text-dark mb-3">
                Define your creator brand
              </h2>

              <div className="space-y-3 text-xs md:text-sm text-dark/80">
                <input
                  className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                  placeholder="Your niche (fitness, modeling, gamer, OF, beauty...)"
                  value={brandForm.niche}
                  onChange={(e) => setBrandForm({ ...brandForm, niche: e.target.value })}
                />

                <input
                  className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                  placeholder="Who do you want to attract?"
                  value={brandForm.target_audience}
                  onChange={(e) => setBrandForm({ ...brandForm, target_audience: e.target.value })}
                />

                <textarea
                  className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                  placeholder="Your goals (grow fast, build fans, increase OF income...)"
                  rows={3}
                  value={brandForm.goals}
                  onChange={(e) => setBrandForm({ ...brandForm, goals: e.target.value })}
                />

                <input
                  className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                  placeholder="Comfort level (playful, serious, explicit, introverted...)"
                  value={brandForm.comfort_level}
                  onChange={(e) => setBrandForm({ ...brandForm, comfort_level: e.target.value })}
                />

                <button
                  onClick={generateBrandPersona}
                  disabled={brandLoading}
                  className="w-full mt-2 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 font-semibold text-white shadow-md shadow-purple/30 disabled:opacity-60"
                >
                  {brandLoading ? "Thinking..." : "Generate brand persona"}
                </button>
              </div>

              {/* RESULT */}
              {brandPersona && (
                <div className="mt-6 space-y-3 text-xs md:text-sm text-dark/85">
                  <h3 className="font-semibold text-dark text-base">
                    {brandPersona.persona_name}
                  </h3>

                  <p>{brandPersona.brand_summary}</p>

                  <div className="text-[0.8rem] text-dark/70">
                    <strong>Vibe</strong>: {brandPersona.recommended_vibe} <br />
                    <strong>Tone</strong>: {brandPersona.recommended_tone}
                  </div>

                  <div>
                    <strong>Content pillars:</strong>
                    <ul className="list-disc list-inside ml-2">
                      {brandPersona.content_pillars?.map((p: string, i: number) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {brandPersona.brand_bio && (
                    <div>
                      <strong>Suggested bio:</strong>
                      <p className="mt-1 rounded-2xl bg-purple/5 border border-purple/10 px-3 py-2">
                        {brandPersona.brand_bio}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="rounded-2xl bg-dark text-white/90 px-4 py-2 shadow-lg text-xs md:text-sm">
              {toast}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
