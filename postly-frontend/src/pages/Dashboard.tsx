// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ReviewsSection from "../components/ReviewSection";

// blobs & bg
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

// ---------------- Modal ----------------

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl bg-white/95 p-5 md:p-6 shadow-2xl border border-purple/10"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-purple/5 text-dark/70 hover:bg-purple/10"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="text-sm text-dark/80">{children}</div>
      </div>
    </div>
  );
}

// ---------------- Dashboard ----------------

export default function Dashboard() {
  // modals
  const [openIdeas, setOpenIdeas] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [openScheduler, setOpenScheduler] = useState(false);

  // ideas
  const [ideas, setIdeas] = useState<any[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

  // upload
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  // scheduler
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mySlots, setMySlots] = useState<any[]>([]);
  const [schedulerLoading, setSchedulerLoading] = useState(false);

  // drafts
  const [recentDrafts, setRecentDrafts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/drafts/?limit=3");
        setRecentDrafts(res.data || []);
      } catch {
        // non-blocking
      }
    })();
  }, []);

  // load scheduler when modal opens
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

  // ----- handlers -----

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

  // ---------------- UI ----------------

  return (
    <div className="relative min-h-screen overflow-hidden bg-offwhite">
      {/* soft diagonal lens gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `
            radial-gradient(120% 200% at 0% 0%, rgba(255, 111, 145, 0.14), transparent 60%),
            radial-gradient(120% 200% at 100% 100%, rgba(88, 80, 235, 0.18), transparent 60%)
          `,
          opacity: 0.6,
        }}
      />

      {/* center blur */}
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
          opacity: 0.18,
          zIndex: 0,
        }}
      />

      {/* edge blobs */}
      <img
        src={BlobRed}
        alt=""
        className="pointer-events-none absolute -left-40 -top-20 w-72 md:w-96 opacity-80"
      />
      <img
        src={BlobPurple}
        alt=""
        className="pointer-events-none absolute -right-40 top-10 w-80 opacity-80"
      />
      <img
        src={BlobBlue}
        alt=""
        className="pointer-events-none absolute -left-32 bottom-[-160px] w-[420px] opacity-80"
      />
      <img
        src={BlobGreen}
        alt=""
        className="pointer-events-none absolute -right-48 bottom-[-140px] w-[420px] opacity-80"
      />
      <img
        src={BlobYellowSmall}
        alt=""
        className="pointer-events-none absolute left-52 top-6 w-28 opacity-40 blob-float-slow"
      />
      <img
        src={BlobRedSmall}
        alt=""
        className="pointer-events-none absolute left-[-40px] bottom-[-40px] w-40 opacity-80"
      />
      <img
        src={BlobPurpleDot}
        alt=""
        className="pointer-events-none absolute left-[-40px] top-64 w-40 opacity-80 rotate-[10deg]"
      />
      <img
        src={BlobOrange}
        alt=""
        className="pointer-events-none absolute left-[-220px] top-[-160px] w-[420px] opacity-80 rotate-[18deg]"
      />
      <img
        src={BlobRedLarge}
        alt=""
        className="pointer-events-none absolute right-40 bottom-[-120px] w-80 opacity-80 rotate-[12deg]"
      />
      <img
        src={BlobPurpleLarge}
        alt=""
        className="pointer-events-none absolute right-[-140px] top-[-120px] w-[420px] opacity-40 rotate-[-16deg]"
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
         {/* CENTER BLUR BLOBS */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div
            className="hidden md:block absolute"
            style={{
              width: 280,
              height: 280,
              borderRadius: "999px",
              background: "rgba(212, 109, 238, 0.35)",
              filter: "blur(70px)",
              top: "-40px",
              left: "-160px",
            }}
          />
          <div
            className="hidden md:block absolute"
            style={{
              width: 320,
              height: 320,
              borderRadius: "999px",
              background: "rgba(69, 1, 255, 0.35)",
              filter: "blur(80px)",
              top: "120px",
              left: "80px",
            }}
          />
        </div>
        {/* header */}
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-purple mb-2">
            Welcome back
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark mb-2">
            Your creator <span className="text-purple">control center</span>
          </h1>
          <p className="text-sm md:text-[0.95rem] text-dark/70 max-w-xl">
            Generate ideas, prep captions and schedule your next posts — all in
            one place.
          </p>
        </header>

        {/* top cards */}
        <section className="grid gap-5 md:grid-cols-3 mb-8">
          {/* Idea card */}
          <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-md p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <h2 className="text-sm md:text-base font-semibold text-dark">
                  Idea Generator
                </h2>
              </div>
              <p className="text-xs md:text-sm text-dark/70">
                Generate 5 ideas based on trends and your creator profile.
              </p>
            </div>
            <button
              onClick={() => setOpenIdeas(true)}
              className="mt-4 self-start inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
              type="button"
            >
              Open
            </button>
          </div>

          {/* Upload card */}
          <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-md p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🖼️</span>
                <h2 className="text-sm md:text-base font-semibold text-dark">
                  Upload & Caption
                </h2>
              </div>
              <p className="text-xs md:text-sm text-dark/70">
                Upload an image or video and get a caption instantly.
              </p>
            </div>
            <button
              onClick={() => setOpenUpload(true)}
              className="mt-4 self-start inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
              type="button"
            >
              Open
            </button>
          </div>

          {/* Scheduler card */}
          <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-md p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📅</span>
                <h2 className="text-sm md:text-base font-semibold text-dark">
                  Scheduler
                </h2>
              </div>
              <p className="text-xs md:text-sm text-dark/70">
                See best times for the next days and save slots for reminders.
              </p>
            </div>
            <button
              onClick={() => setOpenScheduler(true)}
              className="mt-4 self-start inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
              type="button"
            >
              Open
            </button>
          </div>
        </section>

        {/* drafts */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-semibold text-dark">
              Recent drafts
            </h2>
            <Link
              to="/gallery"
              className="text-xs md:text-sm text-purple hover:text-pink transition-colors"
            >
              View all drafts →
            </Link>
          </div>

          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-md px-4 py-4 md:px-6 md:py-5">
            {recentDrafts.length === 0 ? (
              <p className="text-xs md:text-sm text-dark/95">
                No drafts yet. Generate ideas or upload to start.
              </p>
            ) : (
              <ul className="space-y-2 text-xs md:text-sm text-dark/80">
                {recentDrafts.map((d) => (
                  <li key={d.id} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {d.title || "Untitled"}
                      </span>
                      {d.status && (
                        <span className="ml-1 text-dark/60">
                          ({d.status})
                        </span>
                      )}
                    </div>
                    {d.created_at && (
                      <span className="text-[0.7rem] text-dark/55">
                        {new Date(d.created_at).toLocaleString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* reviews widget */}
        <section className="mt-6">
          <ReviewsSection />
        </section>
      </div>

      {/* MODALS */}

      {/* Ideas */}
      <Modal
        open={openIdeas}
        onClose={() => setOpenIdeas(false)}
        title="Idea Generator"
      >
        <button
          onClick={handleGenerateIdeas}
          disabled={ideasLoading}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 disabled:opacity-60 disabled:hover:translate-y-0 hover:translate-y-[-1px] active:translate-y-0 transition-all"
          type="button"
        >
          {ideasLoading ? "Generating..." : "Generate 5 ideas"}
        </button>

        <div className="mt-4 space-y-3">
          {ideas.length === 0 && !ideasLoading && (
            <p className="text-xs md:text-sm text-dark/70">
              No ideas yet. Click the button above.
            </p>
          )}
          {ideas.map((idea, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-purple/10 bg-purple/5 px-3 py-3 text-xs md:text-sm"
            >
              <h3 className="font-semibold text-dark mb-1">
                {idea.title || "Idea"}
              </h3>
              {idea.description && (
                <p className="text-dark/75 mb-1">{idea.description}</p>
              )}
              {idea.suggested_caption_starter && (
                <p className="text-[0.75rem] text-dark/70">
                  <span className="font-semibold">Caption start:</span>{" "}
                  {idea.suggested_caption_starter}
                </p>
              )}
              {idea.personal_twist && (
                <p className="text-[0.75rem] text-dark/70">
                  <span className="font-semibold">Twist:</span>{" "}
                  {idea.personal_twist}
                </p>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* Upload */}
      <Modal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        title="Upload & Caption"
      >
        <form
          onSubmit={handleUpload}
          className="flex flex-col md:flex-row gap-3 items-start md:items-center"
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-xs md:text-sm"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
          >
            Upload
          </button>
        </form>

        {uploadStatus && (
          <p className="mt-2 text-xs md:text-sm text-dark/75">{uploadStatus}</p>
        )}

        {uploadId && (
          <div className="mt-3">
            <button
              onClick={handleGenerateCaption}
              className="inline-flex items-center justify-center rounded-2xl bg-purple/10 px-4 py-2 text-xs md:text-sm font-semibold text-purple hover:bg-purple/20 transition-all"
              type="button"
            >
              Generate caption
            </button>
          </div>
        )}

        {caption && (
          <div className="mt-3">
            <h3 className="text-sm font-semibold mb-1 text-dark">Caption</h3>
            <textarea
              value={caption}
              readOnly
              rows={4}
              className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
            />
          </div>
        )}
      </Modal>

      {/* Scheduler */}
      <Modal
        open={openScheduler}
        onClose={() => setOpenScheduler(false)}
        title="Best times to post"
      >
        {schedulerLoading && (
          <p className="text-xs md:text-sm text-dark/75">Loading...</p>
        )}

        {!schedulerLoading && (
          <div className="space-y-4">
            {suggestions.map((day: any) => (
              <div key={day.date} className="border-b border-purple/10 pb-3">
                <h4 className="text-xs md:text-sm font-semibold text-dark mb-1">
                  {day.date}
                </h4>
                {day.slots.length === 0 && (
                  <p className="text-[0.8rem] text-dark/65">
                    No suggestions for this day.
                  </p>
                )}
                <ul className="space-y-1 text-[0.8rem] text-dark/80">
                  {day.slots.map((slot: any) => (
                    <li key={slot.datetime}>
                      {slot.time} – {slot.platform} (score{" "}
                      {slot.engagement_score})
                      {slot.saved ? (
                        <span className="ml-2 text-green-600">✅ saved</span>
                      ) : (
                        <button
                          className="ml-2 rounded-full bg-purple/10 px-2 py-0.5 text-[0.7rem] font-semibold text-purple hover:bg-purple/20 transition-all"
                          type="button"
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

            <div className="mt-2">
              <h3 className="text-xs md:text-sm font-semibold text-dark mb-1">
                My planned slots
              </h3>
              {mySlots.length === 0 ? (
                <p className="text-[0.8rem] text-dark/65">None yet.</p>
              ) : (
                <ul className="space-y-1 text-[0.8rem] text-dark/80">
                  {mySlots.map((s: any) => (
                    <li key={s.id}>
                      {s.platform} – {s.scheduled_at}{" "}
                      {s.notify ? "🔔" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
