"use client";

import { useState } from "react";

const activityLevels = [
  { id: "sedentary", label: "Sedentary", desc: "Little or no exercise", multiplier: 1.2 },
  { id: "light", label: "Lightly Active", desc: "Light exercise 1–3 days/week", multiplier: 1.375 },
  { id: "moderate", label: "Moderately Active", desc: "Moderate exercise 3–5 days/week", multiplier: 1.55 },
  { id: "very", label: "Very Active", desc: "Hard exercise 6–7 days/week", multiplier: 1.725 },
  { id: "extra", label: "Extra Active", desc: "Very hard exercise or physical job", multiplier: 1.9 },
];

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState("moderate");

  const result = (() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!a || !w || !h) return null;

    let bmr: number;
    if (gender === "male") {
      bmr = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
    } else {
      bmr = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
    }

    const level = activityLevels.find((l) => l.id === activity)!;
    const tdee = bmr * level.multiplier;

    return {
      bmr: Math.round(bmr),
      maintenance: Math.round(tdee),
      weightLoss: Math.round(tdee - 500),
      aggressiveLoss: Math.round(tdee - 1000),
      weightGain: Math.round(tdee + 500),
    };
  })();

  return (
    <div className="space-y-6">
      <div className="flex rounded-xl border border-gray-300 overflow-hidden w-fit">
        {(["male", "female"] as const).map((g) => (
          <button key={g} onClick={() => setGender(g)}
            className={`px-6 py-2.5 text-sm font-medium capitalize transition-colors ${
              gender === g ? "bg-rose-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}>
            {g === "male" ? "♂ Male" : "♀ Female"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Age (years)</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="e.g. 28" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="e.g. 70" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Height (cm)</label>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="e.g. 170" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
        <div className="space-y-2">
          {activityLevels.map((l) => (
            <button key={l.id} onClick={() => setActivity(l.id)}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                activity === l.id ? "border-rose-500 bg-rose-50" : "border-gray-200 hover:border-rose-200"
              }`}>
              <span className={`text-sm font-semibold ${activity === l.id ? "text-rose-700" : "text-gray-700"}`}>{l.label}</span>
              <span className="text-xs text-gray-400 ml-2">— {l.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="bg-rose-500 rounded-xl p-5 text-center text-white">
            <p className="text-sm text-rose-100">Daily Maintenance Calories (TDEE)</p>
            <p className="text-4xl font-bold mt-1">{result.maintenance.toLocaleString()}</p>
            <p className="text-sm text-rose-100 mt-1">kcal / day · BMR: {result.bmr.toLocaleString()} kcal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Weight Loss", val: result.weightLoss, sub: "−500 kcal/day", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
              { label: "Maintain Weight", val: result.maintenance, sub: "Current TDEE", color: "text-green-600", bg: "bg-green-50 border-green-100" },
              { label: "Weight Gain", val: result.weightGain, sub: "+500 kcal/day", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 text-center ${item.bg}`}>
                <p className={`text-xl font-bold ${item.color}`}>{item.val.toLocaleString()}</p>
                <p className="text-xs font-medium text-gray-700 mt-1">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
