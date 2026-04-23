"use client";

import { useState } from "react";

const NOTICE_OPTIONS = [
  { label: "15 days",  days: 15  },
  { label: "1 month",  days: 30  },
  { label: "2 months", days: 60  },
  { label: "3 months", days: 90  },
  { label: "Custom",   days: -1  },
];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function daysBetween(a: Date, b: Date) {
  return Math.round(Math.abs((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function NoticePeriodCalculator() {
  const [resignDate, setResignDate] = useState("");
  const [noticeDays, setNoticeDays] = useState(30);
  const [customDays, setCustomDays] = useState("");
  const [useCustom, setUseCustom]   = useState(false);
  const [buyout, setBuyout]         = useState(false);
  const [salary, setSalary]         = useState("");

  const effectiveDays = useCustom ? parseInt(customDays) || 0 : noticeDays;
  const result = resignDate && effectiveDays > 0
    ? (() => {
        const start      = new Date(resignDate);
        const lastDay    = addDays(start, effectiveDays);
        const remaining  = daysBetween(new Date(), lastDay);
        const buyoutCost = salary ? Math.round((parseFloat(salary) / 30) * effectiveDays) : null;
        return { start, lastDay, remaining, buyoutCost };
      })()
    : null;

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Resignation Date</label>
          <input
            type="date"
            value={resignDate} onChange={(e) => setResignDate(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notice Period</label>
          <select
            value={useCustom ? -1 : noticeDays}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v === -1) { setUseCustom(true); }
              else { setUseCustom(false); setNoticeDays(v); }
            }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {NOTICE_OPTIONS.map((o) => (
              <option key={o.days} value={o.days}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {useCustom && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Custom Notice Period (days)</label>
          <input
            type="number" min="1" max="365" placeholder="e.g. 45"
            value={customDays} onChange={(e) => setCustomDays(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="checkbox" id="buyout" checked={buyout}
          onChange={(e) => setBuyout(e.target.checked)}
          className="w-4 h-4 rounded accent-blue-600"
        />
        <label htmlFor="buyout" className="text-sm text-gray-700 dark:text-gray-300">Calculate notice buyout cost</label>
      </div>

      {buyout && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monthly Salary (₹)</label>
          <input
            type="number" min="0" placeholder="e.g. 80000"
            value={salary} onChange={(e) => setSalary(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6">
            <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-3">Notice Period Results</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Resignation Date</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{formatDate(result.start)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Last Working Day</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatDate(result.lastDay)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Notice Period</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{effectiveDays} days</span>
              </div>
              {result.remaining >= 0 && (
                <div className="flex justify-between items-center pt-1 border-t border-blue-200 dark:border-blue-700">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Days Remaining</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{result.remaining} days from today</span>
                </div>
              )}
            </div>
          </div>

          {buyout && result.buyoutCost !== null && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Notice Buyout Cost</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Salary ÷ 30 × {effectiveDays} days</p>
              </div>
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">₹{new Intl.NumberFormat("en-IN").format(result.buyoutCost)}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p className="font-semibold text-gray-600 dark:text-gray-300 mb-1">Things to remember</p>
        <p>• Your employment contract defines the official notice period</p>
        <p>• Weekends/holidays are usually counted unless your contract says otherwise</p>
        <p>• Both parties can mutually agree to a shorter notice period</p>
        <p>• Buyout = you pay; "garden leave" = employer asks you to stay home but still pays</p>
      </div>
    </div>
  );
}
