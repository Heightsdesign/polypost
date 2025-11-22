import { useState } from "react";
import api from "../api";

export default function Upload() {
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
      setStatus("Uploading...");
      const res = await api.post("/uploads/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // adjust according to your actual response shape:
      // you probably returned {id: "...", file: "..."}
      const mediaId = res.data.id || res.data.media_id || res.data.uuid;
      setUploadId(mediaId);
      setStatus("Uploaded. You can generate a caption now.");
    } catch (err) {
      setStatus("Upload failed.");
    }
  }

  async function handleGenerateCaption() {
    if (!uploadId) {
      setStatus("Upload something first.");
      return;
    }

    try {
      setStatus("Generating caption...");
      const res = await api.post("/captions/generate/", {
        media_id: uploadId,
      });
      // depends on your backend return shape:
      setCaption(res.data.caption || JSON.stringify(res.data));
      setStatus("Caption generated ✅");
    } catch (err) {
      setStatus("Caption generation failed.");
    }
  }

  return (
    <div>
      <h1>Upload</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button type="submit">Upload</button>
      </form>

      {uploadId && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleGenerateCaption}>Generate caption</button>
        </div>
      )}

      {status && <p>{status}</p>}

      {caption && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Caption</h3>
          <textarea value={caption} readOnly rows={4} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
