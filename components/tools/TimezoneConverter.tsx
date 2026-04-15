"use client";
import { useState } from "react";

const ZONES = [
  { label: "UTC", zone: "UTC" },
  { label: "New York (EST/EDT)", zone: "America/New_York" },
  { label: "Los Angeles (PST/PDT)", zone: "America/Los_Angeles" },
  { label: "Chicago (CST/CDT)", zone: "America/Chicago" },
  { label: "London (GMT/BST)", zone: "Europe/London" },
  { label: "Paris (CET/CEST)", zone: "Europe/Paris" },
  { label: "Berlin (CET/CEST)", zone: "Europe/Berlin" },
  { label: "Moscow (MSK)", zone: "Europe/Moscow" },
  { label: "Dubai (GST)", zone: "Asia/Dubai" },
  { label: "Mumbai (IST)", zone: "Asia/Kolkata" },
  { label: "Dhaka (BST)", zone: "Asia/Dhaka" },
  { label: "Bangkok (ICT)", zone: "Asia/Bangkok" },
  { label: "Singapore (SGT)", zone: "Asia/Singapore" },
  { label: "Beijing/Shanghai (CST)", zone: "Asia/Shanghai" },
  { label: "Tokyo (JST)", zone: "Asia/Tokyo" },
  { label: "Seoul (KST)", zone: "Asia/Seoul" },
  { label: "Sydney (AEDT/AEST)", zone: "Australia/Sydney" },
  { label: "Auckland (NZST)", zone: "Pacific/Auckland" },
  { label: "São Paulo (BRT)", zone: "America/Sao_Paulo" },
  { label: "Buenos Aires (ART)", zone: "America/Argentina/Buenos_Aires" },
];

const CITIES = ["UTC","America/New_York","Europe/London","Asia/Dubai","Asia/Kolkata","Asia/Singapore","Asia/Tokyo","Australia/Sydney"];

function convert(dt: string, from: string, to: string) {
  if (!dt) return "";
  try {
    const d = new Date(dt);
    const fromOffset = new Date(d.toLocaleString("en-US", { timeZone: from }));
    const diff = d.getTime() - fromOffset.getTime();
    const adjusted = new Date(d.getTime() + diff);
    return adjusted.toLocaleString("en-US", { timeZone: to, dateStyle: "medium", timeStyle: "short" });
  } catch { return "Invalid"; }
}

function cityTime(dt: string, from: string, zone: string) {
  if (!dt) return "—";
  try {
    const d = new Date(dt);
    return d.toLocaleString("en-US", { timeZone: zone, timeStyle: "short", dateStyle: "short" });
  } catch { return "—"; }
}

export default function TimezoneConverter() {
  const now = new Date();
  now.setSeconds(0, 0);
  const localNow = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}T${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;

  const [dt, setDt] = useState(localNow);
  const [from, setFrom] = useState("Asia/Kolkata");
  const [to, setTo] = useState("America/New_York");

  const result = convert(dt, from, to);

  const sel = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time</label>
          <input type="datetime-local" value={dt} onChange={e => setDt(e.target.value)} className={sel} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)} className={sel}>
            {ZONES.map(z => <option key={z.zone} value={z.zone}>{z.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">To</label>
          <select value={to} onChange={e => setTo(e.target.value)} className={sel}>
            {ZONES.map(z => <option key={z.zone} value={z.zone}>{z.label}</option>)}
          </select>
        </div>
      </div>

      {dt && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-500 mb-1">Converted time</p>
          <p className="text-2xl font-bold text-slate-800">{result}</p>
          <p className="text-xs text-slate-400 mt-1">{ZONES.find(z=>z.zone===to)?.label}</p>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Same moment in major cities</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CITIES.map(zone => (
            <div key={zone} className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-center">
              <p className="text-xs text-gray-400 mb-0.5">{zone.split("/").pop()?.replace("_"," ")}</p>
              <p className="text-sm font-semibold text-gray-800">{cityTime(dt, from, zone)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
