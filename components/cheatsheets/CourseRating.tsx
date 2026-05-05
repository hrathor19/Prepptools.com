"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import StarRating from "./StarRating";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CourseRating({ slug }: { slug: string }) {
  const [canRate, setCanRate] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const starsRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(0);

  useEffect(() => {
    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const res = await fetch(`/api/courses/${slug}/rate`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) { setLoading(false); return; }

      const data = await res.json();
      setCanRate(data.canRate);
      setCurrentRating(data.currentRating);
      if (data.currentRating) setDone(true);
      setLoading(false);
    }
    check();
  }, [slug]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!starsRef.current) return;
    const rect = starsRef.current.getBoundingClientRect();
    const x = Math.max(0, e.clientX - rect.left);
    const raw = (x / rect.width) * 5;
    const val = Math.max(0.1, Math.min(5, Math.round(raw * 10) / 10));
    hoverRef.current = val;
    setHover(val);
  }

  async function handleRate(rating: number) {
    setSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSubmitting(false); return; }

    const res = await fetch(`/api/courses/${slug}/rate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating }),
    });

    if (res.ok) {
      setCurrentRating(rating);
      setDone(true);
    }
    setSubmitting(false);
  }

  if (loading || !canRate) return null;

  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">
        {done ? "Your rating" : "Rate this course"}
      </p>

      {done ? (
        <div className="flex items-center gap-2.5">
          <StarRating rating={currentRating!} size="lg" />
          <span className="text-sm font-semibold text-gray-700">{currentRating!.toFixed(1)}</span>
          <button
            onClick={() => setDone(false)}
            className="text-xs text-gray-400 hover:text-gray-600 underline-offset-2 hover:underline ml-1"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Interactive star area */}
          <div className="flex items-center gap-3">
            <div
              ref={starsRef}
              className={`inline-flex cursor-pointer select-none ${submitting ? "opacity-50 pointer-events-none" : ""}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { setHover(0); hoverRef.current = 0; }}
              onClick={() => hoverRef.current > 0 && handleRate(hoverRef.current)}
            >
              <StarRating rating={hover} size="lg" />
            </div>

            {hover > 0 && (
              <span className="text-sm font-bold text-yellow-500 w-8 tabular-nums">
                {hover.toFixed(1)}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Hover over the stars to set your rating, then click to submit.
          </p>
        </div>
      )}

      {done && (
        <p className="text-xs text-gray-400 mt-1.5">Thanks for your feedback!</p>
      )}
    </div>
  );
}
