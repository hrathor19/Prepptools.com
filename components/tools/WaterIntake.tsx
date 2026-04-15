"use client";

import { useState } from "react";

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.0,
  moderate: 1.1,
  active: 1.2,
  "very active": 1.35,
};

const TIPS = [
  "Start your day with a glass of water before coffee or tea.",
  "Keep a water bottle at your desk as a visual reminder.",
  "Drink a glass of water before each meal.",
  "Set hourly reminders on your phone to hydrate.",
  "Add lemon, mint, or cucumber for flavor variety.",
  "Eat water-rich foods like cucumbers, watermelon, and oranges.",
];

export default function WaterIntake() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("sedentary");
  const [climate, setClimate] = useState("normal");
  const [result, setResult] = useState<{ ml: number; glasses: number } | null>(null);
  const [error, setError] = useState("");

  const GLASS_ML = 250;

  const calculate = () => {
    setError("");
    setResult(null);
    const w = parseFloat(weight);
    if (!w || isNaN(w) || w <= 0 || w > 300) {
      setError("Please enter a valid weight between 1 and 300 kg.");
      return;
    }
    let ml = w * 35 * (ACTIVITY_MULTIPLIERS[activity] ?? 1);
    if (climate === "hot") ml += 500;
    const glasses = ml / GLASS_ML;
    setResult({ ml, glasses });
  };

  const selectClass = "border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 70"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Activity Level</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className={selectClass}>
            <option value="sedentary">Sedentary (desk job)</option>
            <option value="moderate">Moderate (light exercise)</option>
            <option value="active">Active (regular exercise)</option>
            <option value="very active">Very Active (intense training)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Climate</label>
          <select value={climate} onChange={(e) => setClimate(e.target.value)} className={selectClass}>
            <option value="normal">Normal / Temperate</option>
            <option value="hot">Hot / Humid (+500 ml)</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>}

      <button
        onClick={calculate}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Calculate
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Daily Water Intake</p>
              <p className="text-3xl font-bold text-blue-700">{result.ml.toFixed(0)} ml</p>
              <p className="text-sm text-gray-500 mt-1">{result.ml.toFixed(0)} millilitres</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Glasses per Day</p>
              <p className="text-3xl font-bold text-blue-700">{result.glasses.toFixed(1)}</p>
              <p className="text-sm text-gray-500 mt-1">glasses (250 ml each)</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Daily Progress — {Math.ceil(result.glasses)} cups</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.ceil(result.glasses) }).map((_, i) => {
                const isFull = i < Math.floor(result.glasses);
                const isPartial = i === Math.floor(result.glasses) && result.glasses % 1 > 0;
                const pct = isPartial ? Math.round((result.glasses % 1) * 100) : 100;
                return (
                  <div key={i} className="relative w-8 h-10 border-2 border-blue-300 rounded-b-lg rounded-t-sm overflow-hidden bg-white" title={`Cup ${i + 1}`}>
                    <div
                      className={`absolute bottom-0 left-0 right-0 ${isFull ? "bg-blue-400" : isPartial ? "bg-blue-200" : "bg-transparent"}`}
                      style={{ height: isFull ? "100%" : isPartial ? `${pct}%` : "0%" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Hydration Tips</p>
            <ul className="space-y-1.5">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-blue-400 font-bold mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
