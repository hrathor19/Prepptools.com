"use client";

import { useState, useRef, useEffect } from "react";
import FileDropZone from "./shared/FileDropZone";
import { downloadBlob } from "./shared/DownloadButton";
import { Crop, Download } from "lucide-react";

type AspectRatio = "free" | "1:1" | "16:9" | "4:3" | "3:2";

const ASPECT_RATIOS: { label: string; value: AspectRatio; ratio: number | null }[] = [
  { label: "Free", value: "free", ratio: null },
  { label: "1:1", value: "1:1", ratio: 1 },
  { label: "16:9", value: "16:9", ratio: 16 / 9 },
  { label: "4:3", value: "4:3", ratio: 4 / 3 },
  { label: "3:2", value: "3:2", ratio: 3 / 2 },
];

export default function ImageCropper() {
  const [files, setFiles] = useState<File[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspect, setAspect] = useState<AspectRatio>("free");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [outW, setOutW] = useState(0);
  const [outH, setOutH] = useState(0);
  const [error, setError] = useState("");

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load image when file changes
  useEffect(() => {
    if (!files[0]) return;
    const url = URL.createObjectURL(files[0]);
    setImgSrc(url);
    setResultBlob(null);
    setResultUrl("");
    return () => URL.revokeObjectURL(url);
  }, [files]);

  // Set defaults once image loads
  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setNaturalW(nw);
    setNaturalH(nh);
    setX(0);
    setY(0);
    setWidth(nw);
    setHeight(nh);
  }

  // Adjust height when aspect ratio or width changes
  useEffect(() => {
    const ar = ASPECT_RATIOS.find((a) => a.value === aspect);
    if (ar?.ratio && width > 0) {
      setHeight(Math.round(width / ar.ratio));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect, width]);

  function handleWidthChange(val: number) {
    setWidth(val);
    const ar = ASPECT_RATIOS.find((a) => a.value === aspect);
    if (ar?.ratio) setHeight(Math.round(val / ar.ratio));
  }

  function handleHeightChange(val: number) {
    setHeight(val);
    const ar = ASPECT_RATIOS.find((a) => a.value === aspect);
    if (ar?.ratio) setWidth(Math.round(val * ar.ratio));
  }

  function crop() {
    if (!imgRef.current || !naturalW) return;
    setError("");
    const cx = Math.max(0, Math.min(x, naturalW - 1));
    const cy = Math.max(0, Math.min(y, naturalH - 1));
    const cw = Math.max(1, Math.min(width, naturalW - cx));
    const ch = Math.max(1, Math.min(height, naturalH - cy));

    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(imgRef.current, cx, cy, cw, ch, 0, 0, cw, ch);
    canvas.toBlob((blob) => {
      if (!blob) { setError("Crop failed."); return; }
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
      setOutW(cw);
      setOutH(ch);
    }, "image/png");
  }

  // Overlay position relative to displayed image
  function getOverlayStyle() {
    const img = imgRef.current;
    if (!img || !naturalW || !naturalH) return {};
    const dispW = img.clientWidth;
    const dispH = img.clientHeight;
    const scaleX = dispW / naturalW;
    const scaleY = dispH / naturalH;
    return {
      left: x * scaleX,
      top: y * scaleY,
      width: Math.min(width, naturalW - x) * scaleX,
      height: Math.min(height, naturalH - y) * scaleY,
    };
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="image/*"
        files={files}
        onFiles={(f) => { setFiles(f); }}
        label="Click or drag an image here"
        hint="Supports JPG, PNG, WebP, BMP, GIF"
      />

      {imgSrc && (
        <div className="space-y-5">
          {/* Aspect Ratio Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setAspect(ar.value)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                    aspect === ar.value
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Inputs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "X (px)", value: x, setter: (v: number) => setX(v) },
              { label: "Y (px)", value: y, setter: (v: number) => setY(v) },
              { label: "Width (px)", value: width, setter: handleWidthChange },
              { label: "Height (px)", value: height, setter: handleHeightChange },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="number"
                  min={0}
                  value={value}
                  onChange={(e) => setter(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
            ))}
          </div>

          {/* Image Preview with overlay */}
          <div ref={previewContainerRef} className="relative inline-block max-w-full border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Preview"
              onLoad={handleImageLoad}
              className="max-w-full max-h-80 block object-contain"
            />
            {naturalW > 0 && (
              <div
                className="absolute border-2 border-violet-500 pointer-events-none"
                style={{
                  ...getOverlayStyle(),
                  background: "rgba(139,92,246,0.15)",
                  boxSizing: "border-box",
                }}
              />
            )}
          </div>

          <p className="text-xs text-gray-400">
            Source: {naturalW} × {naturalH} px
          </p>

          <button
            onClick={crop}
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            <Crop className="w-5 h-5" />
            Crop Image
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {resultUrl && resultBlob && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Cropped result" className="max-h-64 max-w-full object-contain" />
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Output: <span className="text-violet-700">{outW} × {outH} px</span>
          </p>
          <button
            onClick={() => downloadBlob(resultBlob, "cropped-image.png")}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Cropped Image
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
