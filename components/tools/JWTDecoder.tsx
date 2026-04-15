"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

function parseJWT(token: string): {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  error: string;
} {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: "", error: "Invalid JWT: expected 3 parts separated by dots." };
  }
  try {
    const header = JSON.parse(base64urlDecode(parts[0]));
    const payload = JSON.parse(base64urlDecode(parts[1]));
    return { header, payload, signature: parts[2], error: "" };
  } catch {
    return { header: null, payload: null, signature: "", error: "Invalid JWT: could not decode or parse." };
  }
}

function SyntaxHighlight({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data, null, 2);
  const highlighted = json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-yellow-300";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-blue-300";
        } else {
          cls = "text-green-300";
        }
      } else if (/true|false/.test(match)) {
        cls = "text-purple-300";
      } else if (/null/.test(match)) {
        cls = "text-red-300";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
  return (
    <pre
      className="text-xs font-mono whitespace-pre-wrap break-all"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

export default function JWTDecoder() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const { header, payload, signature, error } = token.trim()
    ? parseJWT(token)
    : { header: null, payload: null, signature: "", error: "" };

  function getExpiryInfo(): { label: string; status: "valid" | "expired" | null } {
    if (!payload || typeof payload.exp !== "number") return { label: "", status: null };
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    return {
      label: `Expires: ${expDate.toUTCString()}`,
      status: expDate < now ? "expired" : "valid",
    };
  }

  const expiry = getExpiryInfo();

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          JWT Token
        </label>
        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here…"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      {header && payload && (
        <div className="space-y-4">
          {/* Expiry badge */}
          {expiry.status && (
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                expiry.status === "valid"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  expiry.status === "valid" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {expiry.label} —{" "}
              {expiry.status === "valid" ? "Token is valid" : "Token is EXPIRED"}
            </div>
          )}

          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700">Header</span>
              <button
                onClick={() => copyText(JSON.stringify(header, null, 2), "header")}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {copied === "header" ? <Check size={12} /> : <Copy size={12} />}
                {copied === "header" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <SyntaxHighlight data={header} />
            </div>
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700">Payload</span>
              <button
                onClick={() => copyText(JSON.stringify(payload, null, 2), "payload")}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {copied === "payload" ? <Check size={12} /> : <Copy size={12} />}
                {copied === "payload" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-4">
              <SyntaxHighlight data={payload} />
            </div>
          </div>

          {/* Signature */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700">Signature</span>
              <button
                onClick={() => copyText(signature, "sig")}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors"
              >
                {copied === "sig" ? <Check size={12} /> : <Copy size={12} />}
                {copied === "sig" ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm text-orange-300 break-all">
              {signature}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
