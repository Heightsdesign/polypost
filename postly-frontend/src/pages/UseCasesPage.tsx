// src/pages/UseCasesPage.tsx
import { useEffect, useState } from "react";
import api from "../api";
import { useLanguage } from "../i18n/LanguageContext";

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
  const { lang, t } = useLanguage();

  // for AI calls we only support these 4
  const effectiveLang =
    ["en", "fr", "es", "pt"].includes(lang as any) ? (lang as any) : "en";

  const [templates, setTemplates] = useState<UseCaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // BRAND ASSISTANT (AI personas)
  const [brandForm, setBrandForm] = useState({
    niche: "",
    target_audience: "",
    goals: "",
    comfort_level: "",
  });
  const [brandPersonas, setBrandPersonas] = useState<any[]>([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [selectedPersonaIndex, setSelectedPersonaIndex] =
    useState<number | null>(null);

  // 🔹 Bio variants from AI (for the currently refined persona)
  const [bioVariants, setBioVariants] = useState<{
    short_bio?: string;
    long_bio?: string;
    cta_bio?: string;
    fun_bio?: string;
  } | null>(null);
  const [bioLoading, setBioLoading] = useState(false);
  const [bioPersonaIndex, setBioPersonaIndex] = useState<number | null>(null);

  async function generateBrandPersona() {
    setBrandLoading(true);
    setBrandError(null);
    setBrandPersonas([]);
    setSelectedPersonaIndex(null);
    setBioVariants(null);
    setBioPersonaIndex(null);

    try {
      const res = await api.post("/brand/persona/", {
        niche: brandForm.niche,
        target_audience: brandForm.target_audience,
        goals: brandForm.goals,
        comfort_level: brandForm.comfort_level,
        preferred_language: effectiveLang, // 🔹 ensure multilingual personas
      });

      // Support either:
      // { personas: [...] }  OR a single object / array directly
      let personas = (res.data as any).personas ?? res.data;
      if (!Array.isArray(personas)) {
        personas = [personas];
      }

      setBrandPersonas(personas);
    } catch (err) {
      console.error(err);
      setBrandError(t("usecases_brand_error"));
    } finally {
      setBrandLoading(false);
    }
  }

  async function applyPersonaToProfile(idx: number) {
    const persona = brandPersonas[idx];
    if (!persona) return;

    try {
      setSelectedPersonaIndex(idx);

      await api.patch("/auth/me/profile/", {
        vibe: persona.recommended_vibe || "",
        tone: persona.recommended_tone || "",
        niche: persona.niche || brandForm.niche || "",
        target_audience:
          persona.target_audience || brandForm.target_audience || "",
      });

      setToast(t("usecases_toast_persona_applied"));
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      console.error(err);
      setToast(t("usecases_toast_persona_apply_error"));
      setTimeout(() => setToast(null), 3500);
    }
  }

  // 🔹 Call backend to refine bio for a given persona index
  async function refineBio(idx: number) {
    const p = brandPersonas[idx];
    if (!p || !p.brand_bio) {
      setToast(t("usecases_bio_no_base"));
      setTimeout(() => setToast(null), 2500);
      return;
    }

    setBioLoading(true);
    setBioPersonaIndex(idx);
    setBioVariants(null);

    try {
      const res = await api.post("/brand/bio-variants/", {
        base_bio: p.brand_bio,
        platform: p.main_platform || "instagram",
        preferred_language: effectiveLang, // 🔹 use current UI/AI language
        niche: p.niche || brandForm.niche,
        target_audience: p.target_audience || brandForm.target_audience,
        vibe: p.recommended_vibe,
        tone: p.recommended_tone,
        creator_stage: p.creator_stage || undefined,
      });

      setBioVariants(res.data);
    } catch (err) {
      console.error(err);
      setToast(t("usecases_bio_refine_error"));
      setTimeout(() => setToast(null), 3500);
    } finally {
      setBioLoading(false);
    }
  }

  function copyBio(text?: string) {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
    setToast(t("usecases_bio_copied_toast"));
    setTimeout(() => setToast(null), 2000);
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
      // (You can add dedicated i18n keys later if you want)
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
            {t("usecases_header_label")}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-3">
            {t("usecases_title_main")}{" "}
            <span className="text-purple">{t("usecases_title_highlight")}</span>
          </h1>
          <p className="text-sm md:text-[0.96rem] text-dark/75 max-w-2xl">
            {t("usecases_subtitle")}
          </p>
        </header>

        {/* Brand Persona Generator */}
        <section className="mb-10 rounded-3xl bg-white/60 backdrop-blur border border-purple/10 shadow-sm px-5 py-6 md:px-6 md:py-7">
          <h2 className="text-sm md:text-base font-semibold text-dark mb-1 flex items-center gap-2">
            {t("usecases_brand_title")}
          </h2>
          <p className="text-xs md:text-sm text-dark/70 mb-4 max-w-2xl">
            {t("usecases_brand_subtitle")}
          </p>

          {/* form inputs */}
          <div className="grid md:grid-cols-2 gap-3 text-xs md:text-sm mb-4">
            <input
              className="rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
              placeholder={t("usecases_brand_niche_placeholder")}
              value={brandForm.niche}
              onChange={(e) =>
                setBrandForm((p) => ({ ...p, niche: e.target.value }))
              }
            />
            <input
              className="rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
              placeholder={t("usecases_brand_target_placeholder")}
              value={brandForm.target_audience}
              onChange={(e) =>
                setBrandForm((p) => ({
                  ...p,
                  target_audience: e.target.value,
                }))
              }
            />
            <textarea
              className="rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 md:col-span-2"
              placeholder={t("usecases_brand_goals_placeholder")}
              rows={2}
              value={brandForm.goals}
              onChange={(e) =>
                setBrandForm((p) => ({ ...p, goals: e.target.value }))
              }
            />
            <input
              className="rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 md:col-span-2"
              placeholder={t("usecases_brand_comfort_placeholder")}
              value={brandForm.comfort_level}
              onChange={(e) =>
                setBrandForm((p) => ({
                  ...p,
                  comfort_level: e.target.value,
                }))
              }
            />
          </div>

          {brandError && (
            <p className="text-xs text-red-600 mb-2">{brandError}</p>
          )}

          <button
            onClick={generateBrandPersona}
            disabled={brandLoading}
            className="rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-white text-xs md:text-sm font-semibold shadow-md shadow-purple/30 disabled:opacity-60"
          >
            {brandLoading
              ? t("usecases_brand_button_thinking")
              : t("usecases_brand_button_generate")}
          </button>

          {/* results */}
          {brandPersonas.length > 0 && (
            <div className="mt-5 space-y-4">
              <h3 className="text-xs md:text-sm font-semibold text-dark">
                {t("usecases_brand_pick_persona")}
              </h3>

              {brandPersonas.map((p, idx) => {
                const active = selectedPersonaIndex === idx;
                const isThisBioLoading = bioLoading && bioPersonaIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-3xl border px-4 py-4 transition-all ${
                      active
                        ? "border-purple bg-purple/5 shadow-sm"
                        : "border-purple/15 bg-white/80 hover:border-purple/40"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2 gap-3">
                      <h4 className="text-sm font-semibold text-dark">
                        {p.persona_name || `Persona ${idx + 1}`}
                      </h4>

                      <button
                        type="button"
                        onClick={() => applyPersonaToProfile(idx)}
                        className="rounded-2xl bg-purple/10 px-3 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/20"
                      >
                        {active
                          ? t("usecases_brand_button_applied")
                          : t("usecases_brand_button_use_persona")}
                      </button>
                    </div>

                    {p.brand_summary && (
                      <p className="text-[0.75rem] text-dark/70 mb-2">
                        {p.brand_summary}
                      </p>
                    )}

                    <p className="text-[0.75rem] text-dark/70">
                      <strong>Vibe:</strong> {p.recommended_vibe} ·{" "}
                      <strong>Tone:</strong> {p.recommended_tone}
                    </p>

                    {p.content_pillars && (
                      <p className="mt-1 text-[0.75rem] text-dark/70">
                        <strong>Pillars:</strong>{" "}
                        {p.content_pillars.join(" · ")}
                      </p>
                    )}

                    {/* Base bio + refine controls */}
                    {p.brand_bio && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <p className="flex-1 rounded-2xl bg-purple/5 border border-purple/10 px-3 py-2 text-[0.75rem]">
                            <strong>Bio idea:</strong> {p.brand_bio}
                          </p>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => copyBio(p.brand_bio)}
                              className="rounded-xl bg-purple text-white px-3 py-1 text-xs font-semibold hover:bg-purple/90"
                            >
                              {t("common_copy")}
                            </button>
                            <button
                              type="button"
                              onClick={() => refineBio(idx)}
                              disabled={isThisBioLoading}
                              className="rounded-2xl bg-white border border-purple/30 px-2 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/5 disabled:opacity-60"
                            >
                              {t("usecases_bio_refine_button")}
                            </button>
                          </div>
                        </div>

                        {/* Bio variants for THIS persona */}
                        {bioPersonaIndex === idx && bioVariants && (
                          <div className="grid gap-2 md:grid-cols-2 text-[0.75rem]">
                            {bioVariants.short_bio && (
                              <div className="rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-dark">
                                    {t("usecases_bio_short_label")}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyBio(bioVariants.short_bio)
                                    }
                                    className="rounded-xl bg-purple text-white px-3 py-1 text-xs font-semibold hover:bg-purple/90"
                                  >
                                    {t("common_copy")}
                                  </button>
                                </div>
                                <p className="text-dark/80">
                                  {bioVariants.short_bio}
                                </p>
                              </div>
                            )}

                            {bioVariants.long_bio && (
                              <div className="rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-dark">
                                    {t("usecases_bio_long_label")}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyBio(bioVariants.long_bio)
                                    }
                                    className="rounded-xl bg-purple text-white px-3 py-1 text-xs font-semibold hover:bg-purple/90"
                                  >
                                    {t("common_copy")}
                                  </button>
                                </div>
                                <p className="text-dark/80">
                                  {bioVariants.long_bio}
                                </p>
                              </div>
                            )}

                            {bioVariants.cta_bio && (
                              <div className="rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-dark">
                                    {t("usecases_bio_cta_label")}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyBio(bioVariants.cta_bio)
                                    }
                                    className="rounded-xl bg-purple text-white px-3 py-1 text-xs font-semibold hover:bg-purple/90"
                                  >
                                    {t("common_copy")}
                                  </button>
                                </div>
                                <p className="text-dark/80">
                                  {bioVariants.cta_bio}
                                </p>
                              </div>
                            )}

                            {bioVariants.fun_bio && (
                              <div className="rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-dark">
                                    {t("usecases_bio_fun_label")}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyBio(bioVariants.fun_bio)
                                    }
                                    className="rounded-xl bg-purple text-white px-3 py-1 text-xs font-semibold hover:bg-purple/90"
                                  >
                                    {t("common_copy")}
                                  </button>
                                </div>
                                <p className="text-dark/80">
                                  {bioVariants.fun_bio}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Two-column content: how it works + presets intro */}
        <section className="mb-10 grid gap-6 md:grid-cols-[1.1fr,1fr]">
          {/* How to use Postly / use cases */}
          <div className="rounded-3xl bg-white/40 backdrop-blur border border-purple/10 shadow-sm px-5 py-5 md:px-6 md:py-6">
            <h2 className="text-sm md:text-base font-semibold text-dark mb-3">
              {t("usecases_how_title")}
            </h2>
            <ul className="text-xs md:text-sm text-dark/75 space-y-2.5">
              <li>{t("usecases_how_step1")}</li>
              <li>{t("usecases_how_step2")}</li>
              <li>{t("usecases_how_step3")}</li>
              <li>{t("usecases_how_step4")}</li>
            </ul>
          </div>

          {/* Presets info */}
          <div className="rounded-3xl bg-white/40 backdrop-blur border border-purple/10 shadow-sm px-5 py-5 md:px-6 md:py-6">
            <h2 className="text-sm md:text-base font-semibold text-dark mb-2">
              {t("usecases_presets_title")}
            </h2>
            <p className="text-xs md:text-sm text-dark/75 mb-3">
              {t("usecases_presets_subtitle")}
            </p>
            <p className="text-xs md:text-[0.8rem] text-dark/60">
              {t("usecases_presets_note")}
            </p>
          </div>
        </section>

        {/* Templates grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-6 w-6 rounded-full border-2 border-purple/30 border-t-purple animate-spin" />
            <span className="ml-3 text-sm text-dark/70">
              {t("usecases_loading_presets")}
            </span>
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-3xl bg-white/40 backdrop-blur border border-purple/10 shadow-sm px-6 py-10 text-center text-sm text-dark/70">
            {t("usecases_empty_presets")}
          </div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-semibold text-dark">
                {t("usecases_list_title")}
              </h2>
              <p className="text-[0.8rem] text-dark/60">
                {t("usecases_list_hint")}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((tpl) => (
                <article
                  key={tpl.id}
                  className="relative rounded-3xl bg-white/80 backdrop-blur border border-purple/10 shadow-sm hover:shadow-lg hover:border-purple/30 transition-all px-4 py-4 md:px-5 md:py-5"
                >
                  <h3 className="text-sm md:text-[0.95rem] font-semibold text-dark mb-1">
                    {tpl.title}
                  </h3>
                  <p className="text-[0.78rem] md:text-xs text-dark/70 mb-3 line-clamp-3">
                    {tpl.short_description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4 text-[0.68rem] md:text-[0.7rem]">
                    <span className="inline-flex items-center rounded-full bg-purple/5 border border-purple/15 px-2 py-0.5 text-purple font-medium">
                      {tpl.main_platform}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-teal/5 border border-teal/15 px-2 py-0.5 text-teal font-medium">
                      {tpl.preferred_language.toUpperCase()}
                    </span>
                    {tpl.vibe && (
                      <span className="inline-flex items-center rounded-full bg-yellow/10 border border-yellow/20 px-2 py-0.5 text-[0.7rem] text-yellow-700">
                        {tpl.vibe}
                      </span>
                    )}
                    {tpl.tone && (
                      <span className="inline-flex items-center rounded-full bg-pink/10 border border-pink/20 px-2 py-0.5 text-[0.7rem] text-pink-700">
                        {tpl.tone}
                      </span>
                    )}
                    {tpl.niche && (
                      <span className="inline-flex items-center rounded-full bg-dark/5 border border-dark/10 px-2 py-0.5 text-[0.7rem] text-dark/80">
                        {tpl.niche}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => applyTemplate(tpl.id)}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-3 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
                  >
                    {t("usecases_apply_button")}
                  </button>
                </article>
              ))}
            </div>
          </section>
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
