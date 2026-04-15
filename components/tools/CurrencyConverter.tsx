"use client";

import { useState, useEffect } from "react";

const CURRENCIES = [
  "USD", "EUR", "GBP", "INR", "JPY", "CAD", "AUD", "CHF", "CNY", "HKD",
  "SGD", "NZD", "SEK", "NOK", "DKK", "MXN", "BRL", "ZAR", "AED", "SAR",
  "KRW", "THB", "MYR", "IDR", "TRY", "PLN", "CZK", "HUF", "PHP", "NGN",
];

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar", EUR: "Euro", GBP: "British Pound", INR: "Indian Rupee",
  JPY: "Japanese Yen", CAD: "Canadian Dollar", AUD: "Australian Dollar",
  CHF: "Swiss Franc", CNY: "Chinese Yuan", HKD: "Hong Kong Dollar",
  SGD: "Singapore Dollar", NZD: "New Zealand Dollar", SEK: "Swedish Krona",
  NOK: "Norwegian Krone", DKK: "Danish Krone", MXN: "Mexican Peso",
  BRL: "Brazilian Real", ZAR: "South African Rand", AED: "UAE Dirham",
  SAR: "Saudi Riyal", KRW: "South Korean Won", THB: "Thai Baht",
  MYR: "Malaysian Ringgit", IDR: "Indonesian Rupiah", TRY: "Turkish Lira",
  PLN: "Polish Zloty", CZK: "Czech Koruna", HUF: "Hungarian Forint",
  PHP: "Philippine Peso", NGN: "Nigerian Naira",
};

interface Rates {
  [key: string]: number;
}

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setFetchError("");
        const res = await fetch("https://api.frankfurter.app/latest?base=USD");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRates({ USD: 1, ...data.rates });
        setLastUpdated(data.date);
      } catch {
        setFetchError("Unable to fetch exchange rates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const getRate = (currency: string) => {
    if (!rates) return 1;
    return rates[currency] ?? 1;
  };

  const converted = (() => {
    const amt = parseFloat(amount);
    if (!rates || isNaN(amt) || amt <= 0) return null;
    const inUSD = amt / getRate(from);
    return inUSD * getRate(to);
  })();

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const selectClass = "border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full bg-white";

  return (
    <div className="space-y-6">
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center text-sm text-blue-600">
          Loading exchange rates...
        </div>
      )}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
          {fetchError}
        </div>
      )}
      {!loading && !fetchError && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 100"
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">From</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c} — {CURRENCY_NAMES[c]}</option>
                ))}
              </select>
            </div>
            <button
              onClick={swap}
              className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
              title="Swap currencies"
            >
              ⇄
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">To</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c} — {CURRENCY_NAMES[c]}</option>
                ))}
              </select>
            </div>
          </div>

          {converted !== null && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              <p className="text-xs text-gray-500">Converted Amount</p>
              <p className="text-3xl font-bold text-blue-700">
                {converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {to}
              </p>
              <p className="text-sm text-gray-500">
                {parseFloat(amount).toLocaleString()} {from} = {converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {to}
              </p>
              <p className="text-xs text-gray-400">
                1 {from} = {(getRate(to) / getRate(from)).toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })} {to}
              </p>
            </div>
          )}

          {lastUpdated && (
            <p className="text-xs text-gray-400 text-right">
              Rates last updated: {lastUpdated} · Source: Frankfurter API (ECB)
            </p>
          )}
        </>
      )}
    </div>
  );
}
