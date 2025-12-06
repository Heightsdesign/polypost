// src/pages/register/RegisterSteps/StepTone.tsx
import React, { useState } from "react";
import api from "../../../api";

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
  "Fun",
  "Chill",
  "Bold",
  "Educational",
  "Luxury",
  "Cozy",
  "High-energy",
  "Mysterious",
  "Wholesome",
];

const TONES = [
  "Casual",
  "Professional",
  "Playful",
  "Flirty",
  "Inspirational",
  "Sarcastic",
  "Empathetic",
  "Confident",
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" },
];

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
  const [data, setData] = useState({
    vibe: "Fun",
    tone: "Casual",
    niche: "",
    target_audience: "",
    content_languages: "en",
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
      setBrandError("Could not generate brand personas. Try again.");
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

  // ----------------------------------

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
      alert("Tell us your niche so we can tailor ideas.");
      return;
    }
    onNext({
    ...data,
    preferred_platforms: selectedPlatforms,   // 👈 important
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
            Overall vibe
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => {
              const active = data.vibe === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setData({ ...data, vibe: v })}
                  className={[
                    "px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all",
                    active
                      ? "bg-purple text-white border-purple shadow-sm"
                      : "bg-white/90 text-dark/80 border-purple/15 hover:border-purple/40",
                  ].join(" ")}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone chips */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-2">
            Tone of voice
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => {
              const active = data.tone === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setData({ ...data, tone: t })}
                  className={[
                    "px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all",
                    active
                      ? "bg-teal text-white border-teal shadow-sm"
                      : "bg-white/90 text-dark/80 border-purple/15 hover:border-purple/40",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Niche + audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-dark/70 mb-1">
              Niche
            </label>
            <input
              type="text"
              value={data.niche}
              onChange={updateField("niche")}
              placeholder="Fitness, comedy, beauty, finance…"
              className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-dark/70 mb-1">
              Target audience
            </label>
            <input
              type="text"
              value={data.target_audience}
              onChange={updateField("target_audience")}
              placeholder="e.g. Gen Z women, busy parents…"
              className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
            />
          </div>
          {/* Platforms (optional multi-select) */}
          <div>
            <label className="block text-xs font-semibold text-dark/70 mb-2">
              Main platforms you post on
              <span className="ml-1 text-[10px] text-dark/50">(you can pick several)</span>
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

        {/* Language */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-1">
            Main content language
          </label>
          <select
            value={data.content_languages}
            onChange={updateField("content_languages")}
            className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-dark/55">
            We&apos;ll prioritise this language when generating your captions.
          </p>
        </div>

        {/* BRAND ASSISTANT BUTTON */}
        <div className="mt-4 rounded-2xl bg-white/70 border border-purple/10 px-3 py-3">
          <p className="text-[0.75rem] text-dark/70 mb-2">
            Not sure how to fill this section?{" "}
            <span className="font-semibold text-purple">Optional</span>: let AI
            suggest a vibe, tone & niche based on your goals.
          </p>

          <button
            type="button"
            onClick={() => setOpenBrandModal(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-purple/10 px-3 py-1.5 text-[0.75rem] font-semibold text-purple hover:bg-purple/15 transition-all"
          >
            🎭 Open brand assistant
          </button>
        </div>

        {/* navigation */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex-1 rounded-2xl border border-purple/20 bg-white/90 px-4 py-2.5 text-sm font-semibold text-purple hover:bg-white shadow-sm transition-all"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
          >
            Next →
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
              Brand assistant (optional)
            </h2>

            {/* Form inputs */}
            <div className="space-y-3 text-xs md:text-sm">
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder="Your niche (e.g. fitness, OF, comedy…) "
                value={brandForm.niche}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, niche: e.target.value })
                }
              />
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder="Target audience (e.g. Gen Z men, OF subs…)"
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
                placeholder="Your goals (grow subs, sell content, build long-term brand…)"
                rows={3}
                value={brandForm.goals}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, goals: e.target.value })
                }
              />
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder="Comfort level (e.g. shy, flirty, bold, anonymous…)"
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
                {brandLoading ? "Thinking…" : "Generate brand personas"}
              </button>
            </div>

            {/* Persona results */}
            {brandPersonas.length > 0 && (
              <div className="mt-5 space-y-3 text-xs md:text-sm">
                <p className="text-[0.8rem] text-dark/65">
                  Pick the persona that feels most like you. You can still edit
                  everything later.
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
                          {p.persona_name || `Persona ${idx + 1}`}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleUsePersona(idx)}
                          className="rounded-2xl bg-purple/10 px-2.5 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/20"
                        >
                          {active ? "Selected ✓" : "Use this persona"}
                        </button>
                      </div>
                      {p.brand_summary && (
                        <p className="text-[0.78rem] text-dark/80 mb-1">
                          {p.brand_summary}
                        </p>
                      )}
                      <p className="text-[0.75rem] text-dark/70">
                        <strong>Vibe:</strong> {p.recommended_vibe || "—"} ·{" "}
                        <strong>Tone:</strong> {p.recommended_tone || "—"}
                      </p>
                      {Array.isArray(p.content_pillars) &&
                        p.content_pillars.length > 0 && (
                          <p className="mt-1 text-[0.75rem] text-dark/70">
                            <strong>Content pillars:</strong>{" "}
                            {p.content_pillars.join(" · ")}
                          </p>
                        )}
                      {p.brand_bio && (
                        <p className="mt-2 rounded-2xl bg-purple/5 border border-purple/10 px-3 py-2 text-[0.75rem]">
                          <strong>Bio idea:</strong> {p.brand_bio}
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
                    Sample posts in this style
                  </h3>
                  <button
                    type="button"
                    onClick={generateSampleCaptions}
                    disabled={captionsLoading}
                    className="rounded-2xl bg-purple/10 px-2.5 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/20 disabled:opacity-60"
                  >
                    {captionsLoading ? "Generating…" : "Generate sample posts"}
                  </button>
                </div>

                {sampleCaptions.length === 0 && !captionsLoading && (
                  <p className="text-[0.75rem] text-dark/65">
                    Click “Generate sample posts” to preview how your content
                    might sound.
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
