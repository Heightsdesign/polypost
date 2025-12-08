// src/pages/Upload.tsx
import { useState } from "react";
import api from "../api";
import { useLanguage } from "../i18n/LanguageContext";

export default function Upload() {
  const { t } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus(t("upload_status_uploading"));
      const res = await api.post("/uploads/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const mediaId = res.data.id || res.data.media_id || res.data.uuid;
      setUploadId(mediaId);
      setStatus(t("upload_status_uploaded"));
    } catch (err) {
      setStatus(t("upload_status_failed"));
    }
  }

  async function handleGenerateCaption() {
    if (!uploadId) {
      setStatus(t("upload_status_upload_first"));
      return;
    }

    try {
      setStatus(t("upload_status_generating"));
      const res = await api.post("/captions/generate/", {
        media_id: uploadId,
      });
      setCaption(res.data.caption || JSON.stringify(res.data));
      setStatus(t("upload_status_caption_ok"));
    } catch (err) {
      setStatus(t("upload_status_caption_failed"));
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-dark mb-2">
        {t("upload_title")}
      </h1>
      <p className="text-sm text-dark/70 mb-4">
        {t("upload_subtitle")}
      </p>

      <form onSubmit={handleUpload} className="space-y-3 mb-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-purple to-pink shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
        >
          {t("upload_button_upload")}
        </button>
      </form>

      {uploadId && (
        <div className="mt-3">
          <button
            onClick={handleGenerateCaption}
            className="inline-flex items-center justify-center px-4 py-2 rounded-2xl text-sm font-semibold text-purple bg-purple/10 hover:bg-purple/20"
          >
            {t("upload_button_generate")}
          </button>
        </div>
      )}

      {status && (
        <p className="mt-3 text-sm text-dark/75">
          {status}
        </p>
      )}

      {caption && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-dark mb-1">
            {t("upload_caption_title")}
          </h3>
          <textarea
            value={caption}
            readOnly
            rows={4}
            className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-sm text-dark/80"
          />
        </div>
      )}
    </div>
  );
}
