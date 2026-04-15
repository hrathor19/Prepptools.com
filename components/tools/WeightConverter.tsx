"use client";

import { useState } from "react";

const units = [
  { id: "mg", label: "Milligrams (mg)", toKg: 0.000001 },
  { id: "g", label: "Grams (g)", toKg: 0.001 },
  { id: "kg", label: "Kilograms (kg)", toKg: 1 },
  { id: "t", label: "Metric Tons (t)", toKg: 1000 },
  { id: "oz", label: "Ounces (oz)", toKg: 0.0283495 },
  { id: "lb", label: "Pounds (lb)", toKg: 0.453592 },
  { id: "st", label: "Stones (st)", toKg: 6.35029 },
];

export default function WeightConverter() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("kg");

  const baseKg = parseFloat(value) * (units.find((u) => u.id === fromUnit)?.toKg ?? 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {value && !isNaN(baseKg) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {units
            .filter((u) => u.id !== fromUnit)
            .map((u) => {
              const converted = baseKg / u.toKg;
              const formatted = parseFloat(converted.toFixed(6)).toString();
              return (
                <div key={u.id} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-500">{u.label}</span>
                  <span className="text-sm font-bold text-green-700">{formatted}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
