"use client";

import { useState, useMemo } from "react";

type Mode = "add" | "remove";
const GST_RATES = [5, 12, 18, 28] as const;
type GSTRate = (typeof GST_RATES)[number];

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState<GSTRate>(18);
  const [mode, setMode] = useState<Mode>("add");

  const calc = useMemo(() => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) return null;

    if (mode === "add") {
      const gstAmount = (num * rate) / 100;
      const total = num + gstAmount;
      return {
        base: num,
        gst: gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        total,
      };
    } else {
      const base = (num * 100) / (100 + rate);
      const gstAmount = num - base;
      return {
        base,
        gst: gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        total: num,
      };
    }
  }, [amount, rate, mode]);

  function fmt(n: number) {
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(["add", "remove"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "add" ? "Add GST" : "Remove GST"}
          </button>
        ))}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1.5">
          {mode === "add" ? "Base Amount (₹)" : "Total Amount with GST (₹)"}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount…"
          min="0"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">GST Rate</p>
        <div className="flex flex-wrap gap-3">
          {GST_RATES.map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                rate === r
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {r}%
            </button>
          ))}
        </div>
      </div>

      {calc && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Breakdown ({rate}% GST — {mode === "add" ? "Added" : "Removed"})
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Base Amount</p>
              <p className="text-xl font-bold text-gray-800">₹{fmt(calc.base)}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">GST Amount ({rate}%)</p>
              <p className="text-xl font-bold text-blue-700">₹{fmt(calc.gst)}</p>
              <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                <p>CGST ({rate / 2}%): ₹{fmt(calc.cgst)}</p>
                <p>SGST ({rate / 2}%): ₹{fmt(calc.sgst)}</p>
              </div>
            </div>
            <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Amount</p>
              <p className="text-xl font-bold text-green-700">₹{fmt(calc.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
