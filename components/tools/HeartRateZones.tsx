"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface Zone {
  name: string;
  label: string;
  minPct: number;
  maxPct: number;
  color: string;
  bg: string;
  border: string;
}

const ZONES: Zone[] = [
  { name: "Zone 1", label: "Warm Up",        minPct: 50, maxPct: 60, color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  { name: "Zone 2", label: "Fat Burn",        minPct: 60, maxPct: 70, color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  { name: "Zone 3", label: "Aerobic/Cardio",  minPct: 70, maxPct: 80, color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200" },
  { name: "Zone 4", label: "Anaerobic",       minPct: 80, maxPct: 90, color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { name: "Zone 5", label: "Max / VO2",       minPct: 90, maxPct: 100, color: "text-red-700",   bg: "bg-red-50",   border: "border-red-200" },
];

const BAR_COLORS = ["bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-500"];

export default function HeartRateZones() {
  const [age, setAge] = useState<string>("30");
  const [restingHR, setRestingHR] = useState<string>("");
  const [maxHR, setMaxHR] = useState<number>(0);

  useEffect(() => {
    const a = parseInt(age);
    if (!isNaN(a) && a > 0 && a < 130) {
      setMaxHR(220 - a);
    } else {
      setMaxHR(0);
    }
  }, [age]);

  const rhr = parseInt(restingHR);
  const hasKarvonen = !isNaN(rhr) && rhr > 0 && rhr < 250 && maxHR > 0;
  const hrr = hasKarvonen ? maxHR - rhr : 0;

  function getStandardRange(zone: Zone) {
    return {
      min: Math.round(maxHR * zone.minPct / 100),
      max: Math.round(maxHR * zone.maxPct / 100),
    };
  }

  function getKarvonenRange(zone: Zone) {
    return {
      min: Math.round(hrr * zone.minPct / 100 + rhr),
      max: Math.round(hrr * zone.maxPct / 100 + rhr),
    };
  }

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
          <input
            type="number"
            min={10}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 30"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resting Heart Rate (bpm) <span className="text-gray-400 font-normal text-xs">— optional</span>
          </label>
          <input
            type="number"
            min={30}
            max={200}
            value={restingHR}
            onChange={(e) => setRestingHR(e.target.value)}
            placeholder="e.g. 60"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
      </div>

      {/* Max HR Display */}
      {maxHR > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
          <Heart className="w-6 h-6 text-red-500 shrink-0" />
          <div>
            <p className="text-sm text-gray-600">Estimated Max Heart Rate</p>
            <p className="text-2xl font-bold text-red-600">{maxHR} <span className="text-base font-normal text-gray-500">bpm</span></p>
            <p className="text-xs text-gray-400 mt-0.5">Formula: 220 − {age} = {maxHR}</p>
          </div>
        </div>
      )}

      {/* Zones */}
      {maxHR > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Heart Rate Zones</h3>
          {ZONES.map((zone, i) => {
            const std = getStandardRange(zone);
            const karv = hasKarvonen ? getKarvonenRange(zone) : null;
            const barWidth = zone.maxPct - zone.minPct; // 10%
            const barOffset = zone.minPct - 50; // offset from 50%

            return (
              <div key={zone.name} className={`rounded-xl border ${zone.border} ${zone.bg} p-4 space-y-2`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className={`text-sm font-bold ${zone.color}`}>{zone.name}</span>
                    <span className="text-sm text-gray-500 ml-2">— {zone.label}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${zone.color}`}>
                      {std.min}–{std.max} bpm
                    </span>
                    <span className="text-xs text-gray-400 ml-1">({zone.minPct}–{zone.maxPct}%)</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-white/60 rounded-full h-2.5 overflow-hidden relative">
                  <div
                    className={`absolute h-full rounded-full ${BAR_COLORS[i]}`}
                    style={{
                      left: `${(barOffset / 50) * 100}%`,
                      width: `${(barWidth / 50) * 100}%`,
                    }}
                  />
                </div>

                {/* Karvonen */}
                {karv && (
                  <p className="text-xs text-gray-500">
                    Karvonen: <span className={`font-semibold ${zone.color}`}>{karv.min}–{karv.max} bpm</span>
                    <span className="text-gray-400 ml-1">(HRR method)</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Karvonen explanation */}
      {hasKarvonen && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-500 space-y-0.5">
          <p className="font-semibold text-gray-600">Karvonen (Heart Rate Reserve) Formula</p>
          <p>HRR = Max HR − Resting HR = {maxHR} − {rhr} = {hrr} bpm</p>
          <p>Target = (HRR × intensity%) + Resting HR</p>
        </div>
      )}

      {!maxHR && (
        <div className="text-center text-gray-400 text-sm py-8">
          Enter your age above to calculate heart rate zones.
        </div>
      )}
    </div>
  );
}
