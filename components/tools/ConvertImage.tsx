"use client";

import { useState, useRef } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

type Format = "image/jpeg" | "image/png" | "image/webp";

const formats: { id: Format; label: string; ext: string; desc: string }[] = [
  { id: "image/jpeg", label: "JPG", ext: "jpg", desc: "Best for photos, smaller file size" },
  { id: "image/png", label: "PNG", ext: "png", desc: "Lossless, supports transparency" },
  { id: "image/webp", label: "WebP", ext: "webp", desc: "Modern, great compression + quality" },
];

export default function ConvertImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetFormat, setTargetFormat] = useState<Format>("image/webp");
  const [quality, setQuality] = useState(92);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const previewUrl = useRef<string>("");

  async function convert() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const file = files[0];
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = url; });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      // Fill white background for JPG (no transparency)
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const ext = formats.find((f) => f.id === targetFormat)!.ext;
      const q = targetFormat === "image/png" ? undefined : quality / 100;

      const blob = await new Promise<Blob>((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Failed"))), targetFormat, q)
      );

      const baseName = file.name.replace(/\.[^.]+$/, "");
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = URL.createObjectURL(blob);
      setResult({ blob, name: `${baseName}.${ext}` });
    } catch {
      setError("Conversion failed. Please try a different file.");
    } finally {
      setProcessing(false);
    }
  }

  const currentFormat = files[0]
    ? files[0].type.includes("png") ? "PNG" : files[0].type.includes("webp") ? "WebP" : "JPG"
    : null;

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
        files={files}
        onFiles={setFiles}
        label="Click or drag an image here"
        hint="Supports JPG, PNG, WebP, GIF, BMP"
      />

      {files[0] && (
        <div className="space-y-5">
          {currentFormat && (
            <p className="text-xs text-gray-400">
              Source format: <span className="font-semibold text-gray-600">{currentFormat}</span>
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Convert to</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {formats.map((fmt) => (
                <button key={fmt.id} onClick={() => setTargetFormat(fmt.id)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    targetFormat === fmt.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-violet-200"
                  }`}>
                  <p className={`text-base font-bold ${targetFormat === fmt.id ? "text-violet-700" : "text-gray-700"}`}>
                    .{fmt.ext.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {targetFormat !== "image/png" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quality: <span className="text-violet-600 font-bold">{quality}%</span>
              </label>
              <input type="range" min={50} max={100} step={2} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-violet-600" />
            </div>
          )}

          <button onClick={convert} disabled={processing}
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Converting…" : "Convert Image"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 max-h-64 flex items-center justify-center bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl.current} alt="Converted preview" className="max-h-64 max-w-full object-contain" />
          </div>
          <DownloadButton blob={result.blob} filename={result.name}
            label={`Download ${formats.find(f => f.id === targetFormat)?.label}`} />
        </div>
      )}
    </div>
  );
}
