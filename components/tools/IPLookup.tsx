"use client";
import { useEffect, useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";

type IPInfo = {
  ip: string; country: string; countryCode: string;
  region: string; city: string; isp: string;
  timezone: string; latitude: number; longitude: number;
};

export default function IPLookup() {
  const [info, setInfo]       = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);

  async function lookup() {
    setLoading(true); setError(""); setInfo(null);
    try {
      const res  = await fetch("/api/ip");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInfo(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not fetch IP info.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { lookup(); }, []);

  function copyIP() {
    if (!info) return;
    navigator.clipboard.writeText(info.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const rows = info ? [
    { label: "Country",     value: `${info.country} (${info.countryCode})` },
    { label: "Region",      value: info.region },
    { label: "City",        value: info.city },
    { label: "ISP / Org",   value: info.isp },
    { label: "Timezone",    value: info.timezone },
    { label: "Coordinates", value: `${info.latitude}, ${info.longitude}` },
  ] : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Your public IP address and location</p>
        <button onClick={lookup}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 py-10 justify-center text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Looking up your IP…</span>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {info && !loading && (
        <>
          {/* IP hero */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-blue-500 mb-0.5">IP Address</p>
              <p className="text-3xl font-bold font-mono text-blue-900">{info.ip}</p>
            </div>
            <button onClick={copyIP}
              className="flex items-center gap-1.5 bg-white border border-blue-200 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors shrink-0">
              {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
            </button>
          </div>

          {/* Details table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            {rows.map(({ label, value }, i) => (
              <div key={label}
                className={`flex justify-between items-center px-4 py-3 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="text-gray-900 font-semibold text-right">{value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
        Lookup runs on our server — your IP is never stored or logged.
      </p>
    </div>
  );
}
