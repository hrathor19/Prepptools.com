"use client";

import { useState } from "react";
import { Share2, Link, Check } from "lucide-react";

export default function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`;

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled
      }
      return;
    }
    setOpen((v) => !v);
  }

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setOpen(false), 2200);
  }

  function twitterShare() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={nativeShare}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 text-sm font-medium bg-white transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden w-48">
          <button onClick={copyLink}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link className="w-4 h-4 text-gray-400" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button onClick={twitterShare}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100">
            <span className="text-sky-500 font-bold text-xs w-4 h-4 flex items-center justify-center">𝕏</span>
            Share on X
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-0" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
