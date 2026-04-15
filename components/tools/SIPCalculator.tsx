"use client";

import { useState } from "react";

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{ totalInvested: number; maturity: number; returns: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult(null);
    const P = parseFloat(monthly);
    const annualRate = parseFloat(rate);
    const n = parseFloat(years) * 12;

    if (!P || !annualRate || !n || isNaN(P) || isNaN(annualRate) || isNaN(n) || P <= 0 || annualRate <= 0 || n <= 0) {
      setError("Please enter valid positive values for all fields.");
      return;
    }

    const r = annualRate / 12 / 100;
    const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = P * n;
    const returns = maturity - totalInvested;
    setResult({ totalInvested, maturity, returns });
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const investedPct = result ? (result.totalInvested / result.maturity) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Investment (₹)</label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            placeholder="e.g. 5000"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected Annual Return (%)</label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="e.g. 12"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Time Period (years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            placeholder="e.g. 10"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
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
          <div className="bg-blue-600 text-white rounded-xl p-6 text-center">
            <p className="text-sm text-blue-100 mb-1">Maturity Amount</p>
            <p className="text-4xl font-bold">₹{fmt(result.maturity)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-blue-700">₹{fmt(result.totalInvested)}</p>
              <p className="text-xs text-gray-500 mt-1">Total Invested</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-green-700">₹{fmt(result.returns)}</p>
              <p className="text-xs text-gray-500 mt-1">Estimated Returns</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Investment vs Returns</p>
            <div className="h-5 rounded-full overflow-hidden bg-green-200 flex">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${investedPct.toFixed(1)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-500" />
                Invested {investedPct.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-200" />
                Returns {(100 - investedPct).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
