// src/pages/register/RegisterSteps/StepExtras.tsx
import React, { useState } from "react";

type StepExtrasProps = {
  onSubmit: (data: {
    marketing_opt_in: boolean;
    notifications_enabled: boolean;
    creator_stage: string;
  }) => void;
  onBack: (data?: any) => void;
  submitting: boolean;
};

const STAGES = [
  { value: "starter", label: "Just starting out" },
  { value: "growing", label: "Growing audience" },
  { value: "pro", label: "Full-time creator" },
];

const StepExtras: React.FC<StepExtrasProps> = ({ onSubmit, onBack, submitting }) => {
  const [data, setData] = useState({
    marketing_opt_in: true,
    notifications_enabled: true,
    creator_stage: "starter",
  });

  const handleSubmit = () => {
    onSubmit(data);
  };

  const handleBackClick = () => {
    onBack(data);
  };

  return (
    <div className="relative">
      {/* soft yellow blob behind bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-12 -left-24 w-44 h-44 rounded-full bg-yellow/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative space-y-5">
        {/* stage radios */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-2">
            Where are you in your creator journey?
          </label>
          <div className="space-y-2">
            {STAGES.map((s) => (
              <label
                key={s.value}
                className="flex items-start gap-2 rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-xs md:text-sm cursor-pointer hover:border-purple/40 transition-all"
              >
                <input
                  type="radio"
                  name="creator_stage"
                  value={s.value}
                  checked={data.creator_stage === s.value}
                  onChange={() =>
                    setData((prev) => ({ ...prev, creator_stage: s.value }))
                  }
                  className="mt-[2px]"
                />
                <span className="font-medium text-dark/85">{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* marketing opt in */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-2">
            Stay in the loop?
          </label>
          <label className="flex items-center gap-2 text-xs md:text-sm text-dark/75">
            <input
              type="checkbox"
              checked={data.marketing_opt_in}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  marketing_opt_in: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-purple/40 text-purple focus:ring-purple"
            />
            <span>
              Yes, I&apos;d like occasional tips, feature updates and content
              ideas by email.
            </span>
          </label>
          <p className="mt-1 text-[11px] text-dark/55">
            No spam. You can opt out anytime with one click.
          </p>
        </div>
        {/* notifications opt in */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-2">
            Enable notifications?
          </label>
          <label className="flex items-center gap-2 text-xs md:text-sm text-dark/75">
            <input
              type="checkbox"
              checked={data.notifications_enabled}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  notifications_enabled: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-purple/40 text-purple focus:ring-purple"
            />
            <span>
              Yes, send me reminders for my scheduled posts & content ideas.
            </span>
          </label>
          <p className="mt-1 text-[11px] text-dark/55">
            You can turn this off anytime in account settings.
          </p>
        </div>


        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex-1 rounded-2xl border border-purple/20 bg-white/90 px-4 py-2.5 text-sm font-semibold text-purple hover:bg-white shadow-sm transition-all"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex-1 rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 transition-all ${
              submitting
                ? "opacity-60 cursor-not-allowed"
                : "hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0"
            }`}
          >
            {submitting ? "Creating account…" : "Create account 🎉"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepExtras;
