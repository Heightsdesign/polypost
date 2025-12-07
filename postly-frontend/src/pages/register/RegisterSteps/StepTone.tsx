// src/pages/register/RegisterSteps/StepTone.tsx
import React, { useState } from "react";
import api from "../../../api";
import { useLanguage } from "../../../i18n/LanguageContext";

const ALL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter / X" },
  { value: "onlyfans", label: "OnlyFans" },
  { value: "youtube", label: "YouTube" },
  { value: "twitch", label: "Twitch" },
  { value: "mym", label: "MYM Fans" },
  { value: "snapchat", label: "Snapchat" },
];

type StepToneProps = {
  onNext: (data: {
    vibe: string;
    tone: string;
    niche: string;
    target_audience: string;
    content_languages: string;
    preferred_platforms: string[];
  }) => void;
  onBack: (data?: any) => void;
};

const VIBES = [
  { value: "Fun", key: "fun" },
  { value: "Chill", key: "chill" },
  { value: "Bold", key: "bold" },
  { value: "Educational", key: "educational" },
  { value: "Luxury", key: "luxury" },
  { value: "Cozy", key: "cozy" },
  { value: "High-energy", key: "high_energy" },
  { value: "Mysterious", key: "mysterious" },
  { value: "Wholesome", key: "wholesome" },
];

const TONES = [
  { value: "Casual", key: "casual" },
  { value: "Professional", key: "professional" },
  { value: "Playful", key: "playful" },
  { value: "Flirty", key: "flirty" },
  { value: "Inspirational", key: "inspirational" },
  { value: "Sarcastic", key: "sarcastic" },
  { value: "Empathetic", key: "empathetic" },
  { value: "Confident", key: "confident" },
];

// languages for the *content* (GPT), not UI
const CONTENT_LANG_CODES = ["en", "fr", "es", "de", "pt", "it"] as const;

type BrandPersona = {
  persona_name?: string;
  brand_summary?: string;
  recommended_vibe?: string;
  recommended_tone?: string;
  niche?: string;
  target_audience?: string;
  content_pillars?: string[];
  brand_bio?: string;
};

