import { useEffect, useState } from "react";
import api from "../api";

type Draft = {
  id: number | string;
  title?: string;
  caption?: string;
  media_url?: string;
  status?: "draft" | "pinned" | "saved";
  created_at?: string;
};

export default function Gallery() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/drafts/");
        setDrafts(res.data || []);
      } catch (err) {
        console.warn("Could not load drafts", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1>My Content Gallery</h1>
      <p>Saved / pinned / draft posts generated in Postly.</p>

      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {drafts.map((d) => (
          <div
            key={d.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 10,
              padding: "0.75rem",
              background: "#fff",
            }}
          >
            {d.status && (
              <span
                style={{
                    fontSize: "0.7rem",
                    background: d.status === "pinned" ? "#ffe7a3" : "#eee",
                    padding: "2px 6px",
                    borderRadius: 6,
                }}
              >
                {d.status.toUpperCase()}
              </span>
            )}
            <h3 style={{ marginTop: "0.5rem" }}>{d.title || "Untitled draft"}</h3>
            {d.caption && <p style={{ fontSize: "0.85rem" }}>{d.caption}</p>}
            {d.media_url && (
              <img
                src={d.media_url}
                alt=""
                style={{ width: "100%", borderRadius: 6, marginTop: "0.5rem" }}
              />
            )}
            {d.created_at && (
              <p style={{ fontSize: "0.7rem", color: "#888" }}>
                {new Date(d.created_at).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {!loading && drafts.length === 0 && <p>No drafts yet.</p>}
    </div>
  );
}
