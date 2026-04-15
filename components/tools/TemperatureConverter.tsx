"use client";

import { useState } from "react";

type Unit = "C" | "F" | "K";

function convert(value: number, from: Unit): Record<Unit, number> {
  let c: number;
  if (from === "C") c = value;
  else if (from === "F") c = (value - 32) * (5 / 9);
  else c = value - 273.15;

  return {
    C: c,
    F: c * (9 / 5) + 32,
    K: c + 273.15,
  };
}

const units: { id: Unit; label: string; symbol: string }[] = [
  { id: "C", label: "Celsius", symbol: "°C" },
  { id: "F", label: "Fahrenheit", symbol: "°F" },
  { id: "K", label: "Kelvin", symbol: "K" },
];

const references = [
  { label: "Water freezing", C: 0 },
  { label: "Water boiling", C: 100 },
  { label: "Human body temp", C: 37 },
  { label: "Room temperature", C: 22 },
  { label: "Absolute zero", C: -273.15 },
];

export default function TemperatureConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<Unit>("C");

  const numVal = parseFloat(value);
  const hasValue = value !== "" && !isNaN(numVal);
  const results = hasValue ? convert(numVal, from) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Temperature</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter temperature"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
          <div className="flex gap-2">
            {units.map((u) => (
              <button
                key={u.id}
                onClick={() => setFrom(u.id)}
                className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                  from === u.id
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-300"
                }`}
              >
                {u.symbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {units.map((u) => (
            <div
              key={u.id}
              className={`rounded-xl border p-5 text-center ${
                from === u.id
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-green-50 border-green-100"
              }`}
            >
              <p className={`text-3xl font-bold ${from === u.id ? "text-white" : "text-green-700"}`}>
                {parseFloat(results[u.id].toFixed(4))}
              </p>
              <p className={`text-sm mt-1 ${from === u.id ? "text-green-100" : "text-gray-500"}`}>
                {u.label} ({u.symbol})
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reference Table */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Common References</h3>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-gray-600">Reference</th>
                <th className="px-4 py-2.5 font-medium text-gray-600 text-center">°C</th>
                <th className="px-4 py-2.5 font-medium text-gray-600 text-center">°F</th>
                <th className="px-4 py-2.5 font-medium text-gray-600 text-center">K</th>
              </tr>
            </thead>
            <tbody>
              {references.map((ref, i) => {
                const r = convert(ref.C, "C");
                return (
                  <tr key={ref.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2.5 text-gray-700">{ref.label}</td>
                    <td className="px-4 py-2.5 text-center text-gray-600">{r.C}</td>
                    <td className="px-4 py-2.5 text-center text-gray-600">{parseFloat(r.F.toFixed(2))}</td>
                    <td className="px-4 py-2.5 text-center text-gray-600">{parseFloat(r.K.toFixed(2))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
