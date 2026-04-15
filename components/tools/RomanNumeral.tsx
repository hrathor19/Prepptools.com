"use client";

import { useState } from "react";

const TO_ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(num: number): { roman: string; breakdown: { part: string; value: number }[] } {
  let n = num;
  let roman = "";
  const breakdown: { part: string; value: number }[] = [];
  for (const [value, numeral] of TO_ROMAN) {
    while (n >= value) {
      roman += numeral;
      breakdown.push({ part: numeral, value });
      n -= value;
    }
  }
  return { roman, breakdown };
}

function fromRoman(s: string): { num: number; breakdown: { part: string; value: number }[] } | null {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const upper = s.toUpperCase().trim();
  if (!upper || !/^[IVXLCDM]+$/.test(upper)) return null;
  let total = 0;
  const breakdown: { part: string; value: number }[] = [];
  for (let i = 0; i < upper.length; i++) {
    const cur = map[upper[i]];
    const next = map[upper[i + 1]];
    if (next && cur < next) {
      const combined = upper[i] + upper[i + 1];
      const val = next - cur;
      breakdown.push({ part: combined, value: val });
      total += val;
      i++;
    } else {
      breakdown.push({ part: upper[i], value: cur });
      total += cur;
    }
  }
  if (total < 1 || total > 3999) return null;
  return { num: total, breakdown };
}

export default function RomanNumeral() {
  const [tab, setTab] = useState<"toRoman" | "fromRoman">("toRoman");
  const [numInput, setNumInput] = useState("");
  const [romanInput, setRomanInput] = useState("");

  const numVal = parseInt(numInput);
  const toRomanResult = numInput && !isNaN(numVal) && numVal >= 1 && numVal <= 3999 ? toRoman(numVal) : null;
  const numError = numInput && (isNaN(numVal) || numVal < 1 || numVal > 3999) ? "Enter a number between 1 and 3999." : "";

  const fromRomanResult = romanInput ? fromRoman(romanInput) : null;
  const romanError = romanInput && !fromRomanResult ? "Invalid Roman numeral. Use only I, V, X, L, C, D, M." : "";

  return (
    <div className="space-y-6">
      <div className="flex rounded-xl border border-gray-200 overflow-hidden w-fit">
        {([["toRoman", "Number → Roman"], ["fromRoman", "Roman → Number"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              tab === key ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "toRoman" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Number (1–3999)</label>
            <input
              type="number"
              value={numInput}
              onChange={(e) => setNumInput(e.target.value)}
              placeholder="e.g. 2024"
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
            {numError && <p className="text-xs text-red-500 mt-1">{numError}</p>}
          </div>
          {toRomanResult && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Roman Numeral</p>
                <p className="text-4xl font-bold text-blue-700 tracking-widest">{toRomanResult.roman}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Conversion Breakdown</p>
                <div className="flex flex-wrap gap-2">
                  {toRomanResult.breakdown.map((b, i) => (
                    <span key={i} className="bg-white border border-blue-200 rounded-lg px-3 py-1 text-sm text-blue-700 font-medium">
                      {b.part} = {b.value}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {toRomanResult.breakdown.map((b) => `${b.part}(${b.value})`).join(" + ")} = {numVal}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "fromRoman" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Roman Numeral</label>
            <input
              type="text"
              value={romanInput}
              onChange={(e) => setRomanInput(e.target.value)}
              placeholder="e.g. MMXXIV"
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full uppercase"
            />
            {romanError && <p className="text-xs text-red-500 mt-1">{romanError}</p>}
          </div>
          {fromRomanResult && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Number</p>
                <p className="text-4xl font-bold text-blue-700">{fromRomanResult.num}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Conversion Breakdown</p>
                <div className="flex flex-wrap gap-2">
                  {fromRomanResult.breakdown.map((b, i) => (
                    <span key={i} className="bg-white border border-blue-200 rounded-lg px-3 py-1 text-sm text-blue-700 font-medium">
                      {b.part} = {b.value}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {romanInput.toUpperCase()} = {fromRomanResult.breakdown.map((b) => `${b.part}(${b.value})`).join(" + ")} = {fromRomanResult.num}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
