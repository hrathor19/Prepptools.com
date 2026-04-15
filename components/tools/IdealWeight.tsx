"use client";

import { useState, useEffect } from "react";
import { Scale } from "lucide-react";

type Gender = "male" | "female";
type Unit = "cm" | "ftin";

interface Formula {
  name: string;
  calc: (inchesOver5ft: number, gender: Gender) => number;
}

const FORMULAS: Formula[] = [
  {
    name: "Devine",
    calc: (i, g) => g === "male" ? 50 + 2.3 * i : 45.5 + 2.3 * i,
  },
  {
    name: "Robinson",
    calc: (i, g) => g === "male" ? 52 + 1.9 * i : 49 + 1.7 * i,
  },
  {
    name: "Miller",
    calc: (i, g) => g === "male" ? 56.2 + 1.41 * i : 53.1 + 1.36 * i,
  },
  {
    name: "Hamwi",
    calc: (i, g) => g === "male" ? 48 + 2.7 * i : 45.4 + 2.3 * i,
  },
];

function cmToInches(cm: number): number {
  return cm / 2.54;
}

function ftInToInches(ft: number, inches: number): number {
  return ft * 12 + inches;
}

export default function IdealWeight() {
  const [unit, setUnit] = useState<Unit>("cm");
  const [gender, setGender] = useState<Gender>("male");
  const [heightCm, setHeightCm] = useState<string>("170");
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("7");
  const [results, setResults] = useState<{ name: string; kg: number }[]>([]);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    let totalInches = 0;
    if (unit === "cm") {
      const cm = parseFloat(heightCm);
      if (isNaN(cm) || cm <= 0 || cm > 300) { setValid(false); setResults([]); return; }
      totalInches = cmToInches(cm);
    } else {
      const ft = parseInt(heightFt);
      const inches = parseFloat(heightIn);
      if (isNaN(ft) || isNaN(inches) || ft < 0) { setValid(false); setResults([]); return; }
      totalInches = ftInToInches(ft, inches);
    }

    const inchesOver5ft = totalInches - 60; // 5ft = 60 inches
    if (inchesOver5ft < -12) { setValid(false); setResults([]); return; } // too short for formulas

    setValid(true);
    setResults(
      FORMULAS.map((f) => ({
        name: f.name,
        kg: Math.max(0, parseFloat(f.calc(inchesOver5ft, gender).toFixed(1))),
      }))
    );
  }, [unit, gender, heightCm, heightFt, heightIn]);

  const weights = results.map((r) => r.kg);
  const average = weights.length ? parseFloat((weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1)) : 0;
  const minW = weights.length ? Math.min(...weights) : 0;
  const maxW = weights.length ? Math.max(...weights) : 0;

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Height Unit</label>
        <div className="flex gap-2">
          {([["cm", "Centimeters (cm)"], ["ftin", "Feet + Inches"]] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setUnit(val)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                unit === val
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Height Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
        {unit === "cm" ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={50}
              max={300}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g. 170"
              className="w-40 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <span className="text-sm text-gray-500">cm</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="number"
              min={0}
              max={9}
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value)}
              placeholder="5"
              className="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <span className="text-sm text-gray-500">ft</span>
            <input
              type="number"
              min={0}
              max={11}
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value)}
              placeholder="7"
              className="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <span className="text-sm text-gray-500">in</span>
          </div>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
        <div className="flex gap-2">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`px-5 py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                gender === g
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
              }`}
            >
              {g === "male" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      {valid && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-violet-600" />
            <h3 className="text-sm font-semibold text-gray-700">Ideal Weight Results</h3>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Formula</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">kg</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">lbs</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.name} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-700 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{r.kg} kg</td>
                    <td className="px-4 py-3 text-right text-gray-500">{(r.kg * 2.2046).toFixed(1)} lbs</td>
                  </tr>
                ))}
                {/* Average Row */}
                <tr className="bg-violet-50 border-t-2 border-violet-200">
                  <td className="px-4 py-3 font-bold text-violet-700">Average</td>
                  <td className="px-4 py-3 text-right font-bold text-violet-700">{average} kg</td>
                  <td className="px-4 py-3 text-right font-semibold text-violet-500">{(average * 2.2046).toFixed(1)} lbs</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Range Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Min</p>
              <p className="text-base font-bold text-gray-700">{minW} kg</p>
              <p className="text-xs text-gray-400">{(minW * 2.2046).toFixed(1)} lbs</p>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Average</p>
              <p className="text-base font-bold text-violet-700">{average} kg</p>
              <p className="text-xs text-gray-400">{(average * 2.2046).toFixed(1)} lbs</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Max</p>
              <p className="text-base font-bold text-gray-700">{maxW} kg</p>
              <p className="text-xs text-gray-400">{(maxW * 2.2046).toFixed(1)} lbs</p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 space-y-1">
        <p className="font-semibold">Disclaimer</p>
        <p>
          These formulas provide estimates based on height and gender alone and do not account for muscle mass, bone density,
          body composition, or individual health conditions. Results should not be used as medical advice.
          Consult a qualified healthcare professional for personalized guidance.
        </p>
      </div>
    </div>
  );
}
