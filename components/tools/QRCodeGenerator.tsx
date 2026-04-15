"use client";

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Download, RefreshCw } from "lucide-react";

const ERROR_LEVELS = [
  { value: "L", label: "L — Low (7%)" },
  { value: "M", label: "M — Medium (15%)" },
  { value: "Q", label: "Q — Quartile (25%)" },
  { value: "H", label: "H — High (30%)" },
];

export default function QRCodeGenerator() {
  const [text, setText] = useState("https://");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [dataURL, setDataURL] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function generate(t: string, w: number, ecl: string) {
    if (!t.trim()) { setDataURL(""); return; }
    setGenerating(true);
    try {
      const url = await QRCode.toDataURL(t, {
        width: w,
        errorCorrectionLevel: ecl as "L" | "M" | "Q" | "H",
        margin: 2,
      });
      setDataURL(url);
    } catch {
      setDataURL("");
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => generate(text, size, errorLevel), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [text, size, errorLevel]);

  function handleDownload() {
    if (!dataURL) return;
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "qrcode.png";
    a.click();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Text or URL</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://example.com"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Size: <span className="text-emerald-600 font-bold">{size}px</span>
            </label>
            <input
              type="range"
              min={128}
              max={512}
              step={16}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>128px</span><span>512px</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Error Correction Level</label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {ERROR_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 min-h-[200px] justify-center">
        {generating && (
          <div className="flex items-center gap-2 text-gray-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Generating…</span>
          </div>
        )}
        {!generating && dataURL && (
          <img
            src={dataURL}
            alt="QR Code"
            style={{ width: size / 2, height: size / 2 }}
            className="rounded-xl shadow-sm"
          />
        )}
        {!generating && !dataURL && (
          <p className="text-gray-400 text-sm">Enter text above to generate a QR code</p>
        )}
      </div>

      {dataURL && (
        <button
          onClick={handleDownload}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 w-full justify-center"
        >
          <Download className="w-4 h-4" />
          Download PNG
        </button>
      )}
    </div>
  );
}
