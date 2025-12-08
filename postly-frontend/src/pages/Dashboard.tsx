// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ReviewsSection from "../components/ReviewSection";
import { useLanguage } from "../i18n/LanguageContext";

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
import SchedulerWidget, { type Reminder } from "../components/SchedulerWidget";

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
        className="
          relative w-full max-w-xl max-h-[85vh]
          rounded-3xl bg-white/95 p-5 md:p-6
          shadow-2xl border border-purple/10
          flex flex-col
        "
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
          <h2 className="text-lg font-semibold text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-purple/5 text-dark/70 hover:bg-purple/10"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* scrollable body */}
        <div className="text-sm text-dark/80 overflow-y-auto pr-1 flex-1">
          {children}
        </div>
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
  const { t } = useLanguage();

  // modals
  const [openIdeas, setOpenIdeas] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  // ideas
  const [ideas, setIdeas] = useState<any[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

  // idea action plans
  const [ideaPlans, setIdeaPlans] = useState<Record<number, any>>({});
  const [planLoadingIdx, setPlanLoadingIdx] = useState<number | null>(null);

  // upload
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [captionObj, setCaptionObj] = useState<any | null>(null);
  const [savingIdeaId, setSavingIdeaId] = useState<number | null>(null);
  const [savingMediaDraft, setSavingMediaDraft] = useState(false);

  // scheduler
  const [reminders, setReminders] = useState<Reminder[]>([]);
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

  // load scheduler when page mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/schedule/reminders/");
        setReminders(res.data || []);
      } catch (err) {
        console.warn("Could not load reminders", err);
      }
    })();
  }, []);

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

      // refresh usage so the count updates on the dashboard
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
      setUploadStatus(t("dashboard_upload_status_uploading"));
      const res = await api.post("/uploads/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const mediaId = res.data.id || res.data.media_id || res.data.uuid;
      setUploadId(mediaId);
      setUploadStatus(t("dashboard_upload_status_uploaded"));
    } catch (err) {
      setUploadStatus(t("dashboard_upload_status_failed"));
    }
  }

  async function handleGenerateCaption() {
    if (!uploadId) {
      setUploadStatus(t("dashboard_upload_status_need_upload"));
      return;
    }
    try {
      setUploadStatus(t("dashboard_upload_status_caption_generating"));
      const res = await api.post("/captions/generate/", {
        media_id: uploadId,
      });
      const payload = res.data;
      setCaptionObj(payload);
      const captionText =
        (payload && (payload.caption || payload.text)) ||
        JSON.stringify(payload);
      setCaption(captionText);
      setUploadStatus(t("dashboard_upload_status_caption_ready"));
    } catch (err) {
      setUploadStatus(t("dashboard_upload_status_caption_failed"));
    }
  }

  async function loadReminders() {
    try {
      const res = await api.get("/schedule/reminders/");
      setReminders(res.data || []);
    } catch (err) {
      console.error("Could not refresh reminders", err);
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
        execution_plan: ideaPlans[idx] || "",
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

  async function handleGenerateActionPlan(idea: any, idx: number) {
    setPlanLoadingIdx(idx);

    try {
      const res = await api.post("/ideas/action-plan/", {
        idea: {
          title: idea.title || "",
          description: idea.description || "",
          platform: "instagram",
        },
      });

      const text =
        res.data.plan ||
        res.data.action_plan ||
        res.data.text ||
        JSON.stringify(res.data, null, 2);

      setIdeaPlans((prev) => ({
        ...prev,
        [idx]: text,
      }));
    } catch (err) {
      console.error("Error generating action plan", err);
    } finally {
      setPlanLoadingIdx(null);
    }
  }

  async function handleSaveMediaDraft() {
    if (!uploadId || !captionObj) {
      setUploadStatus(t("dashboard_upload_status_need_caption"));
      return;
    }

    if (!mediaDraftTitle.trim()) {
      setUploadStatus(t("dashboard_upload_status_need_title"));
      return;
    }

    try {
      setSavingMediaDraft(true);
      await api.post("/drafts/", {
        draft_type: "media",
        media: uploadId,
        caption: captionObj.id,
        title: mediaDraftTitle.trim(),
      });
      await refreshRecentDrafts();
      setUploadStatus(t("dashboard_upload_status_saved"));
      setMediaDraftTitle("");
    } catch (e) {
      console.warn(e);
      setUploadStatus(t("dashboard_upload_status_save_failed"));
    } finally {
      setSavingMediaDraft(false);
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

      {/* blobs (unchanged) */}
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
              {t("dashboard_header_title")}
            </h1>
            <p className="text-sm md:text-base text-dark/70 max-w-xl">
              {t("dashboard_header_subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/use-cases"
              className="rounded-2xl border border-purple/20 bg-white/70 px-4 py-2 text-xs md:text-sm font-semibold text-purple shadow-sm hover:bg-purple/5 transition-all"
            >
              {t("dashboard_header_button_use_cases")}
            </Link>
            <Link
              to="/gallery"
              className="rounded-2xl bg-purple text-xs md:text-sm font-semibold text-white px-4 py-2 shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
            >
              {t("dashboard_header_button_gallery")}
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
                    {t("dashboard_quick_title")}
                  </h2>
                  <p className="text-xs md:text-sm text-dark/70">
                    {t("dashboard_quick_subtitle")}
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
                        {t("dashboard_card_ideas_title")}
                      </h2>
                    </div>
                    <p className="text-xs md:text-sm text-dark/70">
                      {t("dashboard_card_ideas_text")}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenIdeas(true)}
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
                    type="button"
                  >
                    {t("dashboard_card_ideas_button")}
                  </button>
                </div>

                {/* Upload card */}
                <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-md p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🖼️</span>
                      <h2 className="text-sm md:text-base font-semibold text-dark">
                        {t("dashboard_card_upload_title")}
                      </h2>
                    </div>
                    <p className="text-xs md:text-sm text-dark/70">
                      {t("dashboard_card_upload_text")}
                    </p>
                  </div>
                  <button
                    onClick={() => setOpenUpload(true)}
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
                    type="button"
                  >
                    {t("dashboard_card_upload_button")}
                  </button>
                </div>

                {/* Scheduler card */}
                <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-md p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">📅</span>
                      <h2 className="text-sm md:text-base font-semibold text-dark">
                        {t("dashboard_card_scheduler_title")}
                      </h2>
                    </div>
                    <p className="text-xs md:text-sm text-dark/70">
                      {t("dashboard_card_scheduler_text")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const el = document.getElementById("dashboard-scheduler");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="mt-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all"
                    type="button"
                  >
                    {t("dashboard_card_scheduler_button")}
                  </button>
                </div>
              </div>
            </section>

            <SchedulerWidget
              reminders={reminders}
              setReminders={setReminders}
              drafts={recentDrafts}
              loadReminders={loadReminders}
            />

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
                  {t("dashboard_stats_title")}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
                <div className="rounded-2xl bg-purple/5 border border-purple/10 px-3 py-3">
                  <p className="text-[0.7rem] uppercase tracking-wide text-dark/60 mb-1">
                    {t("dashboard_stats_ideas_label")}
                  </p>
                  <p className="text-lg font-semibold text-purple">
                    {usage ? `${usage.ideas_used} / ${usage.ideas_limit || 0}` : "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-pink/5 border border-pink/10 px-3 py-3">
                  <p className="text-[0.7rem] uppercase tracking-wide text-dark/60 mb-1">
                    {t("dashboard_stats_drafts_label")}
                  </p>
                  <p className="text-lg font-semibold text-pink">
                    {recentDrafts.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-yellow-100/40 border border-yellow-200 px-3 py-3">
                  <p className="text-[0.7rem] uppercase tracking-wide text-dark/60 mb-1">
                    {t("dashboard_stats_scheduled_label")}
                  </p>
                  <p className="text-lg font-semibold text-amber-600">
                    {reminders.length}
                  </p>
                </div>
              </div>
            </section>

            {/* drafts */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm md:text-base font-semibold text-dark">
                  {t("dashboard_recent_title")}
                </h2>
                <Link
                  to="/gallery"
                  className="text-xs md:text-sm text-purple hover:text-pink transition-colors"
                >
                  {t("dashboard_recent_link_all")}
                </Link>
              </div>

              <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-md px-4 py-4 md:px-6 md:py-5">
                {recentDrafts.length === 0 ? (
                  <p className="text-xs md:text-sm text-dark/95">
                    {t("dashboard_recent_empty")}
                  </p>
                ) : (
                  <ul className="space-y-2 text-xs md:text-sm text-dark/80">
                    {recentDrafts.map((d) => (
                      <li key={d.id} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {d.title || t("dashboard_recent_untitled")}
                          </span>
                          {d.status && (
                            <span className="ml-1 text-dark/60">
                              ({d.status})
                            </span>
                          )}
                          <p className="text-[0.7rem] text-dark/60">
                            {d.draft_type === "media"
                              ? t("dashboard_recent_type_media")
                              : t("dashboard_recent_type_idea")}
                          </p>
                        </div>
                        <Link
                          to="/gallery"
                          className="rounded-full bg-purple/10 px-3 py-1 text-[0.7rem] font-semibold text-purple hover:bg-purple/20 transition-colors"
                        >
                          {t("dashboard_recent_open_button")}
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
          title={t("dashboard_modal_ideas_title")}
        >
          <p className="text-xs md:text-sm text-dark/70 mb-3">
            {t("dashboard_modal_ideas_intro")}
          </p>
          <button
            onClick={handleGenerateIdeas}
            disabled={ideasLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 disabled:opacity-60 hover:translate-y-[-1px] active:translate-y-0 transition-all"
            type="button"
          >
            {ideasLoading
              ? t("dashboard_modal_ideas_button_generating")
              : t("dashboard_modal_ideas_button_generate")}
          </button>

          <div className="mt-4 space-y-3">
            {ideas.length === 0 && !ideasLoading && (
              <p className="text-xs md:text-sm text-dark/70">
                {t("dashboard_modal_ideas_empty")}
              </p>
            )}
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-purple/10 bg-purple/5 px-3 py-3 text-xs md:text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-dark">
                      {idea.title || t("dashboard_modal_ideas_fallback_title")}
                    </h3>

                    {idea.description && (
                      <p className="text-dark/75">{idea.description}</p>
                    )}

                    {idea.suggested_caption_starter && (
                      <p className="text-[0.75rem] text-dark/70">
                        <span className="font-semibold">
                          {t("dashboard_modal_ideas_caption_start_label")}
                        </span>{" "}
                        {idea.suggested_caption_starter}
                      </p>
                    )}

                    {idea.personal_twist && (
                      <p className="text-[0.75rem] text-dark/70">
                        <span className="font-semibold">
                          {t("dashboard_modal_ideas_twist_label")}
                        </span>{" "}
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
                    {savingIdeaId === idx
                      ? t("dashboard_modal_ideas_save_saving")
                      : t("dashboard_modal_ideas_save_button")}
                  </button>
                </div>

                {/* Actions under the idea */}
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => handleGenerateActionPlan(idea, idx)}
                    disabled={planLoadingIdx === idx}
                    className="inline-flex items-center justify-center rounded-2xl bg-purple/10 px-3 py-1.5 text-[0.7rem] font-semibold text-purple hover:bg-purple/20 disabled:opacity-60 transition-all"
                  >
                    {planLoadingIdx === idx
                      ? t("dashboard_modal_ideas_plan_generating")
                      : t("dashboard_modal_ideas_plan_button")}
                  </button>

                  {ideaPlans[idx] && (
                    <span className="text-[0.7rem] text-green-700">
                      {t("dashboard_modal_ideas_plan_ready")}
                    </span>
                  )}
                </div>

                {/* Loading copy */}
                {planLoadingIdx === idx && (
                  <p className="mt-1 text-[0.7rem] text-dark/60">
                    {t("dashboard_modal_ideas_plan_loading")}
                  </p>
                )}

                {/* Simple action plan inline */}
                {ideaPlans[idx] &&
                  (() => {
                    const raw = ideaPlans[idx];

                    const toText = (plan: any): string => {
                      if (!plan) return "";
                      if (typeof plan === "string") return plan;

                      if (plan.plan || plan.action_plan || plan.text) {
                        const inner = plan.plan || plan.action_plan || plan.text;
                        if (typeof inner === "string") return inner;
                        plan = inner;
                      }

                      const parts: string[] = [];

                      if (plan.idea_title) {
                        parts.push(plan.idea_title);
                      }

                      if (plan.concept_summary) {
                        parts.push(plan.concept_summary);
                      }

                      if (Array.isArray(plan.sections) && plan.sections.length > 0) {
                        const sectionLines: string[] = [];

                        plan.sections.forEach((sec: any, sIdx: number) => {
                          if (!sec) return;
                          const title = sec.title || `Part ${sIdx + 1}`;
                          sectionLines.push(`${title}:`);

                          if (Array.isArray(sec.steps) && sec.steps.length > 0) {
                            sec.steps.forEach((step: any, i: number) => {
                              const text =
                                typeof step === "string"
                                  ? step
                                  : step.text || step.description || "";
                              if (text) {
                                sectionLines.push(`  ${i + 1}. ${text}`);
                              }
                            });
                          }

                          sectionLines.push("");
                        });

                        parts.push(sectionLines.join("\n"));
                      }

                      if (plan.overview) {
                        parts.push(plan.overview);
                      }

                      if (Array.isArray(plan.steps) && plan.steps.length > 0) {
                        parts.push(
                          "Steps:\n" +
                            plan.steps
                              .map((s: any, i: number) => {
                                if (typeof s === "string") return `${i + 1}. ${s}`;
                                const title = s.title || `Step ${i + 1}`;
                                const detail = s.detail || s.description || "";
                                return `${i + 1}. ${title}${
                                  detail ? ` – ${detail}` : ""
                                }`;
                              })
                              .join("\n")
                        );
                      }

                      if (
                        Array.isArray(plan.checklist) &&
                        plan.checklist.length > 0
                      ) {
                        parts.push(
                          "Checklist:\n" +
                            plan.checklist
                              .map((c: any) => {
                                const text =
                                  typeof c === "string" ? c : c.text || "";
                                return text ? `• ${text}` : "";
                              })
                              .filter(Boolean)
                              .join("\n")
                        );
                      }

                      if (plan.hook) {
                        parts.push(`Hook: ${plan.hook}`);
                      }

                      if (plan.caption_template || plan.caption_prompt) {
                        parts.push(
                          `Caption starter: ${
                            plan.caption_template || plan.caption_prompt
                          }`
                        );
                      }

                      if (Array.isArray(plan.tags) && plan.tags.length > 0) {
                        parts.push("Tags: " + plan.tags.join(", "));
                      }

                      if (plan.timeframe) {
                        parts.push(`Timeframe: ${plan.timeframe}`);
                      }

                      if (!parts.length) {
                        try {
                          return JSON.stringify(plan, null, 2);
                        } catch {
                          return "";
                        }
                      }

                      return parts.join("\n\n");
                    };

                    let text = "";

                    if (typeof raw === "string") {
                      try {
                        const parsed = JSON.parse(raw);
                        text = toText(parsed) || raw;
                      } catch {
                        text = raw;
                      }
                    } else {
                      text = toText(raw);
                    }

                    if (!text) return null;

                    return (
                      <div className="mt-4 text-[0.85rem] text-dark/85 whitespace-pre-line leading-relaxed">
                        <span className="block text-[0.9rem] font-semibold mb-2 text-purple-700">
                          {t("dashboard_actionplan_title")}
                        </span>

                        <div
                          className="space-y-3"
                          dangerouslySetInnerHTML={{
                            __html: text
                              .replace(
                                /^([A-Za-z ].+?):$/gm,
                                "<strong>$1:</strong>"
                              )
                              .replace(/\n/g, "<br>"),
                          }}
                        />
                      </div>
                    );
                  })()}
              </div>
            ))}
          </div>
        </Modal>

        {/* Upload */}
        <Modal
          open={openUpload}
          onClose={() => setOpenUpload(false)}
          title={t("dashboard_modal_upload_title")}
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
              {t("dashboard_modal_upload_button")}
            </button>
          </form>

          {uploadStatus && (
            <p className="mt-2 text-xs md:text-sm text-dark/75">
              {uploadStatus}
            </p>
          )}

          {uploadId && (
            <div className="mt-3">
              <button
                onClick={handleGenerateCaption}
                className="inline-flex items-center justify-center rounded-2xl bg-purple/10 px-4 py-2 text-xs md:text-sm font-semibold text-purple hover:bg-purple/20 transition-all"
                type="button"
              >
                {t("dashboard_upload_caption_button")}
              </button>
            </div>
          )}

          {caption && (
            <div className="mt-3 space-y-2">
              <div>
                <h3 className="text-sm font-semibold mb-1 text-dark">
                  {t("dashboard_upload_caption_label")}
                </h3>
                <textarea
                  value={caption}
                  readOnly
                  rows={4}
                  className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                />
              </div>

              <div>
                <label className="block text-[0.75rem] font-semibold text-dark mb-1">
                  {t("dashboard_upload_draft_title_label")}
                </label>
                <input
                  type="text"
                  value={mediaDraftTitle}
                  onChange={(e) => setMediaDraftTitle(e.target.value)}
                  className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                  placeholder={t("dashboard_upload_draft_title_placeholder")}
                />
              </div>

              <button
                type="button"
                onClick={handleSaveMediaDraft}
                disabled={savingMediaDraft}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple to-pink px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-md shadow-purple/30 hover:shadow-purple/40 disabled:opacity-60 hover:translate-y-[-1px] active:translate-y-0 transition-all"
              >
                {savingMediaDraft
                  ? t("dashboard_upload_save_saving")
                  : t("dashboard_upload_save_button")}
              </button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
