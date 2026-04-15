"use client";

import { useState } from "react";

export default function DateCalculator() {
  const today = new Date().toISOString().split("T")[0];
  const [date1, setDate1] = useState(today);
  const [date2, setDate2] = useState(today);

  const result = (() => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.round(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Months/years approximate
    let years = Math.abs(d2.getFullYear() - d1.getFullYear());
    let months = Math.abs(d2.getMonth() - d1.getMonth());
    if (months < 0) { years--; months += 12; }

    const earlier = d1 < d2 ? d1 : d2;
    const later = d1 < d2 ? d2 : d1;

    return {
      totalDays,
      weeks,
      remainingDays,
      years,
      months,
      workdays: countWorkdays(earlier, later),
      weekends: Math.round(totalDays * 2 / 7),
      direction: d1 <= d2 ? "after" : "before",
    };
  })();

  function countWorkdays(start: Date, end: Date): number {
    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) count++;
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  }

  const stats = result
    ? [
        { label: "Total Days", value: result.totalDays.toLocaleString() },
        { label: "Weeks + Days", value: `${result.weeks}w ${result.remainingDays}d` },
        { label: "Years + Months", value: `${result.years}y ${result.months}mo` },
        { label: "Workdays", value: result.workdays.toLocaleString() },
        { label: "Weekend Days", value: result.weekends.toLocaleString() },
        { label: "Hours", value: (result.totalDays * 24).toLocaleString() },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
          <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
          <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white" />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-teal-500 rounded-xl p-6 text-center text-white">
            <p className="text-sm text-teal-100">
              {new Date(date1).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              {" → "}
              {new Date(date2).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-5xl font-bold mt-2">{result.totalDays}</p>
            <p className="text-teal-100 text-sm mt-1">days {result.direction === "after" ? "difference" : "apart"}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-teal-700">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
