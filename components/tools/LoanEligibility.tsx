"use client";

import { useState } from "react";

export default function LoanEligibility() {
  const [income, setIncome]       = useState("");
  const [expenses, setExpenses]   = useState("");
  const [rate, setRate]           = useState("10.5");
  const [tenure, setTenure]       = useState("20");
  const [result, setResult]       = useState<{ eligible: number; emi: number; ratio: number } | null>(null);

  function calculate() {
    const monthlyIncome   = parseFloat(income);
    const monthlyExpenses = parseFloat(expenses) || 0;
    if (isNaN(monthlyIncome) || monthlyIncome <= 0) return;

    const disposable   = monthlyIncome - monthlyExpenses;
    const maxEMI       = disposable * 0.5; // banks allow up to 50% FOIR
    const r            = parseFloat(rate) / 100 / 12;
    const n            = parseFloat(tenure) * 12;

    // P = EMI * [(1+r)^n - 1] / [r * (1+r)^n]
    const eligible = maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));

    // Back-compute EMI for the eligible amount to show exact figure
    const emi = eligible * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

    const ratio = Math.round((emi / monthlyIncome) * 100);

    setResult({ eligible: Math.round(eligible), emi: Math.round(emi), ratio });
  }

  function fmt(n: number) {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monthly Income (₹)</label>
          <input
            type="number" min="0" placeholder="e.g. 60000"
            value={income} onChange={(e) => { setIncome(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monthly Expenses (₹)</label>
          <input
            type="number" min="0" placeholder="e.g. 20000"
            value={expenses} onChange={(e) => { setExpenses(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Interest Rate (% per annum)</label>
          <input
            type="number" step="0.1" min="1" max="30" placeholder="e.g. 10.5"
            value={rate} onChange={(e) => { setRate(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Loan Tenure (years)</label>
          <select
            value={tenure} onChange={(e) => { setTenure(e.target.value); setResult(null); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {[5, 10, 15, 20, 25, 30].map((y) => (
              <option key={y} value={y}>{y} years</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={!income.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Check Loan Eligibility
      </button>

      {result !== null && (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-6 text-center">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-widest mb-2">Estimated Eligible Loan</p>
            <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-1">₹{fmt(result.eligible)}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Based on 50% FOIR (Fixed Obligation to Income Ratio)</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max Monthly EMI</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">₹{fmt(result.emi)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">EMI-to-Income Ratio</p>
              <p className={`text-xl font-bold ${result.ratio <= 40 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>{result.ratio}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 text-xs text-gray-600 dark:text-gray-300 space-y-1">
        <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">How eligibility is calculated</p>
        <p>• Banks typically allow EMI up to 50% of net monthly income (FOIR rule)</p>
        <p>• Higher income or longer tenure increases eligible loan amount</p>
        <p>• Existing EMIs / obligations reduce eligibility further</p>
        <p>• Actual eligibility may vary by lender, credit score, and employment type</p>
      </div>
    </div>
  );
}
