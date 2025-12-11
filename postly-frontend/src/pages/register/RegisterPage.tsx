// src/pages/register/RegisterPage.tsx
import React, { useState } from "react";
import StepAccount from "./RegisterSteps/StepAccount";
import StepBasics from "./RegisterSteps/StepBasics";
import StepTone from "./RegisterSteps/StepTone";
import StepExtras from "./RegisterSteps/StepExtras";
import api from "../../api";
import { useLanguage } from "../../i18n/LanguageContext";
import SoftBackground from "../../components/SoftBackground";

const RegisterPage: React.FC = () => {
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 4;

  const handleNext = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
    setStep((s) => Math.min(totalSteps, s + 1));
  };

  const handleBack = (data?: any) => {
    if (data) {
      setFormData((prev: any) => ({ ...prev, ...data }));
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async (extraData?: any) => {
    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const payload = extraData ? { ...formData, ...extraData } : formData;

    try {
      await api.post("/auth/register/", payload);

      setSuccessMessage(
        t("register_success_message")
      );
      setErrorMessage("");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        t("register_error_message")
      );
      setSuccessMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    <StepAccount key="step-1" onNext={handleNext} />,
    <StepBasics key="step-2" onNext={handleNext} onBack={handleBack} />,
    <StepTone
      key="step-3"
      onNext={handleNext}
      onBack={handleBack}
      preferredLanguage={formData.preferred_language || "en"}
    />,
    <StepExtras
      key="step-4"
      onSubmit={handleSubmit}
      onBack={handleBack}
      submitting={submitting}
    />,
  ];

  const stepTitles = [
    t("register_step_title_1"),
    t("register_step_title_2"),
    t("register_step_title_3"),
    t("register_step_title_4"),
  ];

  const progressPct = (step / totalSteps) * 100;

  return (
    <div className="relative min-h-screen bg-offwhite overflow-hidden">
      {/* shared soft background */}
      <SoftBackground opacity={0.5} />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 md:px-10">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 items-start md:items-center">
          {/* LEFT SIDE: Title + card */}
          <section className="w-full md:w-3/5">
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple/80 mb-2">
                {t("register_get_started")}
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-2">
                {t("register_title")}{" "}
                <span className="text-purple">
                  {t("register_title_highlight")}
                </span>
              </h1>
              <p className="text-sm md:text-[0.95rem] text-dark/70 max-w-md">
                {t("register_subtitle")}
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-purple/10 px-6 py-6 md:px-8 md:py-7">
              {/* Styled Success & Error Messages */}
              {successMessage && (
                <div className="mb-4 flex items-start gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 shadow-sm">
                  <span className="mt-[2px]">✅</span>
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm">
                  <span className="mt-[2px]">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between gap-2 mb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-purple/80 mb-1">
                    {t("register_step_prefix")} {step} {t("register_step_of")}{" "}
                    {totalSteps}
                  </p>
                  <h2 className="text-base md:text-lg font-semibold text-dark">
                    {stepTitles[step - 1]}
                  </h2>
                </div>
                <span className="text-[11px] text-dark/55">
                  {Math.round(progressPct)}% {t("register_progress_suffix")}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-5 h-1.5 w-full rounded-full bg-purple/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple to-pink transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Current step */}
              <div className="mt-4">{steps[step - 1]}</div>
            </div>
          </section>

          {/* RIGHT SIDE: Info box */}
          <aside className="hidden md:block w-full md:w-2/5">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-purple/10 px-6 py-6 text-sm text-dark/75">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-purple mb-2">
                {t("register_sidebar_title")}
              </p>
              <ul className="space-y-2 text-xs md:text-[0.86rem]">
                <li>• {t("register_sidebar_item_1")}</li>
                <li>• {t("register_sidebar_item_2")}</li>
                <li>• {t("register_sidebar_item_3")}</li>
                <li>• {t("register_sidebar_item_4")}</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