const StepTone: React.FC<StepToneProps> = ({ onNext, onBack }) => {
  const { lang, t } = useLanguage();

  const [data, setData] = useState({
    // keep DB values in English; these are what you already use
    vibe: "Fun",
    tone: "Casual",
    niche: "",
    target_audience: "",
    content_languages: CONTENT_LANG_CODES.includes(lang as any) ? lang : "en",
    preferred_platforms: ["instagram"],
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "instagram",
  ]);

  const togglePlatform = (value: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  // ---------------------------
  // BRAND ASSISTANT
  // ---------------------------
  const [openBrandModal, setOpenBrandModal] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);

  const [brandPersonas, setBrandPersonas] = useState<BrandPersona[]>([]);
  const [selectedPersonaIndex, setSelectedPersonaIndex] = useState<number | null>(null);

  const [sampleCaptions, setSampleCaptions] = useState<string[]>([]);
  const [captionsLoading, setCaptionsLoading] = useState(false);

  const [brandForm, setBrandForm] = useState({
    niche: "",
    target_audience: "",
    goals: "",
    comfort_level: "",
  });

  async function generateBrandPersona() {
    setBrandLoading(true);
    setBrandError(null);
    setBrandPersonas([]);
    setSampleCaptions([]);
    setSelectedPersonaIndex(null);

    try {
      const res = await api.post("/brand/persona/", {
        niche: brandForm.niche || data.niche,
        target_audience: brandForm.target_audience || data.target_audience,
        goals: brandForm.goals,
        comfort_level: brandForm.comfort_level,
      });

      const personas: BrandPersona[] = res.data.personas || [];
      setBrandPersonas(personas);

      // Auto-apply the first persona as a starting point
      if (personas.length > 0) {
        const p = personas[0];
        setSelectedPersonaIndex(0);

        if (p.recommended_vibe) {
          setData((prev) => ({ ...prev, vibe: p.recommended_vibe as string }));
        }
        if (p.recommended_tone) {
          setData((prev) => ({ ...prev, tone: p.recommended_tone as string }));
        }
        if (p.niche && !data.niche) {
          setData((prev) => ({ ...prev, niche: p.niche as string }));
        }
        if (p.target_audience && !data.target_audience) {
          setData((prev) => ({
            ...prev,
            target_audience: p.target_audience as string,
          }));
        }
      }
    } catch (err) {
      console.error(err);
      setBrandError(t("register_step_tone_brand_error"));
    } finally {
      setBrandLoading(false);
    }
  }

  function handleUsePersona(index: number) {
    const p = brandPersonas[index];
    setSelectedPersonaIndex(index);

    if (!p) return;

    if (p.recommended_vibe) {
      setData((prev) => ({ ...prev, vibe: p.recommended_vibe as string }));
    }
    if (p.recommended_tone) {
      setData((prev) => ({ ...prev, tone: p.recommended_tone as string }));
    }
    if (p.niche) {
      setData((prev) => ({ ...prev, niche: p.niche as string }));
    }
    if (p.target_audience) {
      setData((prev) => ({
        ...prev,
        target_audience: p.target_audience as string,
      }));
    }
  }

  async function generateSampleCaptions() {
    if (selectedPersonaIndex === null) return;
    const p = brandPersonas[selectedPersonaIndex];
    if (!p) return;

    setCaptionsLoading(true);
    setSampleCaptions([]);
    try {
      const res = await api.post("/brand/persona/sample-captions/", {
        persona_name: p.persona_name,
        recommended_vibe: p.recommended_vibe,
        recommended_tone: p.recommended_tone,
        niche: p.niche,
        target_audience: p.target_audience,
        platform: "instagram",
      });
      setSampleCaptions(res.data.captions || []);
    } catch (err) {
      console.error(err);
      setSampleCaptions([]);
    } finally {
      setCaptionsLoading(false);
    }
  }

  const updateField =
    (field: keyof typeof data) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      setData({ ...data, [field]: e.target.value });
    };

  const handleNext = () => {
    if (!data.niche) {
      alert(t("register_step_tone_niche_required"));
      return;
    }
    onNext({
      ...data,
      preferred_platforms: selectedPlatforms,
    });
  };

  const handleBackClick = () => {
    onBack({
      ...data,
      preferred_platforms: selectedPlatforms,
    });
  };

  return (
    <div className="relative">
      {/* background blob */}
      <div
        className="pointer-events-none absolute -top-8 -left-24 w-48 h-48 rounded-full bg-purple/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative space-y-5">
        {/* Vibe chips */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-2">
            {t("register_step_tone_vibe_label")}
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => {
              const active = data.vibe === v.value;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setData({ ...data, vibe: v.value })}
                  className={[
                    "px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all",
                    active
                      ? "bg-purple text-white border-purple shadow-sm"
                      : "bg-white/90 text-dark/80 border-purple/15 hover:border-purple/40",
                  ].join(" ")}
                >
                  {t(`register_step_tone_vibe_${v.key}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone chips */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-2">
            {t("register_step_tone_tone_label")}
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((tone) => {
              const active = data.tone === tone.value;
              return (
                <button
                  key={tone.key}
                  type="button"
                  onClick={() => setData({ ...data, tone: tone.value })}
                  className={[
                    "px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all",
                    active
                      ? "bg-teal text-white border-teal shadow-sm"
                      : "bg-white/90 text-dark/80 border-purple/15 hover:border-purple/40",
                  ].join(" ")}
                >
                  {t(`register_step_tone_tone_${tone.key}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Niche + audience + platforms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-dark/70 mb-1">
              {t("register_step_tone_niche_label")}
            </label>
            <input
              type="text"
              value={data.niche}
              onChange={updateField("niche")}
              placeholder={t("register_step_tone_niche_placeholder")}
              className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark/70 mb-1">
              {t("register_step_tone_target_label")}
            </label>
            <input
              type="text"
              value={data.target_audience}
              onChange={updateField("target_audience")}
              placeholder={t("register_step_tone_target_placeholder")}
              className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
            />
          </div>

          {/* Platforms (optional multi-select) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-dark/70 mb-2">
              {t("register_step_tone_platforms_label")}
              <span className="ml-1 text-[10px] text-dark/50">
                {t("register_step_tone_platforms_hint")}
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_PLATFORMS.map((p) => {
                const active = selectedPlatforms.includes(p.value);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => togglePlatform(p.value)}
                    className={[
                      "px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all",
                      active
                        ? "bg-purple text-white border-purple shadow-sm"
                        : "bg-white/90 text-dark/80 border-purple/15 hover:border-purple/40",
                    ].join(" ")}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content language */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-1">
            {t("register_step_tone_content_lang_label")}
          </label>
          <select
            value={data.content_languages}
            onChange={updateField("content_languages")}
            className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
          >
            {CONTENT_LANG_CODES.map((code) => (
              <option key={code} value={code}>
                {t(`register_language_${code}`)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-dark/55">
            {t("register_step_tone_content_lang_help")}
          </p>
        </div>

        {/* BRAND ASSISTANT BOX */}
        <div className="mt-4 rounded-2xl bg-white/70 border border-purple/10 px-3 py-3">
          <p className="text-[0.75rem] text-dark/70 mb-2">
            {t("register_step_tone_brand_intro")}{" "}
            <span className="font-semibold text-purple">
              {t("register_step_tone_brand_optional")}
            </span>
            : {t("register_step_tone_brand_description")}
          </p>

          <button
            type="button"
            onClick={() => setOpenBrandModal(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-purple/10 px-3 py-1.5 text-[0.75rem] font-semibold text-purple hover:bg-purple/15 transition-all"
          >
            🎭 {t("register_step_tone_brand_button")}
          </button>
        </div>

        {/* navigation */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex-1 rounded-2xl border border-purple/20 bg-white/90 px-4 py-2.5 text-sm font-semibold text-purple hover:bg-white shadow-sm transition-all"
          >
            {t("register_step_tone_back")}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
          >
            {t("register_step_tone_next")}
          </button>
        </div>
      </div>

      {/* BRAND ASSISTANT MODAL */}
      {openBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-white/95 p-5 shadow-2xl border border-purple/10">
            <button
              type="button"
              onClick={() => setOpenBrandModal(false)}
              className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-purple/5 hover:bg-purple/10"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold text-dark mb-3">
              {t("register_step_tone_brand_title")}
            </h2>

            {/* Form inputs */}
            <div className="space-y-3 text-xs md:text-sm">
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder={t("register_step_tone_brand_niche_placeholder")}
                value={brandForm.niche}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, niche: e.target.value })
                }
              />
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder={t(
                  "register_step_tone_brand_target_placeholder"
                )}
                value={brandForm.target_audience}
                onChange={(e) =>
                  setBrandForm({
                    ...brandForm,
                    target_audience: e.target.value,
                  })
                }
              />
              <textarea
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder={t("register_step_tone_brand_goals_placeholder")}
                rows={3}
                value={brandForm.goals}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, goals: e.target.value })
                }
              />
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder={t(
                  "register_step_tone_brand_comfort_placeholder"
                )}
                value={brandForm.comfort_level}
                onChange={(e) =>
                  setBrandForm({
                    ...brandForm,
                    comfort_level: e.target.value,
                  })
                }
              />

              {brandError && (
                <p className="text-xs text-red-600">{brandError}</p>
              )}

              <button
                type="button"
                onClick={generateBrandPersona}
                disabled={brandLoading}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 font-semibold text-white shadow-md shadow-purple/30 disabled:opacity-60"
              >
                {brandLoading
                  ? t("register_step_tone_brand_thinking")
                  : t("register_step_tone_brand_generate")}
              </button>
            </div>

            {/* Persona results */}
            {brandPersonas.length > 0 && (
              <div className="mt-5 space-y-3 text-xs md:text-sm">
                <p className="text-[0.8rem] text-dark/65">
                  {t("register_step_tone_brand_pick_persona")}
                </p>

                {brandPersonas.map((p, idx) => {
                  const active = selectedPersonaIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={[
                        "rounded-2xl border px-3 py-3 transition-all",
                        active
                          ? "border-purple bg-purple/5 shadow-sm"
                          : "border-purple/15 bg-white/90 hover:border-purple/40",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-dark">
                          {p.persona_name ||
                            `${t(
                              "register_step_tone_brand_persona_prefix"
                            )} ${idx + 1}`}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleUsePersona(idx)}
                          className="rounded-2xl bg-purple/10 px-2.5 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/20"
                        >
                          {active
                            ? t("register_step_tone_brand_selected")
                            : t("register_step_tone_brand_use_persona")}
                        </button>
                      </div>
                      {p.brand_summary && (
                        <p className="text-[0.78rem] text-dark/80 mb-1">
                          {p.brand_summary}
                        </p>
                      )}
                      <p className="text-[0.75rem] text-dark/70">
                        <strong>{t("register_step_tone_brand_vibe_label")}</strong>{" "}
                        {p.recommended_vibe || "—"} ·{" "}
                        <strong>{t("register_step_tone_brand_tone_label")}</strong>{" "}
                        {p.recommended_tone || "—"}
                      </p>
                      {Array.isArray(p.content_pillars) &&
                        p.content_pillars.length > 0 && (
                          <p className="mt-1 text-[0.75rem] text-dark/70">
                            <strong>
                              {t("register_step_tone_brand_pillars_label")}
                            </strong>{" "}
                            {p.content_pillars.join(" · ")}
                          </p>
                        )}
                      {p.brand_bio && (
                        <p className="mt-2 rounded-2xl bg-purple/5 border border-purple/10 px-3 py-2 text-[0.75rem]">
                          <strong>
                            {t("register_step_tone_brand_bio_label")}
                          </strong>{" "}
                          {p.brand_bio}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sample captions for selected persona */}
            {selectedPersonaIndex !== null && (
              <div className="mt-4 border-t border-purple/10 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs md:text-sm font-semibold text-dark">
                    {t("register_step_tone_samples_title")}
                  </h3>
                  <button
                    type="button"
                    onClick={generateSampleCaptions}
                    disabled={captionsLoading}
                    className="rounded-2xl bg-purple/10 px-2.5 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/20 disabled:opacity-60"
                  >
                    {captionsLoading
                      ? t("register_step_tone_samples_generating")
                      : t("register_step_tone_samples_generate_button")}
                  </button>
                </div>

                {sampleCaptions.length === 0 && !captionsLoading && (
                  <p className="text-[0.75rem] text-dark/65">
                    {t("register_step_tone_samples_hint")}
                  </p>
                )}

                {sampleCaptions.length > 0 && (
                  <ul className="mt-2 space-y-1.5 text-[0.75rem] text-dark/80">
                    {sampleCaptions.map((c, i) => (
                      <li
                        key={i}
                        className="rounded-2xl bg-purple/5 border border-purple/10 px-3 py-2"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepTone;
