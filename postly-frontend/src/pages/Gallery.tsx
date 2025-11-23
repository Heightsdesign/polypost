// src/pages/Gallery.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

type DraftType = "idea" | "media";

type Draft = {
  id: string;
  draft_type: DraftType;
  title?: string;
  description?: string;
  suggested_caption_starter?: string;
  hook_used?: string;
  personal_twist?: string;
  pinned: boolean;
  archived: boolean;
  created_at?: string;
  media?: string | null;
  caption?: string | null;
  media_url?: string | null;
  // Optional extras if you later expose them from the backend
  caption_text?: string | null;
};

type CaptionPayload = {
  id: string;
  text: string;
  is_user_edited?: boolean;
  created_at?: string;
};

export default function Gallery() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pinned" | "idea" | "media">(
    "all"
  );
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // idea edit fields (for selected draft)
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editHook, setEditHook] = useState("");
  const [editCaptionStarter, setEditCaptionStarter] = useState("");
  const [editTwist, setEditTwist] = useState("");
  const [savingIdeaChanges, setSavingIdeaChanges] = useState(false);

  // media caption in modal
  const [modalCaption, setModalCaption] = useState<string>("");
  const [captionObj, setCaptionObj] = useState<CaptionPayload | null>(null);
  const [regeneratingCaption, setRegeneratingCaption] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ---------- data loading ----------

  async function fetchDrafts() {
    setLoading(true);
    try {
      const res = await api.get("/drafts/");
      setDrafts(res.data || []);
    } catch (err) {
      console.warn("Could not load drafts", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDrafts();
  }, []);

  // ---------- helpers ----------

  const filteredDrafts = drafts.filter((d) => {
    if (filter === "pinned") return d.pinned;
    if (filter === "idea") return d.draft_type === "idea";
    if (filter === "media") return d.draft_type === "media";
    return true;
  });

  function openDetail(d: Draft) {
    setSelectedDraft(d);
    setDetailOpen(true);

    if (d.draft_type === "idea") {
      setEditTitle(d.title || "");
      setEditDescription(d.description || "");
      setEditHook(d.hook_used || "");
      setEditCaptionStarter(d.suggested_caption_starter || "");
      setEditTwist(d.personal_twist || "");
      setModalCaption("");
      setCaptionObj(null);
    } else {
      // media draft
      setEditTitle(d.title || "");
      setModalCaption(d.caption_text || ""); // if you later add caption_text to serializer
      setCaptionObj(null);
      setEditDescription("");
      setEditHook("");
      setEditCaptionStarter("");
      setEditTwist("");
    }
  }

  function closeDetail() {
    setDetailOpen(false);
    setSelectedDraft(null);
    setCaptionObj(null);
    setModalCaption("");
  }

  // ---------- actions: pin / unpin / archive ----------

  async function togglePin(draft: Draft) {
    setActionLoadingId(draft.id);
    try {
      const action = draft.pinned ? "unpin" : "pin";
      await api.post(`/drafts/${draft.id}/pin/`, { action });
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === draft.id
            ? {
                ...d,
                pinned: !draft.pinned,
              }
            : d
        )
      );
    } catch (err) {
      console.warn("Pin/unpin failed", err);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function archiveDraft(draft: Draft) {
    if (!window.confirm("Archive this draft? It will disappear from this view.")) {
      return;
    }
    setActionLoadingId(draft.id);
    try {
      await api.post(`/drafts/${draft.id}/archive/`);
      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      if (selectedDraft && selectedDraft.id === draft.id) {
        closeDetail();
      }
    } catch (err) {
      console.warn("Archive failed", err);
    } finally {
      setActionLoadingId(null);
    }
  }

  // ---------- actions: save idea changes (requires a PATCH endpoint) ----------

  async function handleSaveIdeaChanges() {
    if (!selectedDraft) return;
    setSavingIdeaChanges(true);
    try {
      // optimistic update
      const updated: Draft = {
        ...selectedDraft,
        title: editTitle,
        description: editDescription,
        hook_used: editHook,
        suggested_caption_starter: editCaptionStarter,
        personal_twist: editTwist,
      };
      setSelectedDraft(updated);
      setDrafts((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));

      // If you add a PATCH/PUT view for /drafts/<id>/ on the backend,
      // this call will persist the changes:
      await api.patch(`/drafts/${selectedDraft.id}/`, {
        title: editTitle,
        description: editDescription,
        hook_used: editHook,
        suggested_caption_starter: editCaptionStarter,
        personal_twist: editTwist,
      });
    } catch (err) {
      console.warn("Saving idea changes failed", err);
    } finally {
      setSavingIdeaChanges(false);
    }
  }

  // ---------- actions: regenerate caption for media draft ----------

  async function handleRegenerateCaption() {
    if (!selectedDraft || selectedDraft.draft_type !== "media" || !selectedDraft.media) {
      return;
    }

    setRegeneratingCaption(true);
    try {
      const res = await api.post("/captions/generate/", {
        media_id: selectedDraft.media,
      });
      const payload: CaptionPayload = res.data;
      setCaptionObj(payload);
      setModalCaption(payload.text || "");
    } catch (err) {
      console.warn("Caption regeneration failed", err);
    } finally {
      setRegeneratingCaption(false);
    }
  }

  // If later you want to persist the *new* caption to the draft, you could:
  // await api.patch(`/drafts/${selectedDraft.id}/`, { caption: captionObj.id });

  // ---------- UI ----------

  return (
    <div className="relative min-h-screen bg-offwhite">
      <div className="relative z-10 px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-dark mb-1">
              My content gallery
            </h1>
            <p className="text-sm md:text-base text-dark/70 max-w-xl">
              All your saved ideas and media drafts created in Postly. Pin your
              favorites, archive what&apos;s done.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-2xl border border-purple/20 bg-white/70 px-4 py-2 text-xs md:text-sm font-semibold text-purple shadow-sm hover:bg-purple/5 transition-all"
            >
              ← Back to dashboard
            </Link>
          </div>
        </header>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs md:text-sm">
          <button
            type="button"
            className={`rounded-full px-3 py-1 border ${
              filter === "all"
                ? "bg-purple text-white border-purple"
                : "bg-white border-purple/20 text-dark/70 hover:bg-purple/5"
            } transition-all`}
            onClick={() => setFilter("all")}
          >
            All drafts
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 border ${
              filter === "pinned"
                ? "bg-purple text-white border-purple"
                : "bg-white border-purple/20 text-dark/70 hover:bg-purple/5"
            } transition-all`}
            onClick={() => setFilter("pinned")}
          >
            Pinned
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 border ${
              filter === "idea"
                ? "bg-purple text-white border-purple"
                : "bg-white border-purple/20 text-dark/70 hover:bg-purple/5"
            } transition-all`}
            onClick={() => setFilter("idea")}
          >
            Ideas
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 border ${
              filter === "media"
                ? "bg-purple text-white border-purple"
                : "bg-white border-purple/20 text-dark/70 hover:bg-purple/5"
            } transition-all`}
            onClick={() => setFilter("media")}
          >
            Media drafts
          </button>
        </div>

        {/* Loading / empty */}
        {loading && (
          <p className="text-sm text-dark/70 mb-2">Loading drafts...</p>
        )}

        {!loading && drafts.length === 0 && (
          <div className="rounded-3xl bg-white/90 border border-white/40 shadow-md px-4 py-6 md:px-6 md:py-8">
            <p className="text-sm md:text-base text-dark/80">
              No drafts yet. Go to the{" "}
              <Link to="/dashboard" className="text-purple underline">
                dashboard
              </Link>{" "}
              to generate ideas or upload media.
            </p>
          </div>
        )}

        {/* Grid */}
        {filteredDrafts.length > 0 && (
          <div className="grid gap-4 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDrafts.map((d) => (
              <article
                key={d.id}
                className="group rounded-3xl bg-white/95 border border-white/40 shadow-md hover:shadow-lg hover:border-purple/20 transition-all flex flex-col overflow-hidden"
              >
                {/* thumbnail if media */}
                {d.draft_type === "media" && d.media_url && (
                  <div className="relative">
                    <img
                      src={d.media_url}
                      alt=""
                      className="h-40 w-full object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[0.7rem] text-white">
                      Media draft
                    </span>
                  </div>
                )}

                <div className="flex-1 p-3 md:p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm md:text-base font-semibold text-dark">
                          {d.title || "Untitled draft"}
                        </h3>
                        {d.pinned && (
                          <span className="text-[0.7rem] rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                            Pinned
                          </span>
                        )}
                      </div>

                      <p className="text-[0.7rem] uppercase tracking-wide text-dark/50 mb-1">
                        {d.draft_type === "media" ? "Media draft" : "Idea draft"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePin(d)}
                      disabled={actionLoadingId === d.id}
                      className="text-[0.7rem] rounded-full bg-purple/5 px-2 py-1 text-purple hover:bg-purple/15 disabled:opacity-60"
                    >
                      {d.pinned ? "Unpin" : "Pin"}
                    </button>
                  </div>

                  {/* Preview text */}
                  {d.draft_type === "idea" && (
                    <p className="text-xs md:text-sm text-dark/75 line-clamp-3">
                      {d.description ||
                        d.suggested_caption_starter ||
                        d.personal_twist ||
                        "Idea details"}
                    </p>
                  )}
                  {d.draft_type === "media" && (
                    <p className="text-xs md:text-sm text-dark/75 line-clamp-3">
                      {d.caption_text
                        ? d.caption_text
                        : "Media draft with caption. Open to view / regenerate."}
                    </p>
                  )}

                  {/* Date */}
                  {d.created_at && (
                    <p className="text-[0.7rem] text-dark/50 mt-1">
                      Saved{" "}
                      {new Date(d.created_at).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openDetail(d)}
                      className="text-[0.75rem] rounded-2xl bg-purple text-white px-3 py-1.5 font-semibold hover:bg-purple/90"
                    >
                      View details
                    </button>
                    <button
                      type="button"
                      onClick={() => archiveDraft(d)}
                      disabled={actionLoadingId === d.id}
                      className="text-[0.7rem] rounded-2xl bg-red-50 text-red-600 px-3 py-1.5 hover:bg-red-100 disabled:opacity-60"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Detail modal */}
        {detailOpen && selectedDraft && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white/95 p-5 md:p-6 shadow-2xl border border-purple/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-dark">
                    {selectedDraft.title || "Draft details"}
                  </h2>
                  <p className="text-xs md:text-sm text-dark/60">
                    {selectedDraft.draft_type === "media"
                      ? "Media draft – view image and regenerate caption."
                      : "Idea draft – tweak the content and save it."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDetail}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-purple/5 text-dark/70 hover:bg-purple/10"
                >
                  ✕
                </button>
              </div>

              {/* BODY */}
              <div className="space-y-4 text-xs md:text-sm text-dark/80">
                {/* common: pinned + created */}
                <div className="flex flex-wrap items-center gap-2 text-[0.75rem]">
                  {selectedDraft.pinned && (
                    <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
                      Pinned
                    </span>
                  )}
                  <span className="rounded-full bg-purple/5 text-purple px-2 py-0.5">
                    {selectedDraft.draft_type === "media"
                      ? "Media draft"
                      : "Idea draft"}
                  </span>
                  {selectedDraft.created_at && (
                    <span className="text-dark/60">
                      Saved{" "}
                      {new Date(selectedDraft.created_at).toLocaleString(
                        undefined,
                        { dateStyle: "medium", timeStyle: "short" }
                      )}
                    </span>
                  )}
                </div>

                {/* MEDIA DRAFT VIEW */}
                {selectedDraft.draft_type === "media" && (
                  <div className="space-y-3">
                    {selectedDraft.media_url && (
                      <img
                        src={selectedDraft.media_url}
                        alt=""
                        className="w-full max-h-64 object-cover rounded-2xl border border-purple/10"
                      />
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-dark">
                          Caption
                        </h3>
                        <button
                          type="button"
                          onClick={handleRegenerateCaption}
                          disabled={regeneratingCaption}
                          className="text-[0.75rem] rounded-full bg-purple/10 px-3 py-1 font-semibold text-purple hover:bg-purple/20 disabled:opacity-60"
                        >
                          {regeneratingCaption
                            ? "Regenerating..."
                            : "Regenerate"}
                        </button>
                      </div>
                      <textarea
                        value={modalCaption}
                        onChange={(e) => setModalCaption(e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                        placeholder="Caption will appear here after generating."
                      />
                      {captionObj && (
                        <p className="text-[0.7rem] text-dark/60">
                          New caption generated at{" "}
                          {captionObj.created_at &&
                            new Date(
                              captionObj.created_at
                            ).toLocaleString()}{" "}
                          (not yet linked to this draft on the backend).
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* IDEA DRAFT VIEW */}
                {selectedDraft.draft_type === "idea" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[0.75rem] font-semibold text-dark mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                        placeholder="Idea title"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.75rem] font-semibold text-dark mb-1">
                        Description
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                        placeholder="Describe the content idea"
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label className="block text-[0.75rem] font-semibold text-dark mb-1">
                          Hook used
                        </label>
                        <input
                          type="text"
                          value={editHook}
                          onChange={(e) => setEditHook(e.target.value)}
                          className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                          placeholder="Hook or angle used"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.75rem] font-semibold text-dark mb-1">
                          Caption starter
                        </label>
                        <input
                          type="text"
                          value={editCaptionStarter}
                          onChange={(e) =>
                            setEditCaptionStarter(e.target.value)
                          }
                          className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                          placeholder="Suggested opening line"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[0.75rem] font-semibold text-dark mb-1">
                        Personal twist
                      </label>
                      <textarea
                        value={editTwist}
                        onChange={(e) => setEditTwist(e.target.value)}
                        rows={2}
                        className="w-full rounded-2xl border border-purple/15 bg-purple/5 px-3 py-2 text-xs md:text-sm text-dark/80"
                        placeholder="How you want to personalize this idea"
                      />
                    </div>
                  </div>
                )}

                {/* Footer actions */}
                <div className="pt-3 border-t border-purple/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => togglePin(selectedDraft)}
                      disabled={actionLoadingId === selectedDraft.id}
                      className="rounded-2xl bg-purple/10 px-3 py-1.5 text-[0.75rem] font-semibold text-purple hover:bg-purple/20 disabled:opacity-60"
                    >
                      {selectedDraft.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      type="button"
                      onClick={() => archiveDraft(selectedDraft)}
                      disabled={actionLoadingId === selectedDraft.id}
                      className="rounded-2xl bg-red-50 px-3 py-1.5 text-[0.75rem] font-semibold text-red-600 hover:bg-red-100 disabled:opacity-60"
                    >
                      Archive
                    </button>
                  </div>

                  {selectedDraft.draft_type === "idea" && (
                    <button
                      type="button"
                      onClick={handleSaveIdeaChanges}
                      disabled={savingIdeaChanges}
                      className="rounded-2xl bg-purple px-4 py-1.5 text-[0.75rem] font-semibold text-white hover:bg-purple/90 disabled:opacity-60"
                    >
                      {savingIdeaChanges ? "Saving..." : "Save changes"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
