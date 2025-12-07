// src/pages/auth/ForgotPasswordPage.tsx
import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";

const ForgotPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post("/auth/password-reset/", { email });
      setMessage(t("forgot_success_message"));
    } catch (err: any) {
      console.error(err);
      setMessage(t("forgot_error_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-2xl">
        <h1 className="text-2xl font-semibold text-center mb-4">
          {t("forgot_title")}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {t("forgot_subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("forgot_email_placeholder")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple to-pink text-white py-2 rounded-lg shadow-md shadow-purple/25 hover:shadow-purple/40 transition-all disabled:opacity-60"
          >
            {loading ? t("forgot_button_loading") : t("forgot_button")}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline text-sm"
          >
            {t("forgot_back_to_login")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
