"use client";
import { useState } from "react";

const LIMITS = [
  { platform: "Twitter / X", limit: 280 },
  { platform: "LinkedIn Post", limit: 3000 },
  { platform: "Instagram Caption", limit: 2200 },
  { platform: "SMS", limit: 160 },
  { platform: "Meta Title", limit: 60 },
  { platform: "Meta Description", limit: 160 },
  { platform: "WhatsApp", limit: 65536 },
];

export default function CharacterLimit() {
  const [text, setText] = useState("");
  const len = text.length;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">Your text</label>
          <span className="text-sm font-bold text-gray-900">{len} chars</span>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
          placeholder="Start typing or paste text here…"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
      </div>

      <div className="space-y-3">
        {LIMITS.map(({ platform, limit }) => {
          const pct = Math.min((len / limit) * 100, 100);
          const over = len > limit;
          const color = over ? "red" : pct > 80 ? "amber" : "emerald";
          return (
            <div key={platform} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{platform}</span>
                <span className={`font-semibold ${over ? "text-red-600" : pct > 80 ? "text-amber-600" : "text-emerald-600"}`}>
                  {len} / {limit.toLocaleString()}
                  {over && <span className="ml-1.5 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">Over by {len - limit}</span>}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all bg-${color}-500`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
