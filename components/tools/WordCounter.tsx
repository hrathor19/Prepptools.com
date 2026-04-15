"use client";

import { useState, useMemo } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.trim()
      ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length
      : 0;
    const paragraphs = text.trim()
      ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length
      : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  return (
    <div className="space-y-6">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text here…"
        rows={12}
        className="w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y leading-relaxed"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Words", value: stats.words },
          { label: "Characters", value: stats.chars },
          { label: "Chars (no spaces)", value: stats.charsNoSpaces },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Reading Time", value: `~${stats.readingTime} min` },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-blue-700">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {text && (
        <button
          onClick={() => setText("")}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear text
        </button>
      )}
    </div>
  );
}
