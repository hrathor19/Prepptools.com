"use client";

import { useState } from "react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

  const result = (() => {
    if (!dob || !toDate) return null;
    const birth = new Date(dob);
    const to = new Date(toDate);
    if (birth >= to) return null;

    let years = to.getFullYear() - birth.getFullYear();
    let months = to.getMonth() - birth.getMonth();
    let days = to.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((to.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    const nextBirthday = new Date(to.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < to) nextBirthday.setFullYear(to.getFullYear() + 1);
    const daysUntilBirthday = Math.floor((nextBirthday.getTime() - to.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, totalMinutes, daysUntilBirthday };
  })();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Age on Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {/* Main result */}
          <div className="bg-rose-500 rounded-xl p-6 text-center text-white">
            <p className="text-sm text-rose-100 mb-2">Your Age</p>
            <p className="text-4xl font-bold">
              {result.years} <span className="text-2xl">yrs</span>{" "}
              {result.months} <span className="text-2xl">mo</span>{" "}
              {result.days} <span className="text-2xl">days</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Days", value: result.totalDays.toLocaleString() },
              { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
              { label: "Total Months", value: result.totalMonths.toLocaleString() },
              { label: "Total Hours", value: result.totalHours.toLocaleString() },
              { label: "Total Minutes", value: result.totalMinutes.toLocaleString() },
              { label: "Days to Birthday", value: result.daysUntilBirthday === 0 ? "🎉 Today!" : `${result.daysUntilBirthday} days` },
            ].map((stat) => (
              <div key={stat.label} className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-rose-700">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!dob && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
          <p className="text-4xl mb-3">🎂</p>
          <p className="text-sm">Enter your date of birth to calculate your age</p>
        </div>
      )}
    </div>
  );
}
