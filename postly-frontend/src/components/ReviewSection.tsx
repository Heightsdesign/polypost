// src/components/ReviewsSection.tsx
import React, { useEffect, useState } from "react";
import { fetchReviews, submitReview } from "../api";
import type { ReviewPayload } from "../api";
type Review = {
  id: number;
  username: string | null;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
};

type ReviewsResponse = {
  stats: {
    average_rating: number;
    total_reviews: number;
  };
  results: Review[];
};

const ReviewsSection: React.FC = () => {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchReviews();
        setData(res.data as ReviewsResponse);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const avg = data?.stats.average_rating ?? 0;
  const total = data?.stats.total_reviews ?? 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload: ReviewPayload = { rating, comment, title: title || undefined };
      await submitReview(payload);

      setSuccess("Thanks for your feedback! 💜");
      setTitle("");
      setComment("");
      setRating(5);

      // reload list
      const res = await fetchReviews();
      setData(res.data as ReviewsResponse);
    } catch (err) {
      console.error(err);
      setError("Could not send your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10 bg-white/95 backdrop-blur rounded-3xl shadow-xl border border-purple/10 px-5 py-6 md:px-7 md:py-7">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-base md:text-lg font-semibold text-dark mb-1">
            What creators say
          </h2>
          <p className="text-xs md:text-sm text-dark/60">
            Help us improve Postly and see what others think.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-yellow-400 text-lg">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.round(avg) ? "★" : "☆"}</span>
            ))}
          </div>
          <div className="text-xs md:text-sm text-dark/70">
            <span className="font-semibold">{avg.toFixed(1)}</span> / 5 ·{" "}
            <span>{total} review{total === 1 ? "" : "s"}</span>
          </div>
        </div>
      </div>

      {/* list of a few latest reviews */}
      <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
        {loading && <p className="text-xs text-dark/50">Loading reviews…</p>}
        {!loading && data?.results.length === 0 && (
          <p className="text-xs text-dark/50">
            No reviews yet. Be the first to share your feedback!
          </p>
        )}
        {data?.results.slice(0, 5).map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-purple/10 bg-purple/3 px-3 py-2.5 text-xs md:text-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[0.7rem] rounded-full bg-purple/10 text-purple px-2 py-[2px]">
                  {r.username || "anonymous"}
                </span>
                <span className="text-yellow-400 text-sm">
                  {"★".repeat(r.rating)}
                </span>
              </div>
              <span className="text-[0.7rem] text-dark/45">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
            {r.title && (
              <p className="font-semibold text-dark text-xs md:text-sm">
                {r.title}
              </p>
            )}
            <p className="text-[0.78rem] md:text-xs text-dark/75">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* review form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-purple/10 pt-4 mt-2 space-y-3 text-xs md:text-sm"
      >
        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900">
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-red-900">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-dark/70">Your rating:</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-xl border border-purple/20 bg-white/90 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-purple/40"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional title (e.g. 'Super useful for IG')"
            className="flex-1 min-w-[180px] rounded-2xl border border-purple/20 bg-white/90 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple/40"
          />
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share how Postly helps (or what we could improve)…"
          rows={3}
          className="w-full rounded-2xl border border-purple/20 bg-white/90 px-3 py-2 text-xs md:text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple/40"
        />

        <button
          type="submit"
          disabled={submitting || !comment.trim()}
          className="inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs md:text-sm font-semibold text-white bg-gradient-to-r from-purple to-pink shadow-md shadow-purple/30 hover:shadow-purple/40 hover:translate-y-[-1px] active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : "Submit review"}
        </button>
      </form>
    </section>
  );
};

export default ReviewsSection;
