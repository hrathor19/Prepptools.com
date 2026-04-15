"use client";
import { useState } from "react";

const SPEEDS = [
  { label: "Slow", wpm: 150 },
  { label: "Average", wpm: 200 },
  { label: "Fast", wpm: 300 },
];

function fmtTime(mins: number) {
  const m = Math.floor(mins);
  const s = Math.round((mins - m) * 60);
  if (m === 0) return `${s} sec`;
  if (s === 0) return `${m} min`;
  return `${m} min ${s} sec`;
}

function syllableCount(word: string) {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  const count = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "").match(/[aeiouy]{1,2}/g);
  return Math.max(1, count ? count.length : 1);
}

export default function ReadingTime() {
  const [text, setText] = useState("");
  const [speedIdx, setSpeedIdx] = useState(1);

  const words = text.trim() ? text.trim().split(/\s+/) : [];
  const wordCount = words.length;
  const charCount = text.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);
  const avgWordLen = wordCount > 0 ? (words.join("").length / wordCount).toFixed(1) : "0";
  const wpm = SPEEDS[speedIdx].wpm;
  const readMins = wordCount / wpm;
  const speakMins = wordCount / 130;

  return (
    <div className="space-y-5">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
        placeholder="Paste your text here to estimate reading time…"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Reading speed:</span>
        {SPEEDS.map((s, i) => (
          <button key={s.label} onClick={() => setSpeedIdx(i)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${speedIdx === i ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}>
            {s.label} ({s.wpm} wpm)
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Reading Time", value: wordCount ? fmtTime(readMins) : "—", color: "emerald" },
          { label: "Speaking Time", value: wordCount ? fmtTime(speakMins) : "—", color: "blue" },
          { label: "Words", value: wordCount.toLocaleString(), color: "violet" },
          { label: "Characters", value: charCount.toLocaleString(), color: "amber" },
          { label: "Sentences", value: sentences.toLocaleString(), color: "rose" },
          { label: "Paragraphs", value: paragraphs.toLocaleString(), color: "teal" },
          { label: "Avg Word Length", value: `${avgWordLen} chars`, color: "orange" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-200 rounded-xl p-3 text-center`}>
            <p className={`text-xs text-${color}-500 font-medium mb-1`}>{label}</p>
            <p className={`text-base font-bold text-${color}-800`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
