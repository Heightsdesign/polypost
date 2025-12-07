import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { setAuthToken } from "../api";
import { useLanguage } from "../i18n/LanguageContext";

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
    <div style={{ maxWidth: 380, margin: "40px auto", textAlign: "center" }}>
      <h1>{t("login_title")}</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          placeholder={t("login_username_placeholder")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          placeholder={t("login_password_placeholder")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />

        <button type="submit" style={{ padding: 12, marginTop: 10 }}>
          {t("login_button")}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <Link to="/forgot-password" style={{ fontSize: 14, color: "#007bff" }}>
          {t("login_forgot_password")}
        </Link>
      </div>

      <div style={{ marginTop: 10 }}>
        <span style={{ fontSize: 14 }}>{t("login_no_account")} </span>
        <Link to="/register" style={{ fontSize: 14, color: "#007bff" }}>
          {t("login_register_link")}
        </Link>
      </div>
    </div>
  );
}
