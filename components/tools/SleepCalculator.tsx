"use client";
import { useState } from "react";
import { Moon } from "lucide-react";

function addMins(time: string, mins: number) {
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + mins + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
function subMins(time: string, mins: number) {
  return addMins(time, -mins);
}
function fmt12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${((h % 12) || 12)}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function SleepCalculator() {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [time, setTime] = useState("07:00");

  const CYCLE = 90; // minutes
  const FALL_ASLEEP = 15;

  const times = mode === "wake"
    ? [6, 5, 4, 3].map(c => ({ cycles: c, t: subMins(time, c * CYCLE + FALL_ASLEEP), hours: (c * CYCLE / 60).toFixed(1) }))
    : [3, 4, 5, 6].map(c => ({ cycles: c, t: addMins(time, c * CYCLE + FALL_ASLEEP), hours: (c * CYCLE / 60).toFixed(1) }));

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["wake", "sleep"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${mode === m ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>
            {m === "wake" ? "I want to wake up at…" : "I'll go to sleep at…"}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {mode === "wake" ? "Wake-up time" : "Bedtime"}
        </label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">
          {mode === "wake" ? "Go to sleep at:" : "Wake up at:"}</p>
        {times.map(({ cycles, t, hours }, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${cycles === 6 ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200"}`}>
            <div>
              <span className="text-xl font-bold text-gray-900">{fmt12(t)}</span>
              {cycles === 6 && <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Recommended</span>}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">{hours}h sleep</p>
              <p className="text-xs text-gray-400">{cycles} cycles</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
        These times account for ~15 minutes to fall asleep. Each sleep cycle is 90 minutes.
      </p>
    </div>
  );
}
