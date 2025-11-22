// src/pages/register/RegisterSteps/StepTone.tsx
import React, { useState } from "react";

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
      {/* soft violet blob behind left side */}
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
        </div>

        {/* Content language dropdown */}
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
    </div>
  );
};

export default StepTone;
