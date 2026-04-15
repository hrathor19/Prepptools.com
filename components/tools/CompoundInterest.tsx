"use client";

import { useState, useMemo } from "react";

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("10");
  const [frequency, setFrequency] = useState("1");

  const results = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const n = parseFloat(frequency);

    if (!P || !r || !t || !n || isNaN(P) || isNaN(r) || isNaN(t) || isNaN(n)) return null;

    const A = P * Math.pow(1 + r / n, n * t);
    const interest = A - P;

    return {
      finalAmount: A.toFixed(2),
      totalInterest: interest.toFixed(2),
      multiplier: (A / P).toFixed(2),
    };
  }, [principal, rate, years, frequency]);

  const fmt = (n: string) =>
    parseFloat(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const compoundingOptions = [
    { value: "1", label: "Annually" },
    { value: "2", label: "Semi-annually" },
    { value: "4", label: "Quarterly" },
    { value: "12", label: "Monthly" },
    { value: "365", label: "Daily" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Principal (₹)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Time (Years)</label>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Compounding</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
            {compoundingOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {results && (
        <div className="space-y-3">
          <div className="bg-amber-500 rounded-xl p-6 text-center text-white">
            <p className="text-sm text-amber-100 mb-1">Final Amount</p>
            <p className="text-4xl font-bold">₹{fmt(results.finalAmount)}</p>
            <p className="text-sm text-amber-100 mt-1">{results.multiplier}× your investment</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-amber-700">₹{fmt(principal)}</p>
              <p className="text-xs text-gray-500 mt-1">Principal Invested</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-green-600">₹{fmt(results.totalInterest)}</p>
              <p className="text-xs text-gray-500 mt-1">Interest Earned</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
