// src/pages/register/RegisterSteps/StepBasics.tsx
import React, { useState } from "react";

type StepBasicsProps = {
  onNext: (data: {
    preferred_language: string;
    country: string;
    city: string;
    default_platform: string;
  }) => void;
  onBack: (data?: any) => void;
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "it", label: "Italian" },
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X (Twitter)" },
  { value: "onlyfans", label: "OnlyFans" },
  { value: "youtube", label: "MYM" },
  { value: "youtube", label: "Snapchat" },
];

const COUNTRIES = [
  "Afghanistan",
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Czech Republic",
  "Denmark",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hong Kong",
  "Hungary",
  "India",
  "Indonesia",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Kenya",
  "Luxembourg",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Peru",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
];

const StepBasics: React.FC<StepBasicsProps> = ({ onNext, onBack }) => {
  const [data, setData] = useState({
    preferred_language: "en",
    country: "France",
    city: "",
    default_platform: "instagram",
  });

  const handleChange =
    (field: keyof typeof data) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      setData({ ...data, [field]: e.target.value });
    };

  const handleNext = () => {
    if (!data.country || !data.city) {
      alert("Please select a country and enter your city.");
      return;
    }
    onNext(data);
  };

  const handleBackClick = () => {
    onBack(data);
  };

  return (
    <div className="relative">
      {/* soft teal blob bottom-right */}
      <div
        className="pointer-events-none absolute -bottom-10 -right-16 w-40 h-40 rounded-full bg-teal/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Preferred language */}
          <div>
            <label className="block text-xs font-semibold text-dark/70 mb-1">
              Preferred language
            </label>
            <select
              value={data.preferred_language}
              onChange={handleChange("preferred_language")}
              className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Default platform */}
          <div>
            <label className="block text-xs font-semibold text-dark/70 mb-1">
              Main platform
            </label>
            <select
              value={data.default_platform}
              onChange={handleChange("default_platform")}
              className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-1">
            Country
          </label>
          <select
            value={data.country}
            onChange={handleChange("country")}
            className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-1">
            City
          </label>
          <input
            type="text"
            value={data.city}
            onChange={handleChange("city")}
            placeholder="Paris, New York, São Paulo…"
            className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
          />
          <p className="mt-1 text-[11px] text-dark/55">
            Later we can plug an autocomplete API here.
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

export default StepBasics;
