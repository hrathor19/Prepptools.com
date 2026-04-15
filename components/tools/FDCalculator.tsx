"use client";

import { useState } from "react";

export default function FDCalculator() {
  const [tab, setTab] = useState<"fd" | "rd">("fd");

  // FD state
  const [fdPrincipal, setFdPrincipal] = useState("");
  const [fdRate, setFdRate] = useState("");
  const [fdTenure, setFdTenure] = useState("");
  const [fdCompounding, setFdCompounding] = useState<"quarterly" | "monthly" | "annually">("quarterly");
  const [fdResult, setFdResult] = useState<{ maturity: number; interest: number } | null>(null);
  const [fdError, setFdError] = useState("");

  // RD state
  const [rdDeposit, setRdDeposit] = useState("");
  const [rdRate, setRdRate] = useState("");
  const [rdTenure, setRdTenure] = useState("");
  const [rdResult, setRdResult] = useState<{ totalDeposited: number; maturity: number } | null>(null);
  const [rdError, setRdError] = useState("");

  const compoundingMap = { quarterly: 4, monthly: 12, annually: 1 };

  const calculateFD = () => {
    setFdError("");
    setFdResult(null);
    const P = parseFloat(fdPrincipal);
    const r = parseFloat(fdRate) / 100;
    const t = parseFloat(fdTenure);
    if (!P || !r || !t || isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || r <= 0 || t <= 0) {
      setFdError("Please enter valid positive values.");
      return;
    }
    const n = compoundingMap[fdCompounding];
    const maturity = P * Math.pow(1 + r / n, n * t);
    setFdResult({ maturity, interest: maturity - P });
  };

  const calculateRD = () => {
    setRdError("");
    setRdResult(null);
    const R = parseFloat(rdDeposit);
    const rate = parseFloat(rdRate);
    const n = parseFloat(rdTenure);
    if (!R || !rate || !n || isNaN(R) || isNaN(rate) || isNaN(n) || R <= 0 || rate <= 0 || n <= 0) {
      setRdError("Please enter valid positive values.");
      return;
    }
    const i = rate / 400;
    const maturity = R * ((Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
    const totalDeposited = R * n;
    setRdResult({ totalDeposited, maturity });
  };

  const fmt = (n: number) =>
    n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const selectClass = "border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white";

  return (
    <div className="space-y-6">
      <div className="flex rounded-xl border border-gray-200 overflow-hidden w-fit">
        {([["fd", "Fixed Deposit (FD)"], ["rd", "Recurring Deposit (RD)"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors ${
              tab === key ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "fd" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Principal Amount (₹)</label>
              <input type="number" value={fdPrincipal} onChange={(e) => setFdPrincipal(e.target.value)} placeholder="e.g. 100000" className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Interest Rate (%)</label>
              <input type="number" step="0.1" value={fdRate} onChange={(e) => setFdRate(e.target.value)} placeholder="e.g. 7" className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tenure (years)</label>
              <input type="number" step="0.5" value={fdTenure} onChange={(e) => setFdTenure(e.target.value)} placeholder="e.g. 3" className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Compounding</label>
              <select value={fdCompounding} onChange={(e) => setFdCompounding(e.target.value as typeof fdCompounding)} className={selectClass}>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
          {fdError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{fdError}</p>}
          <button onClick={calculateFD} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Calculate</button>
          {fdResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Maturity Amount</p>
                <p className="text-2xl font-bold text-blue-700">₹{fmt(fdResult.maturity)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Interest Earned</p>
                <p className="text-2xl font-bold text-green-700">₹{fmt(fdResult.interest)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "rd" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Deposit (₹)</label>
              <input type="number" value={rdDeposit} onChange={(e) => setRdDeposit(e.target.value)} placeholder="e.g. 5000" className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Interest Rate (%)</label>
              <input type="number" step="0.1" value={rdRate} onChange={(e) => setRdRate(e.target.value)} placeholder="e.g. 6.5" className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tenure (months)</label>
              <input type="number" value={rdTenure} onChange={(e) => setRdTenure(e.target.value)} placeholder="e.g. 24" className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full" />
            </div>
          </div>
          {rdError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{rdError}</p>}
          <button onClick={calculateRD} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Calculate</button>
          {rdResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Deposited</p>
                <p className="text-2xl font-bold text-blue-700">₹{fmt(rdResult.totalDeposited)}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Maturity Amount</p>
                <p className="text-2xl font-bold text-green-700">₹{fmt(rdResult.maturity)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
