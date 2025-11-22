import { useEffect, useState } from "react";
import api from "../api";

interface UseCaseTemplate {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  main_platform: string;
  preferred_language: string;
  vibe: string | null;
  tone: string | null;
  niche: string | null;
}

export default function UseCasesPage() {
  const [templates, setTemplates] = useState<UseCaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await api.get("/use-cases/");
        setTemplates(res.data);
      } catch (err) {
        console.error("Failed to load templates:", err);
      }
      setLoading(false);
    }
    loadTemplates();
  }, []);

  async function applyTemplate(id: number) {
    try {
      await api.post("/use-cases/apply/", { template_id: id });
      setToast("🎉 Preset applied successfully!");
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error(err);
      setToast("⚠️ Failed to apply preset");
      setTimeout(() => setToast(null), 3000);
    }
  }

  if (loading) return <div className="uc-loading">Loading presets...</div>;

  return (
    <div className="uc-container">
      <h1 className="uc-title">Creator Presets</h1>
      <p className="uc-subtitle">
        Select a preset to instantly configure your profile for your style,
        language, and platform.
      </p>

      {toast && <div className="uc-toast">{toast}</div>}

      <div className="uc-grid">
        {templates.map((t) => (
          <div key={t.id} className="uc-card">
            <h3>{t.title}</h3>
            <p className="uc-desc">{t.short_description}</p>

            <div className="uc-tags">
              <span className="uc-tag platform">{t.main_platform}</span>
              <span className="uc-tag lang">{t.preferred_language}</span>
              {t.vibe && <span className="uc-tag vibe">{t.vibe}</span>}
            </div>

            <button className="uc-btn" onClick={() => applyTemplate(t.id)}>
              Apply Preset
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
