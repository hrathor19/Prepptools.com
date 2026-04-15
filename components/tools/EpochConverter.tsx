"use client";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

function relativeTime(d: Date) {
  const diff = Date.now() - d.getTime();
  const abs = Math.abs(diff);
  const future = diff < 0;
  if (abs < 60000) return "just now";
  const mins = Math.floor(abs / 60000);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
}

export default function EpochConverter() {
  const [ts, setTs] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  function copy(val: string, key: string) {
    navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(() => setCopied(null), 2000);
  }

  // Timestamp → Date
  const tsDate = (() => {
    if (!ts) return null;
    const n = parseInt(ts);
    if (isNaN(n)) return null;
    // auto-detect ms vs s
    const d = new Date(n > 1e12 ? n : n * 1000);
    return isNaN(d.getTime()) ? null : d;
  })();

  // Date → Timestamp
  const dateTs = (() => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? null : { s: Math.floor(d.getTime() / 1000), ms: d.getTime() };
  })();

  const inp = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-400";

  return (
    <div className="space-y-6">
      {/* Live clock */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Current Unix Timestamp</p>
          <p className="text-xl font-bold font-mono text-slate-800">{Math.floor(now / 1000)}</p>
        </div>
        <button onClick={() => copy(String(Math.floor(now / 1000)), "live")} className="text-slate-400 hover:text-slate-700">
          {copied === "live" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Timestamp → Date */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Timestamp → Human Date</p>
        <input value={ts} onChange={e => setTs(e.target.value)} className={inp} placeholder="e.g. 1700000000 or 1700000000000" />
        {tsDate && (
          <div className="space-y-2">
            {[
              { label: "UTC", value: tsDate.toUTCString() },
              { label: "Local", value: tsDate.toLocaleString() },
              { label: "ISO 8601", value: tsDate.toISOString() },
              { label: "Relative", value: relativeTime(tsDate) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                <div><span className="text-xs text-gray-400 font-medium mr-2">{label}</span><span className="text-sm text-gray-800 font-mono">{value}</span></div>
                <button onClick={() => copy(value, label)} className="text-gray-400 hover:text-slate-700 shrink-0 ml-2">
                  {copied === label ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
        {ts && !tsDate && <p className="text-xs text-red-500">Invalid timestamp</p>}
      </div>

      {/* Date → Timestamp */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Date → Timestamp</p>
        <input type="datetime-local" value={dateInput} onChange={e => setDateInput(e.target.value)} className={inp} />
        {dateTs && (
          <div className="space-y-2">
            {[
              { label: "Seconds", value: String(dateTs.s) },
              { label: "Milliseconds", value: String(dateTs.ms) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                <div><span className="text-xs text-gray-400 font-medium mr-2">{label}</span><span className="text-sm text-gray-800 font-mono">{value}</span></div>
                <button onClick={() => copy(value, label + "2")} className="text-gray-400 hover:text-slate-700 shrink-0 ml-2">
                  {copied === label + "2" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
