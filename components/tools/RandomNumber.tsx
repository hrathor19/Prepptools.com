"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type HistoryEntry = { min: number; max: number; count: number; results: number[] };

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [noDuplicates, setNoDuplicates] = useState(false);
  const [sort, setSort] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function generate() {
    setError("");
    if (min >= max) { setError("Min must be less than Max."); return; }
    if (noDuplicates && count > (max - min + 1)) {
      setError(`Cannot generate ${count} unique numbers in range ${min}–${max}.`);
      return;
    }
    const pool = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    let nums: number[];
    if (noDuplicates) {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      nums = shuffled.slice(0, count);
    } else {
      nums = Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
    }
    if (sort) nums.sort((a, b) => a - b);
    setResults(nums);
    setHistory((prev) => [{ min, max, count, results: nums }, ...prev].slice(0, 3));
  }

  function copyAll() {
    navigator.clipboard.writeText(results.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Min", value: min, set: setMin },
          { label: "Max", value: max, set: setMax },
          { label: "Count", value: count, set: setCount, min: 1, max: 100 },
        ].map(({ label, value, set, min: mn, max: mx }) => (
          <div key={label}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
            <input
              type="number"
              value={value}
              min={mn}
              max={mx}
              onChange={(e) => (set as (v: number) => void)(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="flex gap-4 flex-wrap">
        {[
          { label: "No duplicates", value: noDuplicates, set: setNoDuplicates },
          { label: "Sort results", value: sort, set: setSort },
        ].map(({ label, value, set }) => (
          <button
            key={label}
            onClick={() => set(!value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              value ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${value ? "bg-emerald-600 text-white" : "border border-gray-300"}`}>
              {value ? "✓" : ""}
            </span>
            {label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={generate}
        className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
      >
        Generate
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{results.length} number{results.length !== 1 ? "s" : ""} generated</span>
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy all"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((n, i) => (
              <span
                key={i}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1.5 font-mono font-semibold text-sm"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Recent Generations</p>
          {history.map((h, i) => (
            <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600">
              <span className="font-medium">Range {h.min}–{h.max}, Count {h.count}:</span>{" "}
              <span className="font-mono text-gray-500">{h.results.join(", ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
