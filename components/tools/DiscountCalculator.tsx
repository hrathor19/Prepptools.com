"use client";

import { useState, useMemo } from "react";

type Tab = "calculate" | "find";

export default function DiscountCalculator() {
  const [tab, setTab] = useState<Tab>("calculate");

  // Tab 1 — Calculate Discount
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

  // Tab 2 — Find Discount %
  const [findOriginal, setFindOriginal] = useState("");
  const [findFinal, setFindFinal] = useState("");

  function fmt(n: number) {
    return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const calcResult = useMemo(() => {
    const orig = parseFloat(originalPrice);
    const pct = parseFloat(discountPercent);
    if (!originalPrice || !discountPercent || isNaN(orig) || isNaN(pct) || orig <= 0 || pct < 0 || pct > 100) return null;
    const discountAmt = (orig * pct) / 100;
    const finalPrice = orig - discountAmt;
    return { discountAmt, finalPrice, savings: discountAmt };
  }, [originalPrice, discountPercent]);

  const findResult = useMemo(() => {
    const orig = parseFloat(findOriginal);
    const fin = parseFloat(findFinal);
    if (!findOriginal || !findFinal || isNaN(orig) || isNaN(fin) || orig <= 0 || fin < 0 || fin > orig) return null;
    const pct = ((orig - fin) / orig) * 100;
    const saved = orig - fin;
    return { pct, saved };
  }, [findOriginal, findFinal]);

  return (
    <div className="space-y-6">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {([
          { key: "calculate", label: "Calculate Discount" },
          { key: "find", label: "Find Discount %" },
        ] as { key: Tab; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "calculate" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="e.g. 1000"
                min="0"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Discount %
              </label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="e.g. 20"
                min="0"
                max="100"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {calcResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">Results</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Discount Amount</p>
                  <p className="text-xl font-bold text-red-600">-₹{fmt(calcResult.discountAmt)}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Final Price</p>
                  <p className="text-xl font-bold text-gray-800">₹{fmt(calcResult.finalPrice)}</p>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">You Save</p>
                  <p className="text-xl font-bold text-green-700">₹{fmt(calcResult.savings)}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">{discountPercent}% off</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "find" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={findOriginal}
                onChange={(e) => setFindOriginal(e.target.value)}
                placeholder="e.g. 1000"
                min="0"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Final Price (₹)
              </label>
              <input
                type="number"
                value={findFinal}
                onChange={(e) => setFindFinal(e.target.value)}
                placeholder="e.g. 800"
                min="0"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {findResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">Results</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Discount Applied</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {findResult.pct.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">off original price</p>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Amount Saved</p>
                  <p className="text-3xl font-bold text-green-700">₹{fmt(findResult.saved)}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">You saved this much!</p>
                </div>
              </div>
            </div>
          )}

          {findOriginal && findFinal && !findResult && (
            <p className="text-sm text-red-500">
              Final price must be less than or equal to original price.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
