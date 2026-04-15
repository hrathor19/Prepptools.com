"use client";

import { useState, useMemo } from "react";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("500000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("60");
  const [tenureType, setTenureType] = useState<"months" | "years">("months");

  const results = useMemo(() => {
    const P = parseFloat(principal);
    const R = parseFloat(rate) / 12 / 100;
    const N = tenureType === "years" ? parseFloat(tenure) * 12 : parseFloat(tenure);

    if (!P || !R || !N || isNaN(P) || isNaN(R) || isNaN(N)) return null;

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalAmount = emi * N;
    const totalInterest = totalAmount - P;

    return {
      emi: emi.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      months: N,
    };
  }, [principal, rate, tenure, tenureType]);

  const fmt = (n: string) =>
    parseFloat(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Loan Amount (₹)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g. 500000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g. 8.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Loan Tenure</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g. 60"
            />
            <div className="flex rounded-xl border border-gray-300 overflow-hidden">
              {(["months", "years"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTenureType(t)}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    tenureType === t ? "bg-amber-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t === "months" ? "Mo" : "Yr"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="bg-amber-500 text-white rounded-xl p-6 text-center">
            <p className="text-sm text-amber-100 mb-1">Monthly EMI</p>
            <p className="text-4xl font-bold">₹{fmt(results.emi)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Principal Amount", value: `₹${fmt(principal)}` },
              { label: "Total Interest", value: `₹${fmt(results.totalInterest)}`, highlight: true },
              { label: "Total Payment", value: `₹${fmt(results.totalAmount)}` },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-4 text-center ${item.highlight ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
                <p className={`text-lg font-bold ${item.highlight ? "text-red-600" : "text-amber-700"}`}>
                  {item.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="h-4 rounded-full overflow-hidden bg-gray-200">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (parseFloat(principal) / parseFloat(results.totalAmount)) * 100).toFixed(1)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Principal {((parseFloat(principal) / parseFloat(results.totalAmount)) * 100).toFixed(1)}%</span>
              <span>Interest {((parseFloat(results.totalInterest) / parseFloat(results.totalAmount)) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
