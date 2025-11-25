// src/pages/register/RegisterPage.tsx
import React, { useState } from "react";
import StepAccount from "./RegisterSteps/StepAccount";
import StepBasics from "./RegisterSteps/StepBasics";
import StepTone from "./RegisterSteps/StepTone";
import StepExtras from "./RegisterSteps/StepExtras";
import api from "../../api";

const RegisterPage: React.FC = () => {
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

    // merge step 4 data into the full payload
    const payload = extraData ? { ...formData, ...extraData } : formData;

    try {
      await api.post("/auth/register/", payload);

      setSuccessMessage(
        "🎉 Your account has been created! Please check your inbox to confirm your email before logging in."
      );
      setErrorMessage("");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        "Could not create your account. Please check your info or try again."
      );
      setSuccessMessage("");
    } finally {
      setSubmitting(false);
    }
  };


  const steps = [
    <StepAccount key="step-1" onNext={handleNext} />,
    <StepBasics key="step-2" onNext={handleNext} onBack={handleBack} />,
    <StepTone key="step-3" onNext={handleNext} onBack={handleBack} />,
    <StepExtras
      key="step-4"
      onSubmit={handleSubmit}
      onBack={handleBack}
      submitting={submitting} // ⬅ added
    />,
  ];

  const stepTitles = ["Account details", "Basics", "Style & audience", "Extras"];
  const progressPct = (step / totalSteps) * 100;

  return (
    <div className="relative overflow-hidden min-h-screen bg-offwhite">
      {/* Soft diagonal lens background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `
            radial-gradient(120% 200% at 0% 0%, rgba(255, 111, 145, 0.14), transparent 60%),
            radial-gradient(120% 200% at 100% 100%, rgba(88, 80, 235, 0.18), transparent 60%)
          `,
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 md:px-10">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 items-start md:items-center">
          
          {/* LEFT SIDE: Title + card */}
          <section className="w-full md:w-3/5">
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple/80 mb-2">
                Get started
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-2">
                Create your <span className="text-purple">Postly account</span>
              </h1>
              <p className="text-sm md:text-[0.95rem] text-dark/70 max-w-md">
                We’ll use these details to personalise ideas, captions,
                and posting times. It only takes a minute.
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

              {/* Step header */}
              <div className="flex items-baseline justify-between gap-2 mb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-purple/80 mb-1">
                    Step {step} of {totalSteps}
                  </p>
                  <h2 className="text-base md:text-lg font-semibold text-dark">
                    {stepTitles[step - 1]}
                  </h2>
                </div>
                <span className="text-[11px] text-dark/55">
                  {Math.round(progressPct)}% complete
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
                Why all these questions?
              </p>
              <ul className="space-y-2 text-xs md:text-[0.86rem]">
                <li>• We match ideas to your niche and audience.</li>
                <li>• We tune captions to your preferred tone of voice.</li>
                <li>• We suggest posting times based on your platforms.</li>
                <li>• You can edit everything later anytime.</li>
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
