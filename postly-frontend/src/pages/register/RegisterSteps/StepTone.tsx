// src/pages/register/RegisterSteps/StepTone.tsx
import React, { useState } from "react";
import api from "../../../api"; // <-- added

type StepToneProps = {
  onNext: (data: {
    vibe: string;
    tone: string;
    niche: string;
    target_audience: string;
    content_languages: string;
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

const StepTone: React.FC<StepToneProps> = ({ onNext, onBack }) => {
  const [data, setData] = useState({
    vibe: "Fun",
    tone: "Casual",
    niche: "",
    target_audience: "",
    content_languages: "en",
  });

  // ---------------------------
  // BRAND ASSISTANT (new)
  // ---------------------------
  const [openBrandModal, setOpenBrandModal] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [brandPersona, setBrandPersona] = useState<any | null>(null);

  const [brandForm, setBrandForm] = useState({
    niche: "",
    target_audience: "",
    goals: "",
    comfort_level: "",
  });

  async function generateBrandPersona() {
    setBrandLoading(true);
    setBrandError(null);
    setBrandPersona(null);

    try {
      const res = await api.post("/brand/persona/", {
        niche: brandForm.niche || data.niche,
        target_audience: brandForm.target_audience || data.target_audience,
        goals: brandForm.goals,
        comfort_level: brandForm.comfort_level,
      });

      const persona = res.data;
      setBrandPersona(persona);

      // Auto-fill fields for user
      if (persona.recommended_vibe) {
        setData((prev) => ({ ...prev, vibe: persona.recommended_vibe }));
      }
      if (persona.recommended_tone) {
        setData((prev) => ({ ...prev, tone: persona.recommended_tone }));
      }
      if (persona.niche && !data.niche) {
        setData((prev) => ({ ...prev, niche: persona.niche }));
      }
      if (persona.target_audience && !data.target_audience) {
        setData((prev) => ({ ...prev, target_audience: persona.target_audience }));
      }
    } catch (err) {
      console.error(err);
      setBrandError("Could not generate a brand persona. Try again.");
    } finally {
      setBrandLoading(false);
    }
  }

  function applyPersonaAndClose() {
    setOpenBrandModal(false);
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
    onNext(data);
  };

  const handleBackClick = () => {
    onBack(data);
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
              className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm placeholder:text-dark/40 focus:ring-purple"
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
              className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm placeholder:text-dark/40 focus:ring-purple"
            />
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
            className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm focus:ring-purple"
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
            <span className="font-semibold text-purple">Optional</span>:  
            let AI suggest a vibe, tone & niche based on your goals.
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
            className="flex-1 rounded-2xl border border-purple/20 bg-white/90 px-4 py-2.5 text-sm font-semibold text-purple hover:bg-white"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2.5 text-sm font-semibold text-white shadow-md"
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

            <div className="space-y-3 text-xs md:text-sm">
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder="Your niche"
                value={brandForm.niche}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, niche: e.target.value })
                }
              />
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder="Target audience"
                value={brandForm.target_audience}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, target_audience: e.target.value })
                }
              />
              <textarea
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder="Your goals"
                rows={3}
                value={brandForm.goals}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, goals: e.target.value })
                }
              />
              <input
                className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2"
                placeholder="Comfort level"
                value={brandForm.comfort_level}
                onChange={(e) =>
                  setBrandForm({ ...brandForm, comfort_level: e.target.value })
                }
              />

              {brandError && (
                <p className="text-xs text-red-600">{brandError}</p>
              )}

              <button
                type="button"
                onClick={generateBrandPersona}
                disabled={brandLoading}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 font-semibold text-white shadow-md disabled:opacity-60"
              >
                {brandLoading ? "Thinking…" : "Generate brand persona"}
              </button>
            </div>

            {/* RESULT */}
            {brandPersona && (
              <div className="mt-5 space-y-3 text-xs md:text-sm">
                <h3 className="font-semibold text-dark text-base">
                  {brandPersona.persona_name}
                </h3>
                <p>{brandPersona.brand_summary}</p>

                <p>
                  <strong>Vibe:</strong> {brandPersona.recommended_vibe}
                  <br />
                  <strong>Tone:</strong> {brandPersona.recommended_tone}
                </p>

                <strong>Content pillars:</strong>
                <ul className="list-disc ml-4">
                  {brandPersona.content_pillars?.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>

                {brandPersona.brand_bio && (
                  <>
                    <strong>Suggested bio:</strong>
                    <p className="rounded-2xl bg-purple/5 border border-purple/10 px-3 py-2 mt-1">
                      {brandPersona.brand_bio}
                    </p>
                  </>
                )}

                <button
                  type="button"
                  onClick={applyPersonaAndClose}
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-purple/10 px-3 py-1.5 text-[0.75rem] font-semibold text-purple hover:bg-purple/15"
                >
                  Use these suggestions
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepTone;
