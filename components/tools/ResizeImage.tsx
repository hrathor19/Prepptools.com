"use client";

import { useState, useRef, useEffect } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton, { downloadBlob } from "./shared/DownloadButton";
import { Loader2, Lock, Unlock } from "lucide-react";

export default function ResizeImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const previewUrl = useRef<string>("");

  // Read natural dimensions when file changes
  useEffect(() => {
    if (!files[0]) { setNaturalW(0); setNaturalH(0); setWidth(""); setHeight(""); return; }
    const img = new Image();
    const url = URL.createObjectURL(files[0]);
    img.onload = () => {
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [files]);

  function handleWidthChange(val: string) {
    setWidth(val);
    if (lockRatio && naturalW && naturalH) {
      const w = parseInt(val);
      if (!isNaN(w)) setHeight(String(Math.round((w / naturalW) * naturalH)));
    }
  }

  function handleHeightChange(val: string) {
    setHeight(val);
    if (lockRatio && naturalW && naturalH) {
      const h = parseInt(val);
      if (!isNaN(h)) setWidth(String(Math.round((h / naturalH) * naturalW)));
    }
  }

  async function resize() {
    if (!files[0]) return;
    const w = parseInt(width);
    const h = parseInt(height);
    if (!w || !h || w <= 0 || h <= 0) { setError("Enter valid positive dimensions."); return; }

    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const img = new Image();
      const url = URL.createObjectURL(files[0]);
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);

      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Failed"))), outputFormat, 0.92)
      );

      const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
      const baseName = files[0].name.replace(/\.[^.]+$/, "");
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = URL.createObjectURL(blob);
      setResult({ blob, name: `${baseName}-${w}x${h}.${ext}` });
    } catch {
      setError("Resize failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  const presets = [
    { label: "HD", w: 1280, h: 720 },
    { label: "Full HD", w: 1920, h: 1080 },
    { label: "4K", w: 3840, h: 2160 },
    { label: "Instagram", w: 1080, h: 1080 },
    { label: "Twitter", w: 1200, h: 675 },
    { label: "LinkedIn", w: 1200, h: 627 },
  ];

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="image/jpeg,image/png,image/webp,image/gif"
        files={files}
        onFiles={setFiles}
        label="Click or drag an image here"
        hint="Supports JPG, PNG, WebP, GIF"
      />

      {files[0] && (
        <div className="space-y-5">
          {naturalW > 0 && (
            <p className="text-xs text-gray-400">
              Original: <span className="font-medium text-gray-600">{naturalW} × {naturalH} px</span>
            </p>
          )}

          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button key={p.label} onClick={() => { setWidth(String(p.w)); setHeight(String(p.h)); setLockRatio(false); }}
                  className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-violet-300 hover:text-violet-600 transition-colors bg-white text-gray-600">
                  {p.label} ({p.w}×{p.h})
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Width (px)</label>
              <input type="number" value={width} onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <button onClick={() => setLockRatio((l) => !l)}
              className={`mt-5 p-2.5 rounded-xl border transition-colors ${lockRatio ? "bg-violet-100 border-violet-300 text-violet-700" : "bg-white border-gray-200 text-gray-400"}`}
              title={lockRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}>
              {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Height (px)</label>
              <input type="number" value={height} onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>

          {/* Output format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
            <div className="flex gap-2">
              {(["image/jpeg", "image/png", "image/webp"] as const).map((fmt) => (
                <button key={fmt} onClick={() => setOutputFormat(fmt)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    outputFormat === fmt ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                  }`}>
                  {fmt.split("/")[1].toUpperCase().replace("JPEG", "JPG")}
                </button>
              ))}
            </div>
          </div>

          <button onClick={resize} disabled={processing}
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Resizing…" : "Resize Image"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 max-h-64 flex items-center justify-center bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl.current} alt="Resized preview" className="max-h-64 max-w-full object-contain" />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Resized to <span className="font-semibold text-gray-700">{width} × {height} px</span>
          </p>
          <DownloadButton blob={result.blob} filename={result.name} label="Download Resized Image" />
        </div>
      )}
    </div>
  );
}
