"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({
  slug,
  initialLikes = 0,
}: {
  slug: string;
  initialLikes?: number;
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`liked_${slug}`) === "1");
  }, [slug]);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    const newLiked = !liked;
    // Optimistic update
    setLiked(newLiked);
    setCount((c) => (newLiked ? c + 1 : Math.max(c - 1, 0)));
    localStorage.setItem(`liked_${slug}`, newLiked ? "1" : "0");

    try {
      const res = await fetch(`/api/blog/${slug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: newLiked ? "like" : "unlike" }),
      });
      const data = await res.json();
      if (res.ok) {
        setCount(data.likes);
      }
    } catch {
      // Revert on network error
      setLiked(!newLiked);
      setCount((c) => (!newLiked ? c + 1 : Math.max(c - 1, 0)));
      localStorage.setItem(`liked_${slug}`, newLiked ? "0" : "1");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all disabled:opacity-70 ${
        liked
          ? "bg-red-50 border-red-300 text-red-600"
          : "bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500"
      }`}
    >
      <Heart
        className={`w-4 h-4 transition-transform ${animating ? "scale-125" : ""} ${liked ? "fill-red-500 text-red-500" : ""}`}
        strokeWidth={liked ? 0 : 2}
      />
      <span>{count}</span>
      <span>{liked ? "Liked" : "Like"}</span>
    </button>
  );
}
