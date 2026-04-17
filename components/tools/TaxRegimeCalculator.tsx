"use client";

import { useState, useMemo } from "react";

function fmt(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function calcTaxOld(taxableIncome: number) {
  let tax = 0;
  if (taxableIncome <= 250000) tax = 0;
  else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
  else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.20;
  else tax = 112500 + (taxableIncome - 1000000) * 0.30;
  // 87A rebate: if taxable income ≤ 5L, full rebate
  if (taxableIncome <= 500000) tax = 0;
  return tax * 1.04; // 4% cess
}

function calcTaxNew(taxableIncome: number) {
  let tax = 0;
  const slabs = [
    { upto: 400000, rate: 0 },
    { upto: 800000, rate: 0.05 },
    { upto: 1200000, rate: 0.10 },
    { upto: 1600000, rate: 0.15 },
    { upto: 2000000, rate: 0.20 },
    { upto: 2400000, rate: 0.25 },
    { upto: Infinity, rate: 0.30 },
  ];
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const chunk = Math.min(taxableIncome, slab.upto) - prev;
    tax += chunk * slab.rate;
    prev = slab.upto;
  }
  // 87A rebate: if taxable income ≤ 12L, full rebate
  if (taxableIncome <= 1200000) tax = 0;
  return tax * 1.04; // 4% cess
}

function Row({ label, old, newVal, highlight }: { label: string; old: string; newVal: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? "bg-blue-50 dark:bg-blue-900/20 font-semibold" : ""}>
      <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">{label}</td>
      <td className="px-4 py-2.5 text-sm text-center text-gray-800 dark:text-gray-100">{old}</td>
      <td className="px-4 py-2.5 text-sm text-center text-gray-800 dark:text-gray-100">{newVal}</td>
    </tr>
  );
}

export default function TaxRegimeCalculator() {
  const [income, setIncome] = useState("");
  const [isSalaried, setIsSalaried] = useState(true);
  const [d80C, setD80C] = useState("");
  const [hra, setHra] = useState("");
  const [d80D, setD80D] = useState("");
  const [other, setOther] = useState("");

  const result = useMemo(() => {
    const gross = parseFloat(income) || 0;
    if (gross <= 0) return null;

    // Old regime
    const stdOld = isSalaried ? 50000 : 0;
    const deductions80C = Math.min(parseFloat(d80C) || 0, 150000);
    const hraEx = parseFloat(hra) || 0;
    const deductions80D = parseFloat(d80D) || 0;
    const otherDed = parseFloat(other) || 0;
    const totalOldDed = stdOld + deductions80C + hraEx + deductions80D + otherDed;
    const taxableOld = Math.max(0, gross - totalOldDed);
    const taxOld = calcTaxOld(taxableOld);

    // New regime
    const stdNew = isSalaried ? 75000 : 0;
    const taxableNew = Math.max(0, gross - stdNew);
    const taxNew = calcTaxNew(taxableNew);

    const savings = taxOld - taxNew;
    const better = savings > 0 ? "new" : savings < 0 ? "old" : "equal";

    return {
      gross,
      taxableOld, taxOld, totalOldDed,
      taxableNew, taxNew, stdNew,
      savings: Math.abs(savings),
      better,
    };
  }, [income, isSalaried, d80C, hra, d80D, other]);

  const inputCls = "w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      {/* FY notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
        Calculations based on <strong>FY 2025–26</strong> (AY 2026–27) tax slabs including Budget 2025 changes. New regime: no tax up to ₹12 lakh income.
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Gross Annual Income (₹)</label>
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g. 1200000" min="0" className={inputCls} />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input id="salaried" type="checkbox" checked={isSalaried} onChange={(e) => setIsSalaried(e.target.checked)} className="w-4 h-4 accent-blue-600" />
          <label htmlFor="salaried" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            I am a salaried employee <span className="text-gray-400 font-normal">(standard deduction applies)</span>
          </label>
        </div>
      </div>

      {/* Old Regime Deductions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Old Regime Deductions <span className="text-gray-400 font-normal">(leave blank if not applicable)</span></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Section 80C (max ₹1,50,000)</label>
            <input type="number" value={d80C} onChange={(e) => setD80C(e.target.value)} placeholder="PPF, ELSS, LIC…" min="0" max="150000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>HRA Exemption (₹)</label>
            <input type="number" value={hra} onChange={(e) => setHra(e.target.value)} placeholder="House rent allowance" min="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Section 80D — Medical Insurance (₹)</label>
            <input type="number" value={d80D} onChange={(e) => setD80D(e.target.value)} placeholder="Health insurance premium" min="0" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Other Deductions (₹)</label>
            <input type="number" value={other} onChange={(e) => setOther(e.target.value)} placeholder="NPS, home loan interest…" min="0" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Winner banner */}
          <div className={`rounded-xl px-5 py-4 border ${
            result.better === "new"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
              : result.better === "old"
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
              : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          }`}>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {result.better === "new" && `✅ New Regime saves you ${fmt(result.savings)} this year`}
              {result.better === "old" && `✅ Old Regime saves you ${fmt(result.savings)} this year`}
              {result.better === "equal" && "Both regimes result in the same tax."}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {result.better === "new" && "Consider switching to the new tax regime."}
              {result.better === "old" && "Stick with the old regime to maximize deductions."}
            </p>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide">
                  <th className="px-4 py-3 text-left">Details</th>
                  <th className="px-4 py-3 text-center">Old Regime</th>
                  <th className="px-4 py-3 text-center">New Regime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
                <Row label="Gross Income" old={fmt(result.gross)} newVal={fmt(result.gross)} />
                <Row label="Standard Deduction" old={isSalaried ? fmt(50000) : "—"} newVal={isSalaried ? fmt(75000) : "—"} />
                <Row label="80C + HRA + 80D + Other" old={fmt(result.totalOldDed - (isSalaried ? 50000 : 0))} newVal="Not allowed" />
                <Row label="Taxable Income" old={fmt(result.taxableOld)} newVal={fmt(result.taxableNew)} />
                <Row label="87A Rebate" old={result.taxableOld <= 500000 ? "Full rebate" : "—"} newVal={result.taxableNew <= 1200000 ? "Full rebate" : "—"} />
                <Row label="Total Tax (incl. 4% cess)" old={fmt(result.taxOld)} newVal={fmt(result.taxNew)} highlight />
                <Row label="Monthly TDS" old={fmt(result.taxOld / 12)} newVal={fmt(result.taxNew / 12)} />
              </tbody>
            </table>
          </div>

          {/* Slab info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Old Regime Slabs</p>
              <p>0 – ₹2.5L → 0% · ₹2.5L – ₹5L → 5%</p>
              <p>₹5L – ₹10L → 20% · Above ₹10L → 30%</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">New Regime Slabs (Budget 2025)</p>
              <p>0–₹4L: 0% · ₹4L–₹8L: 5% · ₹8L–₹12L: 10%</p>
              <p>₹12L–₹16L: 15% · ₹16L–₹20L: 20% · ₹20L–₹24L: 25% · &gt;₹24L: 30%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
