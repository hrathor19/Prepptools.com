"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, Check, Pipette } from "lucide-react";

interface PickedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ImageColorPicker() {
  const [files, setFiles] = useState<File[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [current, setCurrent] = useState<PickedColor | null>(null);
  const [history, setHistory] = useState<PickedColor[]>([]);
  const [copied, setCopied] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!files[0]) return;
    const url = URL.createObjectURL(files[0]);
    setImgSrc(url);
    setCurrent(null);
    return () => URL.revokeObjectURL(url);
  }, [files]);

  useEffect(() => {
    if (!imgSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
    };
    img.src = imgSrc;
  }, [imgSrc]);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = Math.floor((e.clientX - rect.left) * scaleX);
    const py = Math.floor((e.clientY - rect.top) * scaleY);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(px, py, 1, 1).data;
    const [r, g, b] = [data[0], data[1], data[2]];
    const picked: PickedColor = {
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
    };
    setCurrent(picked);
    setHistory((prev) => [picked, ...prev].slice(0, 10));
  }

  function handleFiles(incoming: File[]) {
    if (!incoming[0]) return;
    setFiles(incoming);
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    });
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
      {!imgSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-2xl px-6 py-10 cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-colors bg-gray-50"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-gray-200">
            <Pipette className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Click or drag an image here</p>
          <p className="text-xs text-gray-400">Supports JPG, PNG, WebP, BMP, GIF</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(Array.from(e.target.files ?? []))}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Click on any pixel to pick its color</p>
          <div className="relative overflow-auto rounded-xl border border-gray-200 bg-gray-50 max-h-96">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-w-full cursor-crosshair block"
              style={{ maxHeight: "24rem", objectFit: "contain" }}
            />
          </div>
          <button
            onClick={() => { setImgSrc(""); setFiles([]); setCurrent(null); setHistory([]); }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            Remove image
          </button>
        </div>
      )}

      {/* Current Color */}
      {current && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">Picked Color</h3>
          <div className="flex gap-4 items-start">
            {/* Swatch */}
            <div
              className="w-20 h-20 rounded-2xl border border-gray-200 shadow-sm shrink-0"
              style={{ backgroundColor: current.hex }}
            />
            {/* Values */}
            <div className="flex-1 space-y-2">
              {[
                { label: "HEX", value: current.hex },
                { label: "RGB", value: `rgb(${current.rgb.r}, ${current.rgb.g}, ${current.rgb.b})` },
                { label: "HSL", value: `hsl(${current.hsl.h}, ${current.hsl.s}%, ${current.hsl.l}%)` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-8">{label}</span>
                  <code className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-mono text-gray-700">
                    {value}
                  </code>
                  <button
                    onClick={() => copyText(value)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                  >
                    {copied === value ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Recent Colors ({history.length})</h3>
          <div className="flex flex-wrap gap-3">
            {history.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group">
                <div
                  className="w-10 h-10 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setCurrent(c)}
                  title={c.hex}
                />
                <button
                  onClick={() => copyText(c.hex)}
                  className="text-xs text-gray-400 hover:text-violet-600 transition-colors font-mono"
                >
                  {copied === c.hex ? <Check className="w-3 h-3 text-green-500 inline" /> : c.hex.slice(1)}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
