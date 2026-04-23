"use client";

import { useState } from "react";

const SKILLS = [
  "Web Development", "Mobile Development", "UI/UX Design", "Graphic Design",
  "Content Writing", "Copywriting", "SEO / Digital Marketing", "Data Analysis",
  "Video Editing", "Social Media Management", "Virtual Assistant", "Accounting / Finance",
];

export default function RateCalculator() {
  const [income, setIncome]     = useState("");
  const [hours, setHours]       = useState("40");
  const [expenses, setExpenses] = useState("");
  const [tax, setTax]           = useState("15");
  const [vacWeeks, setVacWeeks] = useState("4");
  const [result, setResult]     = useState<{ hourly: number; daily: number; monthly: number; weekly: number } | null>(null);

  function calculate() {
    const annualTarget  = parseFloat(income) * 100000; // LPA to ₹
    const annualExpense = parseFloat(expenses || "0") * 12;
    const taxRate       = parseFloat(tax) / 100;
    const hoursPerWeek  = parseFloat(hours);
    const vacationWeeks = parseFloat(vacWeeks);
    const billableWeeks = 52 - vacationWeeks;
    const billableHours = billableWeeks * hoursPerWeek;

    const grossNeeded = (annualTarget + annualExpense) / (1 - taxRate);
    const hourly      = Math.ceil(grossNeeded / billableHours);
    const daily       = Math.ceil(hourly * 8);
    const weekly      = Math.ceil(hourly * hoursPerWeek);
    const monthly     = Math.ceil(grossNeeded / 12);

    setResult({ hourly, daily, monthly, weekly });
  }

  function fmt(n: number) {
    return new Intl.NumberFormat("en-IN").format(n);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Annual Income (LPA)</label>
          <input
            type="number" min="0" placeholder="e.g. 12"
            value={income} onChange={(e) => { setIncome(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hours You Work Per Week</label>
          <input
            type="number" min="1" max="80" placeholder="e.g. 40"
            value={hours} onChange={(e) => { setHours(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monthly Business Expenses (₹)</label>
          <input
            type="number" min="0" placeholder="e.g. 5000 (software, internet, etc.)"
            value={expenses} onChange={(e) => { setExpenses(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expected Tax Rate (%)</label>
          <select
            value={tax} onChange={(e) => { setTax(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="0">0% (below ₹3L — no tax)</option>
            <option value="5">5% (₹3L–7L slab)</option>
            <option value="10">10% (₹7L–10L slab)</option>
            <option value="15">15% (estimate with deductions)</option>
            <option value="20">20% (₹10L–12L slab)</option>
            <option value="30">30% (above ₹15L)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Vacation / Sick Weeks Per Year</label>
          <select
            value={vacWeeks} onChange={(e) => { setVacWeeks(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            {[2, 3, 4, 6, 8].map((w) => <option key={w} value={w}>{w} weeks</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={!income.trim()}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Calculate My Freelance Rate
      </button>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Hourly Rate",  value: `₹${fmt(result.hourly)}`, sub: "per hour" },
            { label: "Daily Rate",   value: `₹${fmt(result.daily)}`,  sub: "per 8-hr day" },
            { label: "Weekly Rate",  value: `₹${fmt(result.weekly)}`, sub: "per week" },
            { label: "Monthly Rate", value: `₹${fmt(result.monthly)}`, sub: "per month" },
          ].map((r) => (
            <div key={r.label} className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{r.label}</p>
              <p className="text-lg font-bold text-violet-700 dark:text-violet-400">{r.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{r.sub}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">How this is calculated</p>
        <p>• Takes your target income + expenses + tax buffer</p>
        <p>• Divides by actual billable hours (after vacation weeks)</p>
        <p>• Freelancers are not always 100% billable — add 10–20% buffer to your rate</p>
      </div>
    </div>
  );
}
