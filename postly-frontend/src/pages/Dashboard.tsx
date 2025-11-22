import React, { useState, useEffect } from "react";
import api from "../api";
import ReviewsSection from "../components/ReviewSection";

import BlobRed from "../assets/blobs/blob-1.png";
import BlobPurple from "../assets/blobs/blob-2.png";
import BlobYellow from "../assets/blobs/blob-3.png";
import BlobRedSmall from "../assets/blobs/red-dot.png";
import BlobYellowSmall from "../assets/blobs/yellow-dot.png";
import BlobPurpleLarge from "../assets/blobs/blob-6.png";
import BlobOrange from "../assets/blobs/blob-3.png";
import BlobGreen from "../assets/blobs/blob-4.png";
import BlobPurpleDot from "../assets/blobs/blob-6.png";
import BlobRedLarge from "../assets/blobs/blob-1.png";
import BlobBlue from "../assets/blobs/blob-7.png";
import BgBlur from "../assets/blobs/bg-blur.png";


// a tiny reusable modal
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[min(90%,700px)] max-h-[80vh] overflow-y-auto rounded-2xl bg-white/25 p-5 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="m-0 text-lg font-semibold text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-purple/10 px-2 py-1 text-xs font-semibold text-dark hover:bg-purple/20"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // modal states
  const [openIdeas, setOpenIdeas] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openScheduler, setOpenScheduler] = useState(false);

  // IDEA state
  const [ideas, setIdeas] = useState<any[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

  // UPLOAD state
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  // SCHEDULER state
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mySlots, setMySlots] = useState<any[]>([]);
  const [schedulerLoading, setSchedulerLoading] = useState(false);

  // DRAFTS state
  const [recentDrafts, setRecentDrafts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/drafts/?limit=3");
        setRecentDrafts(res.data || []);
      } catch (err) {
        // non-blocking
      }
    })();
  }, []);

  // load scheduler suggestions when modal opens
  useEffect(() => {
    if (!openScheduler) return;
    (async () => {
      setSchedulerLoading(true);
      try {
        const sug = await api.get(
          "/scheduler/suggestions/?platform=instagram&days=3"
        );
        setSuggestions(sug.data.days || []);
        const mine = await api.get("/scheduler/my/");
        setMySlots(mine.data || []);
      } catch (e) {
        console.warn(e);
      } finally {
        setSchedulerLoading(false);
      }
    })();
  }, [openScheduler]);

  // IDEA: call backend
  async function handleGenerateIdeas() {
    setIdeasLoading(true);
    try {
      const res = await api.post("/ideas/generate/", { platform: "instagram" });
      let data = res.data.ideas;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          data = [];
        }
      }
      setIdeas(data || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setIdeasLoading(false);
    }
  }

  // UPLOAD: upload file
  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploadStatus("Uploading...");
      const res = await api.post("/uploads/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const mediaId = res.data.id || res.data.media_id || res.data.uuid;
      setUploadId(mediaId);
      setUploadStatus("Uploaded ✅ — you can generate a caption now.");
    } catch (err) {
      setUploadStatus("Upload failed.");
    }
  }

  // UPLOAD: caption
  async function handleGenerateCaption() {
    if (!uploadId) {
      setUploadStatus("Upload first.");
      return;
    }
    try {
      setUploadStatus("Generating caption...");
      const res = await api.post("/captions/generate/", {
        media_id: uploadId,
      });
      setCaption(res.data.caption || JSON.stringify(res.data));
      setUploadStatus("Caption generated ✅");
    } catch (err) {
      setUploadStatus("Caption generation failed.");
    }
  }

  // SCHEDULER: save a slot
  async function handleSaveSlot(slot: any) {
    try {
      await api.post("/scheduler/plan/", {
        platform: slot.platform,
        scheduled_at: slot.datetime,
        title: "Planned from dashboard",
        notify: true,
      });
      const mine = await api.get("/scheduler/my/");
      setMySlots(mine.data || []);
      // mark in suggestions
      setSuggestions((prev) =>
        prev.map((day: any) => ({
          ...day,
          slots: day.slots.map((s: any) =>
            s.datetime === slot.datetime && s.platform === slot.platform
              ? { ...s, saved: true }
              : s
          ),
        }))
      );
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen bg-offwhite">
      {/* soft background gradient like landing */}
      {/* Large soft blur center */}
      <img
        src={BgBlur}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "2000px",
          height: "auto",
          opacity: 0.25,
          zIndex: 0,
        }}
      />

      {/* Top-left blended blobs */}
      <img
        src={BlobRed}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "-180px",
          left: "-200px",
          width: "420px",
          opacity: 0.70,
          zIndex: 0,
        }}
      />

      <img
        src={BlobYellowSmall}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "40px",
          left: "280px",
          width: "140px",
          opacity: 0.45,
          zIndex: 0,
        }}
      />

      {/* Top-right large purple shape */}
      <img
        src={BlobPurpleLarge}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "-160px",
          right: "-200px",
          width: "540px",
          opacity: 0.30,
          transform: "rotate(-18deg)",
          zIndex: 0,
        }}
      />

      {/* Mid-left blob for balance */}
      <img
        src={BlobPurpleDot}
        alt=""
        className="pointer-events-none absolute"
        style={{
          top: "380px",
          left: "-40px",
          width: "220px",
          opacity: 0.55,
          transform: "rotate(12deg)",
          zIndex: 0,
        }}
      />

      {/* Bottom-right bleed */}
      <img
        src={BlobGreen}
        alt=""
        className="pointer-events-none absolute"
        style={{
          bottom: "-200px",
          right: "-240px",
          width: "500px",
          opacity: 0.75,
          transform: "rotate(-8deg)",
          zIndex: 0,
        }}
      />

      {/* Bottom-left blue bubble */}
      <img
        src={BlobBlue}
        alt=""
        className="pointer-events-none absolute"
        style={{
          bottom: "-170px",
          left: "80px",
          width: "450px",
          opacity: 0.70,
          transform: "rotate(4deg)",
          zIndex: 0,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `
            radial-gradient(120% 200% at 0% 0%, rgba(255, 111, 145, 0.14), transparent 60%),
            radial-gradient(120% 200% at 100% 100%, rgba(88, 80, 235, 0.18), transparent 60%)
          `,
          opacity: 0.5,
        }}
      />

      {/* a couple of simple blobs */}
      <div className="pointer-events-none absolute -top-20 -left-24 h-52 w-52 rounded-full bg-yellow/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-64 w-64 rounded-full bg-teal/35 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple/80 mb-2">
            Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-2">
            Your <span className="text-purple">creator cockpit</span>
          </h1>
          <p className="text-sm md:text-[0.95rem] text-dark/70 max-w-2xl">
            Generate ideas, prep captions and schedule great posting times —
            all in one place.
          </p>
        </header>

        {/* Main cards */}
        <section className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Idea card */}
          <div className="rounded-3xl border border-purple/10 bg-white/25 p-4 md:p-5 shadow-md shadow-purple/5">
            <h2 className="text-base md:text-lg font-semibold text-dark flex items-center gap-2">
              <span>💡</span> Idea Generator
            </h2>
            <p className="mt-1 text-xs md:text-sm text-dark/70">
              Generate 5 ideas based on trends and your creator profile.
            </p>
            <button
              onClick={() => setOpenIdeas(true)}
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
            >
              Open
            </button>
          </div>

          {/* Upload card */}
          <div className="rounded-3xl border border-purple/10 bg-white/25 p-4 md:p-5 shadow-md shadow-purple/5">
            <h2 className="text-base md:text-lg font-semibold text-dark flex items-center gap-2">
              <span>🖼️</span> Upload & Caption
            </h2>
            <p className="mt-1 text-xs md:text-sm text-dark/70">
              Upload an image or video and get a caption instantly.
            </p>
            <button
              onClick={() => setOpenUpload(true)}
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
            >
              Open
            </button>
          </div>

          {/* Scheduler card */}
          <div className="rounded-3xl border border-purple/10 bg-white/25 p-4 md:p-5 shadow-md shadow-purple/5">
            <h2 className="text-base md:text-lg font-semibold text-dark flex items-center gap-2">
              <span>📅</span> Scheduler
            </h2>
            <p className="mt-1 text-xs md:text-sm text-dark/70">
              See best times for the next days and save slots for reminders.
            </p>
            <button
              onClick={() => setOpenScheduler(true)}
              className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
            >
              Open
            </button>
          </div>
        </section>

        {/* Recent drafts */}
        <section className="mb-10">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base md:text-lg font-semibold text-dark">
              Recent drafts
            </h2>
            <a
              href="/gallery"
              className="text-xs md:text-sm font-medium text-purple hover:text-purple/80"
            >
              View all drafts →
            </a>
          </div>
          <div className="rounded-3xl border border-purple/10 bg-white/90 p-4 md:p-5 shadow-sm shadow-purple/5">
            {recentDrafts.length === 0 ? (
              <p className="text-xs md:text-sm text-dark/60">
                No drafts yet. Generate ideas or upload to start.
              </p>
            ) : (
              <ul className="space-y-2 text-xs md:text-sm">
                {recentDrafts.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b last:border-b-0 border-purple/10 pb-2 last:pb-0"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-dark">
                        {d.title || "Untitled"}
                      </span>
                      {d.status && (
                        <span className="text-[0.7rem] text-dark/50">
                          {d.status}
                        </span>
                      )}
                    </div>
                    {d.created_at && (
                      <span className="text-[0.75rem] text-dark/60">
                        {new Date(d.created_at).toLocaleString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Reviews */}
        <ReviewsSection />
      </div>

      {/* MODALS */}

      {/* Ideas modal */}
      <Modal
        open={openIdeas}
        onClose={() => setOpenIdeas(false)}
        title="Idea Generator"
      >
        <button
          onClick={handleGenerateIdeas}
          disabled={ideasLoading}
          className="rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {ideasLoading ? "Generating..." : "Generate 5 ideas"}
        </button>
        <div className="mt-4 space-y-3">
          {ideas.length === 0 && !ideasLoading && (
            <p className="text-xs md:text-sm text-dark/60">
              No ideas yet. Click the button above.
            </p>
          )}
          {ideas.map((idea, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-purple/10 bg-purple/3 p-3 text-xs md:text-sm"
            >
              <h3 className="m-0 mb-1 text-sm font-semibold text-dark">
                {idea.title || "Idea"}
              </h3>
              <p className="text-dark/80">{idea.description}</p>
              {idea.suggested_caption_starter && (
                <p className="mt-1">
                  <strong>Caption start:</strong>{" "}
                  {idea.suggested_caption_starter}
                </p>
              )}
              {idea.personal_twist && (
                <p className="mt-1">
                  <strong>Twist:</strong> {idea.personal_twist}
                </p>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* Upload modal */}
      <Modal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        title="Upload & Caption"
      >
        <form
          onSubmit={handleUpload}
          className="flex flex-wrap items-center gap-2 text-xs md:text-sm"
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-xs"
          />
          <button
            type="submit"
            className="rounded-2xl bg-purple px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple/90"
          >
            Upload
          </button>
        </form>
        {uploadStatus && (
          <p className="mt-2 text-xs md:text-sm text-dark/70">
            {uploadStatus}
          </p>
        )}
        {uploadId && (
          <div className="mt-3">
            <button
              onClick={handleGenerateCaption}
              className="rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
            >
              Generate caption
            </button>
          </div>
        )}
        {caption && (
          <div className="mt-3">
            <h3 className="text-sm font-semibold text-dark">Caption</h3>
            <textarea
              value={caption}
              readOnly
              rows={4}
              className="mt-1 w-full rounded-2xl border border-purple/20 bg-white/25 p-2 text-xs md:text-sm"
            />
          </div>
        )}
      </Modal>

      {/* Scheduler modal */}
      <Modal
        open={openScheduler}
        onClose={() => setOpenScheduler(false)}
        title="Best times to post"
      >
        {schedulerLoading && (
          <p className="text-xs md:text-sm text-dark/70">Loading...</p>
        )}
        {!schedulerLoading &&
          suggestions.map((day: any) => (
            <div key={day.date} className="mb-4 text-xs md:text-sm">
              <h4 className="mb-1 font-semibold text-dark">{day.date}</h4>
              {day.slots.length === 0 && (
                <p className="text-dark/60">No suggestions.</p>
              )}
              <ul className="space-y-1">
                {day.slots.map((slot: any) => (
                  <li key={slot.datetime}>
                    {slot.time} – {slot.platform} (score{" "}
                    {slot.engagement_score})
                    {slot.saved ? (
                      <span className="ml-2 text-emerald-600">✅ saved</span>
                    ) : (
                      <button
                        className="ml-2 rounded-xl bg-purple/10 px-2 py-[2px] text-[0.7rem] font-semibold text-purple hover:bg-purple/20"
                        onClick={() => handleSaveSlot(slot)}
                      >
                        Save
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        <h3 className="mt-4 mb-1 text-sm font-semibold text-dark">
          My planned slots
        </h3>
        {mySlots.length === 0 && (
          <p className="text-xs md:text-sm text-dark/60">None yet.</p>
        )}
        <ul className="space-y-1 text-xs md:text-sm">
          {mySlots.map((s: any) => (
            <li key={s.id}>
              {s.platform} – {s.scheduled_at} {s.notify ? "🔔" : ""}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
