import React, { useState } from "react";
import { useLanguage } from "../../../i18n/LanguageContext";

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
  { value: "starter", key: "starter" },
  { value: "growing", key: "growing" },
  { value: "pro", key: "pro" },
];

const StepExtras: React.FC<StepExtrasProps> = ({
  onSubmit,
  onBack,
  submitting,
}) => {
  const { t } = useLanguage();

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
            {t("register_step_extras_stage_question")}
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
                <span className="font-medium text-dark/85">
                  {t(`register_step_extras_stage_${s.key}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* marketing opt in */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-2">
            {t("register_step_extras_marketing_label")}
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
            <span>{t("register_step_extras_marketing_text")}</span>
          </label>
          <p className="mt-1 text-[11px] text-dark/55">
            {t("register_step_extras_marketing_helper")}
          </p>
        </div>

        {/* notifications opt in */}
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-2">
            {t("register_step_extras_notifications_label")}
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
            <span>{t("register_step_extras_notifications_text")}</span>
          </label>
          <p className="mt-1 text-[11px] text-dark/55">
            {t("register_step_extras_notifications_helper")}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="flex-1 rounded-2xl border border-purple/20 bg-white/90 px-4 py-2.5 text-sm font-semibold text-purple hover:bg-white shadow-sm transition-all"
          >
            {t("register_step_extras_back")}
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
            {submitting
              ? t("register_step_extras_submit_creating")
              : t("register_step_extras_submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepExtras;
