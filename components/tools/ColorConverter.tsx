"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function isValidHex(hex: string): boolean {
  return /^#?[0-9A-Fa-f]{6}$/.test(hex);
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [copied, setCopied] = useState<string | null>(null);

  const normalizedHex = hex.startsWith("#") ? hex : `#${hex}`;
  const rgb = isValidHex(normalizedHex) ? hexToRgb(normalizedHex) : null;
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const [r, setR] = useState(rgb?.r ?? 0);
  const [g, setG] = useState(rgb?.g ?? 0);
  const [b, setB] = useState(rgb?.b ?? 0);

  useEffect(() => {
    if (rgb) { setR(rgb.r); setG(rgb.g); setB(rgb.b); }
  }, [hex]);

  function updateFromRgb(nr: number, ng: number, nb: number) {
    setR(nr); setG(ng); setB(nb);
    const newHex = `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
    setHex(newHex);
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const colorValues = rgb && hsl ? [
    { label: "HEX", value: normalizedHex.toUpperCase(), key: "hex" },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, key: "rgb" },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, key: "hsl" },
    { label: "R", value: String(rgb.r), key: "r" },
    { label: "G", value: String(rgb.g), key: "g" },
    { label: "B", value: String(rgb.b), key: "b" },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Color Preview & Picker */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-2xl border border-gray-200 shadow-md cursor-pointer"
            style={{ backgroundColor: isValidHex(normalizedHex) ? normalizedHex : "#ffffff" }}
          />
          <input
            type="color"
            value={isValidHex(normalizedHex) ? normalizedHex : "#ffffff"}
            onChange={(e) => setHex(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            title="Pick a color"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">HEX Color Code</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#3b82f6"
            maxLength={7}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* RGB Sliders */}
      {rgb && (
        <div className="space-y-3">
          {[
            { label: "R", value: r, color: "accent-red-500", setter: (v: number) => updateFromRgb(v, g, b) },
            { label: "G", value: g, color: "accent-green-500", setter: (v: number) => updateFromRgb(r, v, b) },
            { label: "B", value: b, color: "accent-blue-500", setter: (v: number) => updateFromRgb(r, g, v) },
          ].map((ch) => (
            <div key={ch.label} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 w-4">{ch.label}</span>
              <input type="range" min={0} max={255} value={ch.value}
                onChange={(e) => ch.setter(Number(e.target.value))}
                className={`flex-1 ${ch.color}`} />
              <span className="text-sm font-mono text-gray-600 w-8 text-right">{ch.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Color Values */}
      {colorValues.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {colorValues.map((cv) => (
            <div key={cv.key}
              className="flex items-center justify-between bg-pink-50 border border-pink-100 rounded-xl px-4 py-2.5">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">{cv.label}</span>
                <p className="text-sm font-mono font-medium text-gray-800">{cv.value}</p>
              </div>
              <button onClick={() => copy(cv.value, cv.key)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-pink-600 transition-colors">
                {copied === cv.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Shades */}
      {isValidHex(normalizedHex) && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Color Shades</p>
          <div className="grid grid-cols-5 gap-1.5">
            {[0.9, 0.7, 0.5, 0.3, 0.1].map((factor, i) => {
              const shade = rgb
                ? `rgb(${Math.round(rgb.r + (255 - rgb.r) * factor)},${Math.round(rgb.g + (255 - rgb.g) * factor)},${Math.round(rgb.b + (255 - rgb.b) * factor)})`
                : "white";
              return (
                <div key={i} className="h-10 rounded-lg border border-gray-100 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: shade }}
                  title={shade}
                  onClick={() => copy(shade, `shade-${i}`)}
                />
              );
            })}
          </div>
          <div className="grid grid-cols-5 gap-1.5 mt-1.5">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((factor, i) => {
              const shade = rgb
                ? `rgb(${Math.round(rgb.r * (1 - factor))},${Math.round(rgb.g * (1 - factor))},${Math.round(rgb.b * (1 - factor))})`
                : "black";
              return (
                <div key={i} className="h-10 rounded-lg border border-gray-100 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: shade }}
                  title={shade}
                  onClick={() => copy(shade, `dark-${i}`)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
