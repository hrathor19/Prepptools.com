"use client";

import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(
  length: number,
  opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }
): string {
  let pool = "";
  if (opts.upper) pool += CHARS.upper;
  if (opts.lower) pool += CHARS.lower;
  if (opts.numbers) pool += CHARS.numbers;
  if (opts.symbols) pool += CHARS.symbols;
  if (!pool) pool = CHARS.lower;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += pool[Math.floor(Math.random() * pool.length)];
  }
  return password;
}

function getStrength(pw: string): { label: string; color: string; width: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (score <= 4) return { label: "Fair", color: "bg-amber-500", width: "w-2/4" };
  if (score <= 5) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = useCallback(() => {
    if (count === 1) {
      setPassword(generatePassword(length, opts));
      setPasswords([]);
    } else {
      const list = Array.from({ length: count }, () => generatePassword(length, opts));
      setPasswords(list);
      setPassword("");
    }
  }, [length, opts, count]);

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Length: <span className="text-indigo-600 font-bold">{length}</span>
          </label>
          <input type="range" min={6} max={64} value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-indigo-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>6</span><span>64</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Generate</label>
          <div className="flex gap-2">
            {[1, 5, 10].map((n) => (
              <button key={n} onClick={() => setCount(n)}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  count === n ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200"
                }`}>
                {n === 1 ? "1 password" : `${n} passwords`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Character Types */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(opts) as (keyof typeof opts)[]).map((key) => (
          <button key={key} onClick={() => setOpts((o) => ({ ...o, [key]: !o[key] }))}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              opts[key] ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-gray-200 text-gray-400"
            }`}>
            <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${opts[key] ? "bg-indigo-600 text-white" : "border border-gray-300"}`}>
              {opts[key] ? "✓" : ""}
            </span>
            <span className="capitalize">{key}</span>
          </button>
        ))}
      </div>

      <button onClick={generate}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4" />
        Generate Password{count > 1 ? "s" : ""}
      </button>

      {/* Single Password */}
      {password && (
        <div className="space-y-3">
          <div className="relative">
            <div className="bg-gray-900 text-green-400 font-mono text-base rounded-xl px-5 py-4 pr-12 break-all">
              {password}
            </div>
            <button onClick={() => copyText(password)}
              className="absolute top-3 right-3 p-2 rounded-lg bg-gray-700 text-gray-300 hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {strength && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Password strength</span>
                <span className="font-medium">{strength.label}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Multiple Passwords */}
      {passwords.length > 0 && (
        <div className="space-y-2">
          {passwords.map((pw, i) => (
            <div key={i} className="relative flex items-center bg-gray-900 rounded-xl px-5 py-3 pr-12">
              <span className="font-mono text-sm text-green-400 break-all">{pw}</span>
              <button onClick={() => copyText(pw)}
                className="absolute right-3 p-1.5 rounded-lg bg-gray-700 text-gray-300 hover:text-white transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
