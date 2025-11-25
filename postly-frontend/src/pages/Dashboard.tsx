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
import BlobRedLarge from "../assets/blobs/blob-5.png";

// simple modal
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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white/95 p-5 md:p-6 shadow-2xl border border-purple/10"
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

type UsageSummary = {
  ideas_used: number;
  ideas_limit: number;
  captions_used: number;
  captions_limit: number;
};

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
  const [captionObj, setCaptionObj] = useState<any | null>(null);
  const [savingIdeaId, setSavingIdeaId] = useState<number | null>(null);
  const [savingMediaDraft, setSavingMediaDraft] = useState(false);

  // scheduler
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mySlots, setMySlots] = useState<any[]>([]);
  const [schedulerLoading, setSchedulerLoading] = useState(false);

  const [mediaDraftTitle, setMediaDraftTitle] = useState("");

  // drafts
  const [recentDrafts, setRecentDrafts] = useState<any[]>([]);

  const [usage, setUsage] = useState<UsageSummary | null>(null);


  async function refreshRecentDrafts() {
    try {
      const res = await api.get("/drafts/?limit=3");
      setRecentDrafts(res.data || []);
    } catch {
      // non-blocking
    }
  }

  async function fetchUsageSummary() {
    try {
      const res = await api.get("/usage/summary/");
      setUsage(res.data);
    } catch (e) {
      console.warn("Could not load usage summary", e);
      setUsage(null);
    }
  }

  useEffect(() => {
    refreshRecentDrafts();
    fetchUsageSummary();
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

      // NEW: refresh usage so the count updates on the dashboard
      fetchUsageSummary();
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
      const payload = res.data;
      setCaptionObj(payload);
      const captionText =
        (payload && (payload.caption || payload.text)) ||
        JSON.stringify(payload);
      setCaption(captionText);
      setUploadStatus("Caption generated ✅");
    } catch (err) {
      setUploadStatus("Caption generation failed.");
    }
  }

  async function handleSaveIdeaAsDraft(idea: any, idx: number) {
    try {
      setSavingIdeaId(idx);
      await api.post("/drafts/", {
        draft_type: "idea",
        title: idea.title || "",
        description: idea.description || "",
        suggested_caption_starter: idea.suggested_caption_starter || "",
        hook_used: idea.hook_used || "",
        personal_twist: idea.personal_twist || "",
      });
      await refreshRecentDrafts();
    } catch (e) {
      console.warn(e);
    } finally {
      setSavingIdeaId(null);
    }
  }

  async function handleSaveMediaDraft() {
    if (!uploadId || !captionObj) {
      setUploadStatus("Generate a caption first.");
      return;
    }

    if (!mediaDraftTitle.trim()) {
      setUploadStatus("Please add a title before saving this draft.");
      return;
    }

    try {
      setSavingMediaDraft(true);
      await api.post("/drafts/", {
        draft_type: "media",            // 👈 important
        media: uploadId,
        caption: captionObj.id,
        title: mediaDraftTitle.trim(),  // 👈 THIS is what must go through
      });
      await refreshRecentDrafts();
      setUploadStatus("Media draft saved ✅");
      setMediaDraftTitle("");
    } catch (e) {
      console.warn(e);
      setUploadStatus("Failed to save draft.");
    } finally {
      setSavingMediaDraft(false);
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
            radial-gradient(120% 200% at 0% 0%, rgba(111, 161, 255, 0.14), transparent 60%),
            radial-gradient(120% 200% at 100% 100%, rgba(139, 80, 235, 0.18), transparent 60%)
          `,
        }}
      />

      {/* blobs */}
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
        className="pointer-events-none absolute right-[-260px] top-[-200px] w-[520px] opacity-70 rotate-[18deg]"
      />
      <img
        src={BlobRed}
        alt=""
        className="pointer-events-none absolute right-[-200px] top-[220px] w-[340px] opacity-60 rotate-[10deg]"
      />
      <img
        src={BlobPurple}
        alt=""
        className="pointer-events-none absolute left-[-260px] bottom-[-260px] w-[520px] opacity-70 rotate-[18deg]"
      />
      <img
        src={BlobYellow}
        alt=""
        className="pointer-events-none absolute left-[-220px] top-[220px] w-[340px] opacity-70 rotate-[18deg]"
      />

      <div className="relative z-10 px-4 py-6 md:px-6 md:py-8">
        {/* header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-dark mb-1">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-dark/70 max-w-xl">
              Generate content ideas, captions and schedule posts – all in one
              place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/use-cases"
              className="rounded-2xl border border-purple/20 bg-white/70 px-4 py-2 text-xs md:text-sm font-semibold text-purple shadow-sm hover:bg-purple/5 transition-all"
            >
              Use cases & templates
            </Link>
            <Link
              to="/gallery"
              className="rounded-2xl bg-purple text-xs md:text-sm font-semibold text-white px-4 py-2 shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
            >
              Open gallery
            </Link>
          </div>
        </header>

        {/* main grid */}
        <div className="grid gap-5 lg:grid-cols-[2fr,1fr] items-start">
          {/* left column */}
          <div className="space-y-5">
            {/* quick actions */}
            <section className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-md p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-sm md:text-base font-semibold text-dark mb-1">
                    Create something new
                  </h2>
                  <p className="text-xs md:text-sm text-dark/70">
                    Generate ideas, captions or upload media to start drafting
                    your next post.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Ideas card */}
                <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-md p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">💡</span>
                      <h2 className="text-sm md:text-base font-semibold text-dark">
                        Idea generator
                      </h2>
                    </div>
                    <p className="text-xs md:text-sm text-dark/70">
                      Get hooks, angles and ideas tailored to your niche.
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenIdeas(true)}
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
                    type="button"
                  >
                    Open ideas
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
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
                    type="button"
                  >
                    Open upload
                  </button>
                </div>

                {/* Scheduler card */}
                <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-md p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">📅</span>
                      <h2 className="text-sm md:text-base font-semibold text-dark">
                        Smart scheduler
                      </h2>
                    </div>
                    <p className="text-xs md:text-sm text-dark/70">
                      See best times to post and plan your content calendar.
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenScheduler(true)}
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
                    type="button"
                  >
                    Open scheduler
                  </button>
                </div>
              </div>
            </section>

            {/* reviews */}
            <section className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-md p-5 md:p-6">
              <ReviewsSection />
            </section>
          </div>

          {/* right column */}
          <div className="space-y-5">
            {/* stats / summary */}
            <section className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-md p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm md:text-base font-semibold text-dark">
                  Quick snapshot
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
                <div className="rounded-2xl bg-purple/5 border border-purple/10 px-3 py-3">
                  <p className="text-[0.7rem] uppercase tracking-wide text-dark/60 mb-1">
                    Ideas generated
                  </p>
                  <p className="text-lg font-semibold text-purple">
                    {usage ? `${usage.ideas_used} / ${usage.ideas_limit || 0}` : "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-pink/5 border border-pink/10 px-3 py-3">
                  <p className="text-[0.7rem] uppercase tracking-wide text-dark/60 mb-1">
                    Drafts saved
                  </p>
                  <p className="text-lg font-semibold text-pink">
                    {recentDrafts.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-yellow-100/40 border border-yellow-200 px-3 py-3">
                  <p className="text-[0.7rem] uppercase tracking-wide text-dark/60 mb-1">
                    Scheduled posts
                  </p>
                  <p className="text-lg font-semibold text-amber-600">
                    {mySlots.length}
                  </p>
                </div>
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
                          <p className="text-[0.7rem] text-dark/60">
                            {d.draft_type === "media"
                              ? "Media draft"
                              : "Idea draft"}
                          </p>
                        </div>
                        <Link
                          to="/gallery"
                          className="rounded-full bg-purple/10 px-3 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/20 transition-colors"
                        >
                          Open
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Modals */}

        {/* Ideas */}
        <Modal
          open={openIdeas}
          onClose={() => setOpenIdeas(false)}
          title="Idea generator"
        >
          <p className="text-xs md:text-sm text-dark/70 mb-3">
            We’ll generate hooks and ideas for Instagram. Later you’ll be able to
            tweak your niche & platform.
          </p>
          <button
            onClick={handleGenerateIdeas}
            disabled={ideasLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 disabled:opacity-60 hover:translate-y-[-1px] active:translate-y-0 transition-all"
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
                <div className="flex items-start justify-between gap-2">
                  <div>
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
                  <button
                    type="button"
                    onClick={() => handleSaveIdeaAsDraft(idea, idx)}
                    disabled={savingIdeaId === idx}
                    className="ml-2 shrink-0 rounded-2xl bg-purple/10 px-3 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/20 disabled:opacity-60 transition-all"
                  >
                    {savingIdeaId === idx ? "Saving..." : "Save draft"}
                  </button>
                </div>
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
            <div className="mt-3 space-y-2">
              <div>
                <h3 className="text-sm font-semibold mb-1 text-dark">Caption</h3>
                <textarea
                  value={caption}
                  readOnly
                  rows={4}
                  className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                />
              </div>

              <div>
                <label className="block text-[0.75rem] font-semibold text-dark mb-1">
                  Draft title
                </label>
                <input
                  type="text"
                  value={mediaDraftTitle}
                  onChange={(e) => setMediaDraftTitle(e.target.value)}
                  className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                  placeholder="e.g. Gym selfie before/after, Beach reel, Q&A story"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveMediaDraft}
                disabled={savingMediaDraft}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 disabled:opacity-60 hover:translate-y-[-1px] active:translate-y-0 transition-all"
              >
                {savingMediaDraft ? "Saving..." : "Save as draft"}
              </button>
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

              <div className="mt-3">
                <h4 className="text-xs md:text-sm font-semibold text-dark mb-1">
                  My scheduled posts
                </h4>
                {mySlots.length === 0 ? (
                  <p className="text-[0.8rem] text-dark/65">
                    Nothing scheduled yet.
                  </p>
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
    </div>
  );
}
