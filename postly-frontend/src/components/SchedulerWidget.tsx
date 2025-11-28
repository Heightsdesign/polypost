// src/components/SchedulerWidget.tsx
import React, { useMemo, useState } from "react";
import api from "../api";

export type Reminder = {
  id: string;
  scheduled_at: string; // ISO string
  platform?: string;
  note?: string;
  notify_email?: boolean;
  draft_id?: string | number | null;
};

export type DraftSummary = {
  id: string | number;
  title?: string;
  draft_type?: string;
};

interface SchedulerWidgetProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  drafts: DraftSummary[];
}

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}


function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: Date[] = [];
  for (
    let d = first;
    d <= last;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  ) {
    days.push(d);
  }
  return days;
}

const SchedulerWidget: React.FC<SchedulerWidgetProps> = ({
  reminders,
  setReminders,
  drafts,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

  // reminder form
  const [formTime, setFormTime] = useState("12:00");
  const [formPlatform, setFormPlatform] = useState("instagram");
  const [formDraftId, setFormDraftId] = useState<string | number | "">("");
  const [formNote, setFormNote] = useState("");
  const [formNotifyEmail, setFormNotifyEmail] = useState(true);
  const [savingReminder, setSavingReminder] = useState(false);

  // posting suggestions
  const [suggestPlatform, setSuggestPlatform] = useState("instagram");
  const [suggestions, setSuggestions] = useState<
    { datetime: string; platform: string; reason?: string }[]
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const remindersByDay = useMemo(() => {
    const map: Record<string, Reminder[]> = {};
    for (const r of reminders) {
      const d = new Date(r.scheduled_at);
      const key = toDateString(d);
      if (!map[key]) map[key] = [];
      map[key].push(r);
    }
    return map;
  }, [reminders]);

  const daysInMonth = useMemo(
    () => getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  );

  function handleDayClick(day: Date) {
    setSelectedDate(day);
    setFormTime("12:00");
    setFormPlatform("instagram");
    setFormDraftId("");
    setFormNote("");
    setFormNotifyEmail(true);
    setShowReminderModal(true);
  }

  async function handleSaveReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate) return;

    setSavingReminder(true);
    try {
      const [hours, minutes] = formTime.split(":").map(Number);
      const dt = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours || 0,
        minutes || 0,
        0,
        0
      );

      const payload: any = {
        scheduled_at: dt.toISOString(),
        platform: formPlatform,
        note: formNote,
        notify_email: formNotifyEmail,
      };
      if (formDraftId) payload.draft_id = formDraftId;

      const res = await api.post("/schedule/reminders/", payload);
      setReminders((prev) => [...prev, res.data]);
      setShowReminderModal(false);
    } catch (err) {
      console.error("Error saving reminder", err);
      alert("Could not save reminder. Please try again.");
    } finally {
      setSavingReminder(false);
    }
  }

  async function handleGenerateSuggestions(e: React.FormEvent) {
    e.preventDefault();
    setLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const res = await api.get("/posting-suggestions/", {
        params: { platform: suggestPlatform },
      });
      setSuggestions(res.data?.suggestions || []);
    } catch (err) {
      console.error("Error loading suggestions", err);
      alert("Could not load posting suggestions.");
    } finally {
      setLoadingSuggestions(false);
    }
  }

  function handleUseSuggestion(s: { datetime: string; platform: string }) {
    const dt = new Date(s.datetime);
    setSelectedDate(dt);
    setFormPlatform(s.platform || suggestPlatform);
    const hh = String(dt.getHours()).padStart(2, "0");
    const mm = String(dt.getMinutes()).padStart(2, "0");
    setFormTime(`${hh}:${mm}`);
    setShowSuggestionsModal(false);
    setShowReminderModal(true);
  }

  const monthLabel = currentMonth.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function goPrevMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }
  function goNextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  const firstWeekday =
    (new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay() || 7) - 1;

  return (
    <section
      id="dashboard-scheduler"
      className="rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-md p-4 md:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm md:text-base font-semibold text-dark">
            Scheduler
          </h2>
          <p className="text-[11px] text-dark/60">
            Click a day to add a reminder, or generate best times.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrevMonth}
            className="px-2 py-1 rounded-lg border border-purple/20 text-xs text-purple hover:bg-purple/5"
          >
            ←
          </button>
          <span className="text-xs font-semibold text-dark">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={goNextMonth}
            className="px-2 py-1 rounded-lg border border-purple/20 text-xs text-purple hover:bg-purple/5"
          >
            →
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-[10px] text-dark/60 mb-1">
        {weekdayLabels.map((w) => (
          <div key={w} className="text-center py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 bg-white/80 rounded-2xl p-2 border border-purple/10 shadow-sm">
        {Array.from({ length: firstWeekday }).map((_, idx) => (
          <div key={`blank-${idx}`} />
        ))}

        {daysInMonth.map((day) => {
          const key = toDateString(day);
          const rForDay = remindersByDay[key] || [];
          const hasReminders = rForDay.length > 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`aspect-square rounded-xl border text-[11px] flex flex-col items-center justify-center gap-1 transition-all ${
                hasReminders
                  ? "border-purple bg-purple/5"
                  : "border-purple/10 bg-white"
              } hover:border-purple/60 hover:bg-purple/5`}
            >
              <span className="text-xs font-semibold text-dark">
                {day.getDate()}
              </span>
              {hasReminders && (
                <span className="inline-flex items-center justify-center rounded-full bg-purple text-[9px] px-2 py-[1px] text-white">
                  {rForDay.length}x
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Generate suggestions button */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowSuggestionsModal(true)}
          className="rounded-2xl bg-gradient-to-r from-purple to-pink text-white text-xs font-semibold px-3 py-1.5 shadow-md shadow-purple/30 hover:shadow-purple/40"
        >
          Generate recommended posting times
        </button>
      </div>

      {/* Reminder modal */}
      {showReminderModal && selectedDate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl border border-purple/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-dark">
                New reminder for{" "}
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </h2>
              <button
                type="button"
                onClick={() => setShowReminderModal(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-purple/5 text-dark/70 hover:bg-purple/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-dark/70 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full border border-purple/20 rounded-xl px-3 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark/70 mb-1">
                  Platform
                </label>
                <select
                  value={formPlatform}
                  onChange={(e) => setFormPlatform(e.target.value)}
                  className="w-full border border-purple/20 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="onlyfans">OnlyFans</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark/70 mb-1">
                  Attach a draft (optional)
                </label>
                <select
                  value={formDraftId}
                  onChange={(e) => setFormDraftId(e.target.value)}
                  className="w-full border border-purple/20 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="">No draft</option>
                  {drafts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title || (d.draft_type === "media" ? "Media draft" : "Idea draft")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark/70 mb-1">
                  Note (optional)
                </label>
                <textarea
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  rows={3}
                  className="w-full border border-purple/20 rounded-xl px-3 py-2 text-sm"
                  placeholder="e.g. Post this Reel teaser for Friday"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-dark/75">
                <input
                  type="checkbox"
                  checked={formNotifyEmail}
                  onChange={(e) => setFormNotifyEmail(e.target.checked)}
                  className="h-4 w-4 rounded border-purple/40"
                />
                <span>Send me an email reminder.</span>
              </label>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReminderModal(false)}
                  className="flex-1 rounded-2xl border border-purple/20 bg-white px-3 py-2 text-sm font-semibold text-purple"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReminder}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-purple to-pink text-white px-3 py-2 text-sm font-semibold shadow-md shadow-purple/30 disabled:opacity-60"
                >
                  {savingReminder ? "Saving…" : "Save reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suggestions modal */}
      {showSuggestionsModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl border border-purple/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-dark">
                Recommended posting times
              </h2>
              <button
                type="button"
                onClick={() => setShowSuggestionsModal(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-purple/5 text-dark/70 hover:bg-purple/10"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleGenerateSuggestions}
              className="space-y-3 text-sm mb-3"
            >
              <div>
                <label className="block text-xs font-semibold text-dark/70 mb-1">
                  Platform
                </label>
                <select
                  value={suggestPlatform}
                  onChange={(e) => setSuggestPlatform(e.target.value)}
                  className="w-full border border-purple/20 rounded-xl px-3 py-2 text-sm"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="onlyfans">OnlyFans</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loadingSuggestions}
                className="w-full rounded-2xl bg-gradient-to-r from-purple to-pink text-white px-3 py-2 text-sm font-semibold shadow-md shadow-purple/30"
              >
                {loadingSuggestions ? "Generating…" : "Generate times"}
              </button>
            </form>

            {suggestions.length > 0 && (
              <div className="max-h-64 overflow-y-auto text-sm">
                <p className="text-xs text-dark/60 mb-2">
                  Click a time to turn it into a reminder:
                </p>
                <ul className="space-y-2">
                  {suggestions.map((s) => {
                    const dt = new Date(s.datetime);
                    const label = dt.toLocaleString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <li key={s.datetime}>
                        <button
                          type="button"
                          onClick={() => handleUseSuggestion(s)}
                          className="w-full text-left rounded-xl border border-purple/15 px-3 py-2 hover:border-purple/50 hover:bg-purple/5"
                        >
                          <span className="font-semibold text-dark">
                            {label}
                          </span>
                          {s.reason && (
                            <span className="block text-[11px] text-dark/60">
                              {s.reason}
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {loadingSuggestions && (
              <p className="text-xs text-dark/60">Loading suggestions…</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SchedulerWidget;
