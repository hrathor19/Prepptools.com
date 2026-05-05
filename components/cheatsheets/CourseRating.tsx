"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

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

  async function handleRate(star: number) {
    setSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSubmitting(false); return; }

    const res = await fetch(`/api/courses/${slug}/rate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: star }),
    });

    if (res.ok) {
      setCurrentRating(star);
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

      <div className="flex items-center gap-2">
        {done ? (
          <>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= (currentRating ?? 0) ? "text-yellow-400" : "text-gray-200"}`}
                  fill="currentColor"
                />
              ))}
            </div>
            <button
              onClick={() => setDone(false)}
              className="text-xs text-gray-400 hover:text-gray-600 underline-offset-2 hover:underline"
            >
              Change
            </button>
          </>
        ) : (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                disabled={submitting}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => handleRate(star)}
                className="p-0.5 transition-transform hover:scale-110 disabled:opacity-50 cursor-pointer"
                aria-label={`Rate ${star} out of 5`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= hover ? "text-yellow-400" : "text-gray-200"
                  }`}
                  fill="currentColor"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {done && (
        <p className="text-xs text-gray-400 mt-1.5">Thanks for your feedback!</p>
      )}
    </div>
  );
}
