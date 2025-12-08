// src/pages/Account.tsx
import React, { useState, useEffect } from "react";
import api from "../api";
import { useLanguage } from "../i18n/LanguageContext";

const ALL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter / X" },
  { value: "youtube", label: "YouTube" },
  { value: "twitch", label: "Twitch" },
  { value: "onlyfans", label: "OnlyFans" },
  { value: "mym", label: "MYM Fans" },
  { value: "snapchat", label: "Snapchat" },
];

export default function Account() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // creator profile fields
  const [vibe, setVibe] = useState("");
  const [tone, setTone] = useState("");
  const [niche, setNiche] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [defaultPlatform, setDefaultPlatform] = useState("instagram");
  const [timezone, setTimezone] = useState("UTC");

  // notification prefs (local)
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);

  // billing
  const [billingLoading, setBillingLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | string>("free");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // security
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  // identity + avatar
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [preferredPlatforms, setPreferredPlatforms] = useState<string[]>([]);

  // load profile
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/auth/me/profile/");
        const d = res.data;

        setUsername(d.username || "");
        setEmail(d.email || "");
        setAvatarUrl(d.avatar || null);

        setVibe(d.vibe || "");
        setTone(d.tone || "");
        setNiche(d.niche || "");
        setTargetAudience(d.target_audience || "");
        setDefaultPlatform(d.default_platform || "instagram");
        setTimezone(d.timezone || "UTC");
        setNotifyEmail(
          typeof d.notifications_enabled === "boolean"
            ? d.notifications_enabled
            : true
        );
        setNotifyPush(
          typeof d.marketing_opt_in === "boolean"
            ? d.marketing_opt_in
            : false
        );
        setPreferredPlatforms(
          Array.isArray(d.preferred_platforms) && d.preferred_platforms.length
            ? d.preferred_platforms
            : d.default_platform
            ? [d.default_platform]
            : ["instagram"]
        );
      } catch (err) {
        setError(t("account_error_load_prefs"));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  // load billing
  useEffect(() => {
    (async () => {
      setBillingLoading(true);
      try {
        const res = await api.get("/billing/me/");
        setCurrentPlan(res.data.plan || "free");
      } catch (err) {
        // if it fails we just stay on free
      } finally {
        setBillingLoading(false);
      }
    })();
  }, []);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleAvatarUpload() {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    setError("");
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const res = await api.patch("/auth/me/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAvatarUrl(res.data.avatar || null);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(t("account_error_avatar"));
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSavePrefs(e: React.FormEvent) {
    e.preventDefault();
    setSavingPrefs(true);
    setError("");
    setSuccess(false);
    try {
      await api.put("/auth/me/profile/", {
        vibe,
        tone,
        niche,
        target_audience: targetAudience,
        default_platform: defaultPlatform,
        preferred_platforms: preferredPlatforms,
        timezone,
        notifications_enabled: notifyEmail,
        marketing_opt_in: notifyPush,
      });
      setSuccess(true);
    } catch (err) {
      setError(t("account_error_save_prefs"));
    } finally {
      setSavingPrefs(false);
    }
  }

  async function handleSaveNotifications() {
    setSavingPrefs(true);
    setError("");
    setSuccess(false);
    try {
      await api.put("/auth/me/profile/", {
        notifications_enabled: notifyEmail,
        marketing_opt_in: notifyPush,
      });
      setSuccess(true);
    } catch (err) {
      setError(t("account_error_save_notifications"));
    } finally {
      setSavingPrefs(false);
    }
  }

  // start stripe checkout
  async function handleUpgrade() {
    setCheckoutLoading(true);
    try {
      const res = await api.post("/billing/create-checkout/", {
        plan: "pro",
        domain: window.location.origin,
      });
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      }
    } catch (err) {
      alert(t("account_billing_checkout_error"));
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg("");
    try {
      await api.post("/auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPwMsg(t("account_pw_change_success"));
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      const data = err.response?.data;
      if (data) {
        const msgs: string[] = [];
        if (data.detail) msgs.push(data.detail);
        if (data.old_password) msgs.push(...data.old_password);
        if (data.new_password) msgs.push(...data.new_password);
        setPwMsg(msgs.join(" "));
      } else {
        setPwMsg(t("account_pw_change_error_generic"));
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("postly_token");
    window.location.href = "/login";
  }

  async function handleConnectInstagram() {
    try {
      const res = await api.get("/ig/auth/start/");
      if (res.data.auth_url) {
        window.location.href = res.data.auth_url;
      }
    } catch (err) {
      alert(t("account_connect_ig_error"));
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1>{t("account_title")}</h1>
      <p>{t("account_subtitle")}</p>

      {/* Profile + avatar */}
      <section style={sectionStyle}>
        <h2>{t("account_profile_title")}</h2>
        <p style={{ color: "#666", marginBottom: "0.75rem" }}>
          {t("account_profile_subtitle")}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          {/* Avatar / initial bubble */}
          <div
            style={{
              height: 64,
              width: 64,
              borderRadius: "50%",
              background: "#f3e9ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#6C63FF",
              overflow: "hidden",
            }}
          >
            {previewUrl || avatarUrl ? (
              <img
                src={previewUrl || avatarUrl || ""}
                alt={username || "Avatar"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              (username || "U").charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label
                style={{
                  display: "inline-block",
                  padding: "0.35rem 0.9rem",
                  borderRadius: 999,
                  border: "1px solid #d0c3ff",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#6C63FF",
                  background: "#fff",
                  marginRight: "0.5rem",
                }}
              >
                {t("account_profile_choose_file")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </label>
              {avatarFile && (
                <span style={{ fontSize: "0.8rem", color: "#555" }}>
                  {avatarFile.name}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAvatarUpload}
              disabled={!avatarFile || uploadingAvatar}
            >
              {uploadingAvatar
                ? t("account_profile_uploading")
                : t("account_profile_save_picture")}
            </button>
          </div>
        </div>

        <div style={{ fontSize: "0.85rem", color: "#555" }}>
          <div>
            <strong>{t("account_profile_username_label")}</strong>{" "}
            {username || "—"}
          </div>
          <div>
            <strong>{t("account_profile_email_label")}</strong>{" "}
            {email || "—"}
          </div>
        </div>
      </section>

      {/* Billing */}
      <section style={sectionStyle}>
        <h2>{t("account_billing_title")}</h2>

        {billingLoading ? (
          <p>{t("account_billing_loading")}</p>
        ) : (
          <>
            <p className="text-sm">
              {t("account_billing_current_plan_label")}{" "}
              <strong>
                {currentPlan === "pro"
                  ? t("account_billing_plan_pro_label")
                  : t("account_billing_plan_free_label")}
              </strong>
            </p>

            {currentPlan === "free" ? (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="bg-gradient-to-r from-purple to-pink text-white px-4 py-2 rounded-xl shadow-md shadow-purple/25 text-sm font-semibold hover:shadow-purple/40 transition-all"
                >
                  {checkoutLoading
                    ? t("account_billing_upgrade_redirecting")
                    : t("account_billing_upgrade_button")}
                </button>

                <a
                  href="/pricing"
                  className="text-purple text-xs underline hover:text-pink transition-colors"
                >
                  {t("account_billing_view_pricing_link")}
                </a>
              </div>
            ) : (
              <p style={{ color: "green" }} className="mt-2">
                {t("account_billing_on_pro_label")}
              </p>
            )}
          </>
        )}

        <p
          style={{
            fontSize: "0.8rem",
            color: "#888",
            marginTop: "0.5rem",
          }}
        >
          {t("account_billing_stripe_note")}
        </p>
      </section>

      {/* Creator preferences */}
      <section style={sectionStyle}>
        <h2>{t("account_prefs_title")}</h2>
        <p style={{ color: "#666" }}>{t("account_prefs_subtitle")}</p>
        {loading && <p>{t("account_prefs_loading")}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{t("account_prefs_saved")}</p>}

        {!loading && (
          <form onSubmit={handleSavePrefs}>
            <div style={fieldStyle}>
              <label>{t("account_prefs_vibe_label")}</label>
              <input
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder={t("account_prefs_vibe_placeholder")}
              />
            </div>
            <div style={fieldStyle}>
              <label>{t("account_prefs_tone_label")}</label>
              <input
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder={t("account_prefs_tone_placeholder")}
              />
            </div>
            <div style={fieldStyle}>
              <label>{t("account_prefs_niche_label")}</label>
              <input
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder={t("account_prefs_niche_placeholder")}
              />
            </div>
            <div style={fieldStyle}>
              <label>{t("account_prefs_target_label")}</label>
              <input
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder={t("account_prefs_target_placeholder")}
              />
            </div>
            <div style={fieldStyle}>
              <label>{t("account_prefs_default_platform_label")}</label>
              <select
                value={defaultPlatform}
                onChange={(e) => setDefaultPlatform(e.target.value)}
              >
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">X / Twitter</option>
                <option value="snapchat">Snapchat</option>
                <option value="onlyfans">OnlyFans</option>
                <option value="mym">MYM Fans</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label>{t("account_prefs_active_platforms_label")}</label>
              <div className="flex flex-wrap gap-2">
                {ALL_PLATFORMS.map((p) => {
                  const checked = preferredPlatforms.includes(p.value);
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        setPreferredPlatforms((prev) =>
                          checked
                            ? prev.filter((val) => val !== p.value)
                            : [...prev, p.value]
                        );
                      }}
                      className={[
                        "px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all",
                        checked
                          ? "bg-purple text-white border-purple shadow-sm"
                          : "bg-white text-dark/80 border-purple/20 hover:border-purple/50",
                      ].join(" ")}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={fieldStyle}>
              <label>{t("account_prefs_timezone_label")}</label>
              <input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder={t("account_prefs_timezone_placeholder")}
              />
            </div>

            <button type="submit" disabled={savingPrefs}>
              {savingPrefs
                ? t("account_prefs_save_saving")
                : t("account_prefs_save_button")}
            </button>
          </form>
        )}
      </section>

      {/* Notifications */}
      <section style={sectionStyle}>
        <h2>{t("account_notifications_title")}</h2>
        <p style={{ color: "#666", marginBottom: "0.75rem" }}>
          {t("account_notifications_subtitle")}
        </p>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
            />{" "}
            {t("account_notifications_content_label")}
          </label>
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label>
            <input
              type="checkbox"
              checked={notifyPush}
              onChange={(e) => setNotifyPush(e.target.checked)}
            />{" "}
            {t("account_notifications_marketing_label")}
          </label>
        </div>

        <button
          type="button"
          onClick={handleSaveNotifications}
          style={{
            marginTop: "0.25rem",
            padding: "0.45rem 0.9rem",
            borderRadius: 10,
            border: "1px solid #d0c3ff",
            background: "#f7f4ff",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#5b4bdb",
            cursor: "pointer",
          }}
        >
          {t("account_notifications_save_button")}
        </button>
      </section>

      {/* Connected accounts */}
      <section style={sectionStyle}>
        <h2>{t("account_connected_title")}</h2>
        <div style={connectCard}>
          <div>
            <strong>Instagram</strong>
            <p style={{ margin: 0, color: "#666" }}>
              {t("account_connected_ig_coming")}
            </p>
          </div>
          <button onClick={handleConnectInstagram}>
            {t("account_connected_ig_connect_button")}
          </button>
        </div>
      </section>

      {/* Security */}
      <section style={sectionStyle}>
        <h2 style={{ marginBottom: "0.5rem" }}>
          {t("account_security_title")}
        </h2>
        <p
          style={{
            color: "#666",
            fontSize: "0.85rem",
            marginBottom: "0.75rem",
          }}
        >
          {t("account_security_subtitle")}
        </p>

        <form onSubmit={handleChangePassword} style={{ maxWidth: 380 }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#444",
                marginBottom: "0.25rem",
              }}
            >
              {t("account_security_current_pw_label")}
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.7rem",
                borderRadius: 10,
                border: "1px solid #e0ddff",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.75rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#444",
                marginBottom: "0.25rem",
              }}
            >
              {t("account_security_new_pw_label")}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.7rem",
                borderRadius: 10,
                border: "1px solid #e0ddff",
                fontSize: "0.85rem",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            className="bg-purple text-white px-4 py-2 rounded-xl shadow-md shadow-purple/25 text-sm font-semibold hover:shadow-purple/40 transition-all"
          >
            {t("account_security_change_pw_button")}
          </button>
        </form>

        {pwMsg && (
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.85rem",
              color: "#444",
            }}
          >
            {pwMsg}
          </p>
        )}

        <hr style={{ margin: "1.5rem 0" }} />

        <button
          onClick={handleLogout}
          style={{ background: "#eee", padding: "0.5rem 0.9rem", borderRadius: 8 }}
        >
          {t("account_logout_button")}
        </button>
      </section>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: "1rem 1.25rem",
  marginTop: "1.25rem",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.75rem",
};

const connectCard: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #eee",
  borderRadius: 8,
  padding: "0.75rem 1rem",
  marginTop: "0.75rem",
};
