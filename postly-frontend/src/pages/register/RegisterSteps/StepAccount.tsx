// src/pages/register/RegisterSteps/StepAccount.tsx
import React, { useState } from "react";

type StepAccountProps = {
  onNext: (data: {
    username: string;
    email: string;
    password: string;
  }) => void;
};

const StepAccount: React.FC<StepAccountProps> = ({ onNext }) => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange =
    (field: keyof typeof data) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [field]: e.target.value });
    };

  const handleNext = () => {
    if (!data.username || !data.email || !data.password) {
      alert("Please fill in all fields to continue.");
      return;
    }
    onNext(data);
  };

  return (
    <div className="relative">
      {/* subtle purple blob in top-right of card */}
      <div
        className="pointer-events-none absolute -top-6 -right-10 w-40 h-40 rounded-full bg-purple/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative space-y-4">
        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-1">
            Username
          </label>
          <input
            type="text"
            value={data.username}
            onChange={handleChange("username")}
            placeholder="Choose a username"
            className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-1">
            Email
          </label>
          <input
            type="email"
            value={data.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-dark/70 mb-1">
            Password
          </label>
          <input
            type="password"
            value={data.password}
            onChange={handleChange("password")}
            placeholder="Create a secure password"
            className="w-full rounded-2xl border border-purple/15 bg-white/90 px-3 py-2 text-sm text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-purple focus:border-purple/40"
          />
          <p className="mt-1 text-[11px] text-dark/55">
            Use at least 8 characters, ideally with a mix of letters & numbers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default StepAccount;
