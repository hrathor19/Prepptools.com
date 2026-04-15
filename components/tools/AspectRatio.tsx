"use client";
import { useState } from "react";

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }
const KNOWN: Record<string, string> = { "16:9":"Widescreen (HD/4K)", "4:3":"Standard (TV/iPad)", "1:1":"Square", "3:2":"DSLR Photo", "21:9":"Ultrawide", "9:16":"Vertical / Stories", "2:1":"Panorama", "5:4":"Large Format" };

export default function AspectRatio() {
  const [tab, setTab] = useState<"find"|"scale">("find");
  const [w, setW] = useState("1920"); const [h, setH] = useState("1080");
  const [newW, setNewW] = useState(""); const [newH, setNewH] = useState("");

  const wn = parseFloat(w)||0; const hn = parseFloat(h)||0;
  const d = wn && hn ? gcd(Math.round(wn), Math.round(hn)) : 0;
  const ratioW = d ? Math.round(wn)/d : 0; const ratioH = d ? Math.round(hn)/d : 0;
  const ratioStr = d ? `${ratioW}:${ratioH}` : "—";
  const known = KNOWN[ratioStr] || "";

  const scaledH = newW && wn && hn ? ((parseFloat(newW) * hn) / wn).toFixed(0) : "";
  const scaledW = newH && wn && hn ? ((parseFloat(newH) * wn) / hn).toFixed(0) : "";

  const inp = "border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-full";

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["find","scale"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${tab===t?"bg-slate-700 text-white border-slate-700":"bg-white text-gray-600 border-gray-200 hover:border-slate-400"}`}>
            {t === "find" ? "Find Ratio" : "Scale Dimensions"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Width (px)</label><input value={w} onChange={e=>setW(e.target.value)} className={inp} type="number" min="1" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Height (px)</label><input value={h} onChange={e=>setH(e.target.value)} className={inp} type="number" min="1" /></div>
      </div>

      {tab === "find" && d > 0 && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-4xl font-bold text-slate-800">{ratioStr}</p>
            {known && <p className="text-sm text-slate-500 mt-1">{known}</p>}
          </div>
          <div className="flex justify-center">
            <div className="border-2 border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-xs text-slate-400 font-medium"
              style={{ width: Math.min(240, 240), height: Math.min(240, Math.round(240 * hn / wn)) }}>
              {w} × {h}
            </div>
          </div>
        </div>
      )}

      {tab === "scale" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Width → Height</label>
              <input value={newW} onChange={e=>{setNewW(e.target.value);setNewH("");}} className={inp} type="number" min="1" placeholder="Enter new width" />
              {scaledH && <p className="text-sm mt-2 text-slate-700 font-semibold">Height: <span className="text-slate-900">{scaledH} px</span></p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Height → Width</label>
              <input value={newH} onChange={e=>{setNewH(e.target.value);setNewW("");}} className={inp} type="number" min="1" placeholder="Enter new height" />
              {scaledW && <p className="text-sm mt-2 text-slate-700 font-semibold">Width: <span className="text-slate-900">{scaledW} px</span></p>}
            </div>
          </div>
          {ratioStr !== "—" && <p className="text-xs text-gray-400">Maintaining {ratioStr} ratio from {w}×{h}</p>}
        </div>
      )}
    </div>
  );
}
