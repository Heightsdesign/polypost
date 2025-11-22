import { useState, useEffect } from "react";
import api from "../api";

export default function Account() {
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        // load creator profile + identity + avatar
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
      } catch (err) {
        setError("Could not load preferences.");
      } finally {
        setLoading(false);
      }

    })();
  }, []);

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

      // backend returns updated profile, including new avatar URL
      setAvatarUrl(res.data.avatar || null);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Could not upload avatar.");
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
      await api.put("/profile/me/", {
        vibe,
        tone,
        niche,
        target_audience: targetAudience,
        default_platform: defaultPlatform,
        timezone,
      });
      setSuccess(true);
    } catch (err) {
      setError("Could not save preferences.");
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
        // frontend domain for redirect after success:
        domain: window.location.origin,
      });
      // backend returns { checkout_url: "https://checkout.stripe.com/..." }
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      }
    } catch (err) {
      alert("Could not start checkout (did you set STRIPE_SECRET_KEY?).");
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
      setPwMsg("Password updated ✅");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPwMsg("Could not change password (endpoint not implemented yet).");
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
      alert("IG connect not implemented yet.");
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h1>Account Settings</h1>
      <p>Manage your creator profile, plan, and connections.</p>

      {/* Profile + avatar */}
      <section style={sectionStyle}>
        <h2>Profile</h2>
        <p style={{ color: "#666", marginBottom: "0.75rem" }}>
          Update your picture and basic info. We use this to personalise your experience.
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
                Choose file
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
              {uploadingAvatar ? "Uploading..." : "Save picture"}
            </button>
          </div>
        </div>

        <div style={{ fontSize: "0.85rem", color: "#555" }}>
          <div>
            <strong>Username:</strong> {username || "—"}
          </div>
          <div>
            <strong>Email:</strong> {email || "—"}
          </div>
        </div>
      </section>


      {/* Billing */}
      <section style={sectionStyle}>
        <h2>Plan & Billing</h2>

        {billingLoading ? (
          <p>Loading plan...</p>
        ) : (
          <>
            <p className="text-sm">
              Current plan:{" "}
              <strong>{currentPlan === "pro" ? "Pro ($12/mo)" : "Free"}</strong>
            </p>

            {currentPlan === "free" ? (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={handleUpgrade}
                  disabled={checkoutLoading}
                  className="bg-gradient-to-r from-purple to-pink text-white px-4 py-2 rounded-xl shadow-md shadow-purple/25 text-sm font-semibold hover:shadow-purple/40 transition-all"
                >
                  {checkoutLoading ? "Redirecting..." : "Upgrade to Pro"}
                </button>

                {/* ➜ NEW: Link to pricing page */}
                <a
                  href="/pricing"
                  className="text-purple text-xs underline hover:text-pink transition-colors"
                >
                  View all plans & pricing →
                </a>
              </div>
            ) : (
              <p style={{ color: "green" }} className="mt-2">
                You’re on Pro ✅
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
          Payments are handled securely by Stripe.
        </p>
      </section>

      {/* Creator preferences */}
      <section style={sectionStyle}>
        <h2>Creator Preferences</h2>
        <p style={{ color: "#666" }}>
          These guide AI idea and caption generation across the app.
        </p>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Saved ✅</p>}

        {!loading && (
          <form onSubmit={handleSavePrefs}>
            <div style={fieldStyle}>
              <label>Vibe</label>
              <input value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="fun, edgy, classy..." />
            </div>
            <div style={fieldStyle}>
              <label>Tone</label>
              <input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="casual, professional..." />
            </div>
            <div style={fieldStyle}>
              <label>Niche</label>
              <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="fitness, beauty, gaming..." />
            </div>
            <div style={fieldStyle}>
              <label>Target audience</label>
              <input
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="young women, OF subs, IG followers..."
              />
            </div>
            <div style={fieldStyle}>
              <label>Default platform</label>
              <select value={defaultPlatform} onChange={(e) => setDefaultPlatform(e.target.value)}>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="twitter">X / Twitter</option>
                <option value="onlyfans">OnlyFans</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label>Timezone</label>
              <input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Europe/Paris" />
            </div>

            <button type="submit" disabled={savingPrefs}>
              {savingPrefs ? "Saving..." : "Save preferences"}
            </button>
          </form>
        )}
      </section>

      {/* Notifications */}
      <section style={sectionStyle}>
        <h2>Notifications</h2>
        <p style={{ color: "#666" }}>Choose how you want to be reminded to post.</p>
        <label>
          <input
            type="checkbox"
            checked={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.checked)}
          />{" "}
          Email reminders
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={notifyPush}
            onChange={(e) => setNotifyPush(e.target.checked)}
          />{" "}
          Push / browser notifications
        </label>
      </section>

      {/* Connected accounts */}
      <section style={sectionStyle}>
        <h2>Connected accounts</h2>
        <div style={connectCard}>
          <div>
            <strong>Instagram</strong>
            <p style={{ margin: 0, color: "#666" }}>
              Coming soon ...
            </p>
          </div>
          <button onClick={handleConnectInstagram}>Connect</button>
        </div>
      </section>

      {/* Security */}
      <section style={sectionStyle}>
        <h2>Security</h2>
        <form onSubmit={handleChangePassword}>
          <div style={fieldStyle}>
            <label>Current password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div style={fieldStyle}>
            <label>New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button type="submit">Change password</button>
        </form>
        {pwMsg && <p style={{ marginTop: "0.5rem" }}>{pwMsg}</p>}

        <hr style={{ margin: "1.5rem 0" }} />

        <button onClick={handleLogout} style={{ background: "#eee" }}>
          Logout
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
