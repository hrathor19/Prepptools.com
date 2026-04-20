"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function FeedbackWidget({ slug }: { slug: string }) {
  const key = `feedback_${slug}`;
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setVote(stored as "up" | "down");
        setSubmitted(true);
      }
    } catch {}
  }, [key]);

  function handleVote(v: "up" | "down") {
    if (submitted) return;
    setVote(v);
    setSubmitted(true);
    try {
      localStorage.setItem(key, v);
    } catch {}
  }

  return (
    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 mt-6">
      {submitted ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {vote === "up" ? "🎉 Thanks for the feedback!" : "Thanks — we'll keep improving this tool."}
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Was this tool helpful?
          </p>
          <button
            onClick={() => handleVote("up")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-green-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
          >
            <ThumbsUp className="w-4 h-4" /> Yes
          </button>
          <button
            onClick={() => handleVote("down")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <ThumbsDown className="w-4 h-4" /> Could be better
          </button>
        </>
      )}
    </div>
  );
}
