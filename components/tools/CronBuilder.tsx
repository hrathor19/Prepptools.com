"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type FieldMode = "every" | "specific" | "range";

interface CronField {
  mode: FieldMode;
  specific: string;
  rangeFrom: string;
  rangeTo: string;
}

const defaultField = (): CronField => ({
  mode: "every",
  specific: "",
  rangeFrom: "",
  rangeTo: "",
});

const FIELDS = [
  { label: "Minute", key: "minute", min: 0, max: 59 },
  { label: "Hour", key: "hour", min: 0, max: 23 },
  { label: "Day of Month", key: "dom", min: 1, max: 31 },
  { label: "Month", key: "month", min: 1, max: 12 },
  { label: "Day of Week", key: "dow", min: 0, max: 6 },
] as const;

type FieldKey = "minute" | "hour" | "dom" | "month" | "dow";

function fieldToExpr(f: CronField): string {
  if (f.mode === "every") return "*";
  if (f.mode === "specific") return f.specific || "*";
  return `${f.rangeFrom || "*"}-${f.rangeTo || "*"}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function buildDescription(
  fields: Record<FieldKey, CronField>,
  expr: string
): string {
  const parts = expr.split(" ");
  const [min, hour, dom, month, dow] = parts;

  const minuteStr = min === "*" ? "every minute" : `minute ${min}`;
  const hourStr = hour === "*" ? "every hour" : `${parseInt(hour) % 12 || 12}:${pad(parseInt(min) || 0)} ${parseInt(hour) >= 12 ? "PM" : "AM"}`;
  const domStr = dom === "*" ? "every day" : `day ${dom}`;
  const monthStr = month === "*" ? "every month" : `month ${month}`;
  const dowStr = dow === "*" ? "every day of week" : `day of week ${dow}`;

  if (min !== "*" && hour !== "*" && dom === "*" && month === "*" && dow === "*") {
    return `Every day at ${hourStr}`;
  }
  if (min === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") {
    return "Every minute";
  }
  if (min !== "*" && hour === "*") {
    return `At minute ${min} of every hour`;
  }
  return `${minuteStr}, ${hourStr}, ${domStr}, ${monthStr}, ${dowStr}`;
}

function getNextRuns(expr: string, count: number): string[] {
  const parts = expr.split(" ");
  if (parts.length !== 5) return [];

  const [minExpr, hourExpr, domExpr, monthExpr, dowExpr] = parts;

  function matchesField(val: number, expr: string, base = 0): boolean {
    if (expr === "*") return true;
    if (expr.includes("-")) {
      const [a, b] = expr.split("-").map(Number);
      return val >= a && val <= b;
    }
    if (expr.includes(",")) {
      return expr.split(",").map(Number).includes(val);
    }
    const n = parseInt(expr);
    return !isNaN(n) && val === n;
  }

  const results: string[] = [];
  const now = new Date();
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);

  let iterations = 0;
  while (results.length < count && iterations < 100000) {
    iterations++;
    const m = now.getMonth() + 1;
    const dom = now.getDate();
    const dow = now.getDay();
    const h = now.getHours();
    const min = now.getMinutes();

    if (
      matchesField(m, monthExpr) &&
      matchesField(dom, domExpr) &&
      matchesField(dow, dowExpr) &&
      matchesField(h, hourExpr) &&
      matchesField(min, minExpr)
    ) {
      results.push(now.toLocaleString());
    }

    now.setMinutes(now.getMinutes() + 1);
  }

  return results;
}

export default function CronBuilder() {
  const [fields, setFields] = useState<Record<FieldKey, CronField>>({
    minute: defaultField(),
    hour: defaultField(),
    dom: defaultField(),
    month: defaultField(),
    dow: defaultField(),
  });
  const [copied, setCopied] = useState(false);

  function updateField(key: FieldKey, patch: Partial<CronField>) {
    setFields((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  const expression = FIELDS.map((f) => fieldToExpr(fields[f.key])).join(" ");
  const description = buildDescription(fields, expression);
  const nextRuns = getNextRuns(expression, 5);

  function copyExpr() {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Field builders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIELDS.map((fieldDef) => {
          const f = fields[fieldDef.key];
          return (
            <div
              key={fieldDef.key}
              className="border border-gray-200 rounded-xl p-4 space-y-3"
            >
              <span className="text-sm font-semibold text-gray-700">
                {fieldDef.label}
                <span className="text-gray-400 text-xs ml-1">
                  ({fieldDef.min}–{fieldDef.max})
                </span>
              </span>

              <div className="flex gap-2 flex-wrap">
                {(["every", "specific", "range"] as FieldMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => updateField(fieldDef.key, { mode: m })}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors capitalize ${
                      f.mode === m
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {m === "every" ? "Every (*)" : m}
                  </button>
                ))}
              </div>

              {f.mode === "specific" && (
                <input
                  type="number"
                  min={fieldDef.min}
                  max={fieldDef.max}
                  value={f.specific}
                  onChange={(e) => updateField(fieldDef.key, { specific: e.target.value })}
                  placeholder={`${fieldDef.min}–${fieldDef.max}`}
                  className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
                />
              )}

              {f.mode === "range" && (
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={fieldDef.min}
                    max={fieldDef.max}
                    value={f.rangeFrom}
                    onChange={(e) => updateField(fieldDef.key, { rangeFrom: e.target.value })}
                    placeholder="From"
                    className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
                  />
                  <span className="text-gray-400 text-sm">–</span>
                  <input
                    type="number"
                    min={fieldDef.min}
                    max={fieldDef.max}
                    value={f.rangeTo}
                    onChange={(e) => updateField(fieldDef.key, { rangeTo: e.target.value })}
                    placeholder="To"
                    className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expression display */}
      <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm flex items-center justify-between gap-4">
        <span className="text-lg tracking-widest">{expression}</span>
        <button
          onClick={copyExpr}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-300 transition-colors shrink-0"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Human-readable description */}
      <div className="border border-indigo-100 bg-indigo-50 rounded-xl px-4 py-3">
        <p className="text-sm text-indigo-800 font-medium">{description}</p>
      </div>

      {/* Next 5 run times */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Next 5 Run Times</h3>
        {nextRuns.length === 0 ? (
          <p className="text-sm text-gray-400">Could not calculate run times for this expression.</p>
        ) : (
          <ul className="space-y-1.5">
            {nextRuns.map((run, i) => (
              <li
                key={i}
                className="text-sm font-mono text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-4 py-2"
              >
                {i + 1}. {run}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
