"use client";
import { useState } from "react";
import { Baby } from "lucide-react";

export default function PregnancyCalculator() {
  const [lmp, setLmp] = useState("");

  const calc = () => {
    if (!lmp) return null;
    const lmpDate = new Date(lmp);
    const now = new Date();
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280);
    const daysPregnant = Math.floor((now.getTime() - lmpDate.getTime()) / 86400000);
    if (daysPregnant < 0) return { error: "LMP date cannot be in the future." };
    if (daysPregnant > 294) return { error: "LMP date is more than 42 weeks ago." };
    const weeks = Math.floor(daysPregnant / 7);
    const days = daysPregnant % 7;
    const trimester = weeks < 13 ? "1st" : weeks < 27 ? "2nd" : "3rd";
    const progress = Math.min((daysPregnant / 280) * 100, 100);
    const t1End = new Date(lmpDate); t1End.setDate(t1End.getDate() + 91);
    const t2End = new Date(lmpDate); t2End.setDate(t2End.getDate() + 189);
    return { dueDate, weeks, days, trimester, progress, t1End, t2End, daysPregnant };
  };

  const r = calc();
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">First Day of Last Menstrual Period (LMP)</label>
        <input type="date" value={lmp} onChange={e => setLmp(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 w-full max-w-xs" />
      </div>

      {r && "error" in r && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{r.error}</p>
      )}

      {r && !("error" in r) && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Current Week", value: `${r.weeks}w ${r.days}d` },
              { label: "Trimester", value: r.trimester },
              { label: "Due Date", value: fmt(r.dueDate) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-center">
                <p className="text-xs text-pink-500 font-medium mb-1">{label}</p>
                <p className="text-base font-bold text-pink-800">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Week 0</span><span>Week 40</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-pink-400 rounded-full transition-all" style={{ width: `${r.progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">{r.progress.toFixed(0)}% complete</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Key Milestones</p>
            {[
              { label: "1st Trimester ends", date: r.t1End },
              { label: "2nd Trimester ends", date: r.t2End },
              { label: "Due Date", date: r.dueDate },
            ].map(({ label, date }) => (
              <div key={label} className="flex justify-between text-sm px-4 py-2 bg-gray-50 rounded-xl">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-800">{fmt(date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
