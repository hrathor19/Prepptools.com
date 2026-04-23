"use client";

import { useState } from "react";

const PLATFORMS = [
  {
    id: "upwork",
    name: "Upwork",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    fee: (amount: number) => {
      if (amount <= 500)   return amount * 0.20;
      if (amount <= 10000) return 500 * 0.20 + (amount - 500) * 0.10;
      return 500 * 0.20 + 9500 * 0.10 + (amount - 10000) * 0.05;
    },
    feeNote: "20% on first $500 · 10% up to $10k · 5% above $10k (lifetime per client)",
  },
  {
    id: "fiverr",
    name: "Fiverr",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    fee: (amount: number) => amount * 0.20,
    feeNote: "Flat 20% on all orders",
  },
  {
    id: "toptal",
    name: "Toptal",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    fee: (amount: number) => amount * 0.15,
    feeNote: "~15% margin taken by platform (estimate)",
  },
  {
    id: "freelancer",
    name: "Freelancer.com",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    fee: (amount: number) => Math.max(amount * 0.10, 5),
    feeNote: "10% or $5 minimum per project",
  },
  {
    id: "direct",
    name: "Direct Client",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    fee: () => 0,
    feeNote: "No platform fee — keep 100% (minus payment gateway ~2%)",
  },
];

export default function PlatformCalculator() {
  const [amount, setAmount]     = useState("");
  const [currency, setCurrency] = useState("INR");

  const val = parseFloat(amount) || 0;

  function fmt(n: number) {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  }

  const symbol = currency === "INR" ? "₹" : "$";

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">Enter your project value and see exactly how much each platform takes and what you actually earn.</p>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Project Value</label>
          <input
            type="number" min="0" placeholder="e.g. 50000"
            value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
          <select
            value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
          </select>
        </div>
      </div>

      {val > 0 && (
        <div className="space-y-3">
          {PLATFORMS.map((p) => {
            const fee    = p.fee(val);
            const earned = val - fee;
            const pct    = val > 0 ? Math.round((fee / val) * 100) : 0;
            return (
              <div key={p.id} className={`${p.bg} border border-gray-200 dark:border-gray-700 rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold text-sm ${p.color}`}>{p.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{p.feeNote}</span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Platform Fee</p>
                    <p className="text-base font-bold text-red-500">{symbol}{fmt(fee)} ({pct}%)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">You Earn</p>
                    <p className={`text-base font-bold ${p.color}`}>{symbol}{fmt(earned)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
