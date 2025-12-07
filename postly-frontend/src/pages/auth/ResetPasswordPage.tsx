// src/pages/auth/ResetPasswordPage.tsx
import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { useLanguage } from "../../i18n/LanguageContext";

const ResetPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const uid = params.get("uid");
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage(t("reset_error_mismatch"));
      return;
    }

    if (!uid || !token) {
      setMessage(t("reset_error_invalid_link"));
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/auth/password-reset/confirm/", {
        uid,
        token,
        new_password: password,
      });
      setMessage(t("reset_success_message"));
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      console.error(err);
      setMessage(t("reset_error_failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-2xl">
        <h1 className="text-2xl font-semibold text-center mb-4">
          {t("reset_title")}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {t("reset_subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("reset_password_placeholder")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={t("reset_confirm_placeholder")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple to-pink text-white py-2 rounded-lg shadow-md shadow-purple/25 hover:shadow-purple/40 transition-all disabled:opacity-60"
          >
            {loading ? t("reset_button_loading") : t("reset_button")}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
