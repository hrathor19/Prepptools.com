"use client";

import { useState } from "react";

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [result, setResult] = useState<{ fuelNeeded: number; totalCost: number; costPerKm: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    setError("");
    setResult(null);
    const d = parseFloat(distance);
    const e = parseFloat(efficiency);
    const p = parseFloat(fuelPrice);
    if (!d || !e || !p || isNaN(d) || isNaN(e) || isNaN(p) || d <= 0 || e <= 0 || p <= 0) {
      setError("Please enter valid positive values for all fields.");
      return;
    }
    const fuelNeeded = d / e;
    const totalCost = fuelNeeded * p;
    const costPerKm = totalCost / d;
    setResult({ fuelNeeded, totalCost, costPerKm });
  };

  const fmt = (n: number, decimals = 2) => n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Distance (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g. 150"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Fuel Efficiency (km/L)</label>
          <input
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            placeholder="e.g. 15"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Fuel Price (per litre)</label>
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            placeholder="e.g. 105"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">{fmt(result.fuelNeeded)} L</p>
              <p className="text-xs text-gray-500 mt-1">Fuel Needed</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">₹{fmt(result.totalCost)}</p>
              <p className="text-xs text-gray-500 mt-1">Total Cost</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-700">₹{fmt(result.costPerKm)}</p>
              <p className="text-xs text-gray-500 mt-1">Cost per km</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 space-y-1">
            <p>For <span className="font-semibold">{distance} km</span> at <span className="font-semibold">{efficiency} km/L</span>, you need <span className="font-semibold">{fmt(result.fuelNeeded)} litres</span> of fuel.</p>
            <p>At ₹{fuelPrice}/litre, the total trip cost is <span className="font-semibold text-blue-700">₹{fmt(result.totalCost)}</span>.</p>
          </div>
        </div>
      )}
    </div>
  );
}
