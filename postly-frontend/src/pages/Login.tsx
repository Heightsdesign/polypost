import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../api";
import { useLanguage } from "../i18n/LanguageContext";
import SoftBackground from "../components/SoftBackground";

export default function Login() {
  const { t } = useLanguage();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login/", { username, password });
      setAuthToken(res.data.access);
      navigate("/dashboard");
    } catch (err) {
      setError(t("login_error"));
    }
  }

  return (
    <div className="relative min-h-screen bg-offwhite overflow-hidden">
      {/* shared soft background */}
      <SoftBackground opacity={0.5} />

      {/* centered card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-3xl bg-white/95 border border-white/50 shadow-xl px-6 py-7 md:px-7 md:py-8 text-center">
          <h1 className="text-2xl font-semibold text-dark mb-2">
            {t("login_title")}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-3 text-left"
          >
            <input
              placeholder={t("login_username_placeholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2.5 text-sm text-dark outline-none focus:border-purple focus:ring-1 focus:ring-purple/40"
            />
            <input
              placeholder={t("login_password_placeholder")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2.5 text-sm text-dark outline-none focus:border-purple focus:ring-1 focus:ring-purple/40"
            />

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-purple to-pink text-white text-sm font-semibold py-2.5 shadow-md shadow-purple/30 hover:shadow-purple/40 hover:-translate-y-[1px] active:translate-y-0 transition-all"
            >
              {t("login_button")}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-4">
            <Link
              to="/forgot-password"
              className="text-xs md:text-sm text-purple hover:text-pink underline"
            >
              {t("login_forgot_password")}
            </Link>
          </div>

          <div className="mt-3 text-xs md:text-sm text-dark/70">
            <span>{t("login_no_account")} </span>
            <Link
              to="/register"
              className="text-purple hover:text-pink underline"
            >
              {t("login_register_link")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
