"use client";

import { useState } from "react";

export default function SalaryCalculator() {
  const [ctc, setCtc] = useState("");
  const [result, setResult] = useState<{
    basic: number; hra: number; specialAllowance: number;
    employeePF: number; employerPF: number; professionalTax: number;
    grossMonthly: number; monthlyDeductions: number; monthlyInHand: number;
    annualInHand: number;
  } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult(null);
    const annual = parseFloat(ctc);
    if (!annual || isNaN(annual) || annual <= 0) {
      setError("Please enter a valid annual CTC.");
      return;
    }
    const basic = annual * 0.40;
    const hra = basic * 0.50;
    const employerPF = basic * 0.12;
    const employeePF = basic * 0.12;
    const professionalTax = 200 * 12;
    const specialAllowance = annual - basic - hra - employerPF;
    const grossMonthly = annual / 12;
    const monthlyDeductions = (employeePF + professionalTax) / 12;
    const monthlyInHand = grossMonthly - monthlyDeductions - employerPF / 12;
    const annualInHand = monthlyInHand * 12;
    setResult({ basic, hra, specialAllowance, employeePF, employerPF, professionalTax, grossMonthly, monthlyDeductions, monthlyInHand, annualInHand });
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const rows = result
    ? [
        { label: "Basic Salary", annual: result.basic, monthly: result.basic / 12, note: "40% of CTC" },
        { label: "HRA", annual: result.hra, monthly: result.hra / 12, note: "50% of Basic" },
        { label: "Special Allowance", annual: result.specialAllowance, monthly: result.specialAllowance / 12, note: "Remaining" },
        { label: "Employee PF", annual: result.employeePF, monthly: result.employeePF / 12, note: "12% of Basic (deduction)" },
        { label: "Employer PF", annual: result.employerPF, monthly: result.employerPF / 12, note: "12% of Basic (part of CTC)" },
        { label: "Professional Tax", annual: result.professionalTax, monthly: 200, note: "₹200/month (deduction)" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual CTC (₹)</label>
        <input
          type="number"
          value={ctc}
          onChange={(e) => setCtc(e.target.value)}
          placeholder="e.g. 1200000"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-600 text-white rounded-xl p-5 text-center">
              <p className="text-sm text-blue-100 mb-1">Monthly In-Hand</p>
              <p className="text-3xl font-bold">₹{fmt(result.monthlyInHand)}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">Annual In-Hand</p>
              <p className="text-3xl font-bold text-blue-700">₹{fmt(result.annualInHand)}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 overflow-x-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">CTC Breakdown</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-blue-200">
                  <th className="pb-2 font-semibold">Component</th>
                  <th className="pb-2 font-semibold text-right">Monthly (₹)</th>
                  <th className="pb-2 font-semibold text-right">Annual (₹)</th>
                  <th className="pb-2 font-semibold text-right hidden sm:table-cell">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className="py-2 text-gray-700 font-medium">{row.label}</td>
                    <td className="py-2 text-right text-gray-700">₹{fmt(row.monthly)}</td>
                    <td className="py-2 text-right text-gray-700">₹{fmt(row.annual)}</td>
                    <td className="py-2 text-right text-gray-400 text-xs hidden sm:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-blue-300 font-semibold">
                  <td className="pt-2 text-gray-800">Total CTC</td>
                  <td className="pt-2 text-right text-gray-800">₹{fmt(result.grossMonthly)}</td>
                  <td className="pt-2 text-right text-gray-800">₹{fmt(parseFloat(ctc))}</td>
                  <td className="hidden sm:table-cell" />
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-gray-400">* This is a simplified estimate. Actual take-home may vary based on tax regime, exemptions, and employer policies.</p>
        </div>
      )}
    </div>
  );
}
