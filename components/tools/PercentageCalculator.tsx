"use client";

import { useState } from "react";

type Mode = "whatpct" | "pctofnum" | "pctchange";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("pctofnum");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  function computeResult(): string {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return "";

    switch (mode) {
      case "pctofnum":
        return `${((numA / 100) * numB).toFixed(2)}`;
      case "whatpct":
        if (numB === 0) return "undefined";
        return `${((numA / numB) * 100).toFixed(2)}%`;
      case "pctchange":
        if (numA === 0) return "undefined";
        return `${(((numB - numA) / numA) * 100).toFixed(2)}% ${numB >= numA ? "increase" : "decrease"}`;
    }
  }

  const result = computeResult();

  const modes = [
    {
      id: "pctofnum" as Mode,
      label: "% of a number",
      example: "What is 20% of 150?",
      labelA: "Percentage (%)",
      labelB: "Number",
    },
    {
      id: "whatpct" as Mode,
      label: "What % is X of Y?",
      example: "30 is what % of 150?",
      labelA: "Value (X)",
      labelB: "Total (Y)",
    },
    {
      id: "pctchange" as Mode,
      label: "% change",
      example: "% change from 80 to 100?",
      labelA: "Original value",
      labelB: "New value",
    },
  ];

  const currentMode = modes.find((m) => m.id === mode)!;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setA(""); setB(""); }}
            className={`p-3 rounded-xl border text-left transition-colors ${
              mode === m.id
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-200"
            }`}
          >
            <p className={`text-sm font-semibold ${mode === m.id ? "text-purple-700" : "text-gray-700"}`}>
              {m.label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{m.example}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {currentMode.labelA}
          </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {currentMode.labelB}
          </label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter value"
          />
        </div>
      </div>

      {result && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
          <p className="text-sm text-purple-600 mb-1">Result</p>
          <p className="text-4xl font-bold text-purple-700">{result}</p>
        </div>
      )}
    </div>
  );
}
