"use client";

import { useState } from "react";

function getBMICategory(bmi: number): { label: string; color: string; bg: string; desc: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", desc: "You may need to gain some weight. Consult a healthcare provider." };
  if (bmi < 25) return { label: "Normal weight", color: "text-green-600", bg: "bg-green-50 border-green-200", desc: "You are at a healthy weight. Maintain it with balanced diet and exercise." };
  if (bmi < 30) return { label: "Overweight", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", desc: "You are slightly above healthy weight. Consider moderate lifestyle changes." };
  return { label: "Obese", color: "text-red-600", bg: "bg-red-50 border-red-200", desc: "Being obese increases risk of several health conditions. Consider consulting a doctor." };
}

export default function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");

  const bmi = (() => {
    if (!weight) return null;
    if (unit === "metric") {
      const h = parseFloat(heightCm) / 100;
      const w = parseFloat(weight);
      if (!h || !w) return null;
      return w / (h * h);
    } else {
      const totalInches = parseFloat(heightFt || "0") * 12 + parseFloat(heightIn || "0");
      const w = parseFloat(weight);
      if (!totalInches || !w) return null;
      return (w / (totalInches * totalInches)) * 703;
    }
  })();

  const category = bmi ? getBMICategory(bmi) : null;

  const needleAngle = bmi
    ? Math.min(180, Math.max(0, ((Math.min(bmi, 40) - 10) / 30) * 180))
    : 0;

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex rounded-xl border border-gray-300 overflow-hidden w-fit">
        {(["metric", "imperial"] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              unit === u ? "bg-rose-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/ft)"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {unit === "metric" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Height (cm)</label>
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. 170" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Height</label>
            <div className="flex gap-2">
              <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="ft" />
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="in" />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"} />
        </div>
      </div>

      {bmi && category && (
        <div className="space-y-4">
          {/* Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-24 overflow-hidden">
              <div className="absolute inset-0 w-full h-full">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#dbeafe" strokeWidth="20" />
                  <path d="M 10 100 A 90 90 0 0 1 60 20" fill="none" stroke="#3b82f6" strokeWidth="20" />
                  <path d="M 60 20 A 90 90 0 0 1 100 10" fill="none" stroke="#22c55e" strokeWidth="20" />
                  <path d="M 100 10 A 90 90 0 0 1 150 20" fill="none" stroke="#f59e0b" strokeWidth="20" />
                  <path d="M 150 20 A 90 90 0 0 1 190 100" fill="none" stroke="#ef4444" strokeWidth="20" />
                  <g transform={`rotate(${needleAngle - 90}, 100, 100)`}>
                    <line x1="100" y1="100" x2="100" y2="20" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="100" cy="100" r="5" fill="#1f2937" />
                  </g>
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900">{bmi.toFixed(1)}</p>
            <p className={`text-lg font-semibold mt-1 ${category.color}`}>{category.label}</p>
          </div>

          <div className={`border rounded-xl p-4 ${category.bg}`}>
            <p className="text-sm text-gray-600">{category.desc}</p>
          </div>

          {/* Scale */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-gray-600 font-medium">Category</th>
                  <th className="px-3 py-2 text-center text-gray-600 font-medium">BMI Range</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Underweight", range: "< 18.5", color: "text-blue-600" },
                  { label: "Normal weight", range: "18.5 – 24.9", color: "text-green-600" },
                  { label: "Overweight", range: "25.0 – 29.9", color: "text-amber-600" },
                  { label: "Obese", range: "≥ 30.0", color: "text-red-600" },
                ].map((row, i) => (
                  <tr key={row.label} className={`${row.label === category.label ? "bg-blue-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className={`px-3 py-2 font-medium ${row.color}`}>{row.label}</td>
                    <td className="px-3 py-2 text-center text-gray-600">{row.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
