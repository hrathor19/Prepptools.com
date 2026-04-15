"use client";

import { useState, useRef } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton, { downloadBlob } from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [result, setResult] = useState<{ blob: Blob; name: string; originalSize: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const previewUrl = useRef<string>("");

  async function compress() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const file = files[0];
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
          outputFormat,
          outputFormat === "image/png" ? undefined : quality / 100
        );
      });

      const ext = outputFormat.split("/")[1].replace("jpeg", "jpg");
      const baseName = file.name.replace(/\.[^.]+$/, "");
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
      previewUrl.current = URL.createObjectURL(blob);
      setResult({ blob, name: `${baseName}-compressed.${ext}`, originalSize: file.size });
    } catch (e) {
      setError("Compression failed. Please try a different image.");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  }

  const saving = result ? Math.max(0, ((result.originalSize - result.blob.size) / result.originalSize) * 100) : 0;

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

          {/* Quality slider (not relevant for PNG lossless) */}
          {outputFormat !== "image/png" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Quality: <span className="text-violet-600 font-bold">{quality}%</span>
                <span className="text-gray-400 font-normal ml-2 text-xs">
                  {quality >= 80 ? "High" : quality >= 50 ? "Medium" : "Low"}
                </span>
              </label>
              <input type="range" min={10} max={100} step={5} value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-violet-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Smallest file</span><span>Best quality</span>
              </div>
            </div>
          )}

          <button onClick={compress} disabled={processing}
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-60 transition-colors">
            {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {processing ? "Compressing…" : "Compress Image"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="space-y-4">
          {/* Preview */}
          <div className="overflow-hidden rounded-xl border border-gray-200 max-h-64 flex items-center justify-center bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl.current} alt="Compressed preview" className="max-h-64 max-w-full object-contain" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm font-bold text-gray-700">{formatBytes(result.originalSize)}</p>
              <p className="text-xs text-gray-400 mt-1">Original</p>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 text-center">
              <p className="text-sm font-bold text-violet-700">{formatBytes(result.blob.size)}</p>
              <p className="text-xs text-gray-400 mt-1">Compressed</p>
            </div>
            <div className={`rounded-xl border p-4 text-center ${saving > 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
              <p className={`text-sm font-bold ${saving > 0 ? "text-green-600" : "text-amber-600"}`}>
                {saving > 0 ? `-${saving.toFixed(1)}%` : "~same"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Size change</p>
            </div>
          </div>

          <DownloadButton blob={result.blob} filename={result.name} label="Download Compressed Image" />
        </div>
      )}
    </div>
  );
}
