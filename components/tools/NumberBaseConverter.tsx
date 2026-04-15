"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

const BASES = [
  { label: "Binary", base: 2, prefix: "0b", chars: /^[01]*$/ },
  { label: "Octal", base: 8, prefix: "0o", chars: /^[0-7]*$/ },
  { label: "Decimal", base: 10, prefix: "", chars: /^[0-9]*$/ },
  { label: "Hexadecimal", base: 16, prefix: "0x", chars: /^[0-9a-fA-F]*$/ },
];

export default function NumberBaseConverter() {
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [copied, setCopied] = useState<number | null>(null);

  const decimal = (() => {
    try { const n = parseInt(input || "0", fromBase); return isNaN(n) ? null : n; } catch { return null; }
  })();

  function copy(val: string, base: number) {
    navigator.clipboard.writeText(val);
    setCopied(base); setTimeout(() => setCopied(null), 2000);
  }

  const binary = decimal !== null ? decimal.toString(2) : "—";
  const bits = binary !== "—" ? binary.padStart(8, "0") : null;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {BASES.map(b => (
          <button key={b.base} onClick={() => setFromBase(b.base)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${fromBase === b.base ? "bg-slate-700 text-white border-slate-700" : "bg-white text-gray-600 border-gray-200 hover:border-slate-400"}`}>
            {b.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Enter {BASES.find(b => b.base === fromBase)?.label} number
        </label>
        <input value={input} onChange={e => {
          const b = BASES.find(x => x.base === fromBase)!;
          if (b.chars.test(e.target.value)) setInput(e.target.value);
        }}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-400"
          placeholder="Enter value…" />
        {input && decimal === null && <p className="text-xs text-red-500 mt-1">Invalid value for this base</p>}
      </div>

      {decimal !== null && (
        <div className="space-y-2">
          {BASES.map(b => {
            const val = decimal.toString(b.base).toUpperCase();
            return (
              <div key={b.base} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${fromBase === b.base ? "bg-slate-50 border-slate-300" : "bg-white border-gray-200"}`}>
                <div>
                  <span className="text-xs font-medium text-gray-400 mr-2">{b.label}</span>
                  <span className="font-mono font-semibold text-gray-900">{b.prefix}{val}</span>
                </div>
                <button onClick={() => copy(val, b.base)} className="text-gray-400 hover:text-slate-700 transition-colors">
                  {copied === b.base ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {bits && decimal !== null && decimal >= 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-2">8-bit binary representation</p>
          <div className="flex gap-1 flex-wrap">
            {bits.split("").map((bit, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={`w-8 h-8 rounded-lg text-sm font-bold font-mono flex items-center justify-center ${bit === "1" ? "bg-slate-700 text-white" : "bg-gray-200 text-gray-400"}`}>{bit}</span>
                <span className="text-xs text-gray-400 mt-0.5">{7 - i}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
