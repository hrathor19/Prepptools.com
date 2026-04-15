"use client";

import { useState } from "react";

const units = [
  { id: "mm", label: "Millimeters (mm)", toMeter: 0.001 },
  { id: "cm", label: "Centimeters (cm)", toMeter: 0.01 },
  { id: "m", label: "Meters (m)", toMeter: 1 },
  { id: "km", label: "Kilometers (km)", toMeter: 1000 },
  { id: "in", label: "Inches (in)", toMeter: 0.0254 },
  { id: "ft", label: "Feet (ft)", toMeter: 0.3048 },
  { id: "yd", label: "Yards (yd)", toMeter: 0.9144 },
  { id: "mi", label: "Miles (mi)", toMeter: 1609.344 },
  { id: "nmi", label: "Nautical Miles", toMeter: 1852 },
];

export default function LengthConverter() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");

  const baseValue = parseFloat(value) * (units.find((u) => u.id === fromUnit)?.toMeter ?? 1);

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

      {value && !isNaN(baseValue) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {units
            .filter((u) => u.id !== fromUnit)
            .map((u) => {
              const converted = baseValue / u.toMeter;
              const formatted =
                Math.abs(converted) < 0.001 || Math.abs(converted) > 1e9
                  ? converted.toExponential(4)
                  : parseFloat(converted.toFixed(6)).toString();
              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3"
                >
                  <span className="text-sm text-gray-500">{u.label}</span>
                  <span className="text-sm font-bold text-green-700">{formatted}</span>
                </div>
              );
            })}
        </div>
      )}

      {!value && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm">Enter a value above to see all conversions</p>
        </div>
      )}
    </div>
  );
}
