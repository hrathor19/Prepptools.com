"use client";

import { useState } from "react";

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState(15);
  const [people, setPeople] = useState(1);

  const billNum = parseFloat(bill) || 0;
  const tipAmount = (billNum * tipPct) / 100;
  const total = billNum + tipAmount;
  const perPerson = people > 0 ? total / people : 0;
  const tipPerPerson = people > 0 ? tipAmount / people : 0;

  const presets = [5, 10, 15, 20, 25];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Bill Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tip Percentage: <span className="text-blue-600 font-bold">{tipPct}%</span>
        </label>
        <div className="flex gap-2 flex-wrap mb-3">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setTipPct(p)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                tipPct === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={tipPct}
          onChange={(e) => setTipPct(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Number of People
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPeople((p) => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-xl"
          >
            −
          </button>
          <span className="w-10 text-center font-bold text-gray-800 text-lg">{people}</span>
          <button
            onClick={() => setPeople((p) => p + 1)}
            className="w-10 h-10 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-xl"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Tip Amount", value: `₹${tipAmount.toFixed(2)}` },
          { label: "Total Bill", value: `₹${total.toFixed(2)}` },
          { label: "Tip / Person", value: `₹${tipPerPerson.toFixed(2)}` },
          { label: "Total / Person", value: `₹${perPerson.toFixed(2)}` },
        ].map((stat) => (
          <div key={stat.label} className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-blue-700">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
