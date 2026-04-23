"use client";

import { useState } from "react";

const conversions = [
  { label: "× 9.5 (Anna University / most Indian universities)", multiplier: 9.5 },
  { label: "× 10 (10-point scale)",                              multiplier: 10  },
  { label: "× 9 (some universities)",                            multiplier: 9   },
  { label: "× 7.5 (some universities)",                          multiplier: 7.5 },
];

function getRemark(pct: number) {
  if (pct >= 75) return { label: "Distinction", color: "text-green-600 dark:text-green-400" };
  if (pct >= 60) return { label: "First Class",  color: "text-blue-600 dark:text-blue-400"  };
  if (pct >= 50) return { label: "Second Class", color: "text-amber-600 dark:text-amber-400" };
  return           { label: "Pass",              color: "text-gray-500 dark:text-gray-400"  };
}

export default function CGPACalculator() {
  const [cgpa, setCgpa]       = useState("");
  const [scale, setScale]     = useState(10);
  const [multiplier, setMultiplier] = useState(9.5);
  const [result, setResult]   = useState<number | null>(null);

  function calculate() {
    const val = parseFloat(cgpa);
    if (isNaN(val) || val < 0 || val > scale) return;
    setResult(parseFloat((val * multiplier).toFixed(2)));
  }

  const remark = result !== null ? getRemark(result) : null;

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your CGPA</label>
          <input
            type="number" step="0.01" min="0" max={scale}
            value={cgpa} onChange={(e) => { setCgpa(e.target.value); setResult(null); }}
            placeholder={`e.g. 8.4 (max ${scale})`}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">CGPA Scale</label>
          <select
            value={scale} onChange={(e) => { setScale(Number(e.target.value)); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={10}>10-point scale</option>
            <option value={4}>4-point scale (US)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Conversion Formula</label>
        <select
          value={multiplier} onChange={(e) => { setMultiplier(Number(e.target.value)); setResult(null); }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {conversions.map((c) => (
            <option key={c.multiplier} value={c.multiplier}>{c.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={calculate}
        disabled={!cgpa.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Convert to Percentage
      </button>

      {result !== null && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-2">Your Percentage</p>
          <p className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">{result}%</p>
          {remark && <p className={`text-sm font-semibold mt-2 ${remark.color}`}>{remark.label}</p>}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Formula: {cgpa} × {multiplier} = {result}%
          </p>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">Common conversion formulas</p>
        <div className="space-y-1">
          {conversions.map((c) => (
            <p key={c.multiplier} className="text-xs text-gray-500 dark:text-gray-400">• {c.label}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
