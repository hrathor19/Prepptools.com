"use client";

import { useState, useRef, useEffect } from "react";
import FileDropZone from "./shared/FileDropZone";
import { downloadBlob } from "./shared/DownloadButton";
import { Download, Stamp } from "lucide-react";

type Position =
  | "top-left" | "top-center" | "top-right"
  | "middle-left" | "middle-center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

const POSITIONS: { label: string; value: Position }[] = [
  { label: "↖", value: "top-left" },
  { label: "↑", value: "top-center" },
  { label: "↗", value: "top-right" },
  { label: "←", value: "middle-left" },
  { label: "·", value: "middle-center" },
  { label: "→", value: "middle-right" },
  { label: "↙", value: "bottom-left" },
  { label: "↓", value: "bottom-center" },
  { label: "↘", value: "bottom-right" },
];

function getTextPosition(
  pos: Position,
  canvasW: number,
  canvasH: number,
  padding: number
): { x: number; y: number; textAlign: CanvasTextAlign; textBaseline: CanvasTextBaseline } {
  const [vert, horiz] = pos.split("-") as [string, string];
  let x = padding;
  let textAlign: CanvasTextAlign = "left";
  if (horiz === "center") { x = canvasW / 2; textAlign = "center"; }
  else if (horiz === "right") { x = canvasW - padding; textAlign = "right"; }

  let y = padding;
  let textBaseline: CanvasTextBaseline = "top";
  if (vert === "middle") { y = canvasH / 2; textBaseline = "middle"; }
  else if (vert === "bottom") { y = canvasH - padding; textBaseline = "bottom"; }

  return { x, y, textAlign, textBaseline };
}

export default function WatermarkImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [text, setText] = useState("Watermark");
  const [fontSize, setFontSize] = useState(36);
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [color, setColor] = useState("#ffffff");
  const [repeat, setRepeat] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [error, setError] = useState("");

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!files[0]) return;
    const url = URL.createObjectURL(files[0]);
    setImgSrc(url);
    setResultBlob(null);
    setResultUrl("");
    return () => URL.revokeObjectURL(url);
  }, [files]);

  function applyWatermark() {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;
    setError("");

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;

    const padding = Math.max(20, fontSize);

    if (repeat) {
      const step = fontSize * 5;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      for (let row = -canvas.height; row < canvas.height + step; row += step * 1.5) {
        for (let col = -canvas.width; col < canvas.width + step; col += step * 2) {
          ctx.fillText(text, col, row);
        }
      }
      ctx.restore();
    } else {
      const { x, y, textAlign, textBaseline } = getTextPosition(position, canvas.width, canvas.height, padding);
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;
      ctx.fillText(text, x, y);
    }

    canvas.toBlob((blob) => {
      if (!blob) { setError("Failed to apply watermark."); return; }
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    }, "image/png");
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="image/*"
        files={files}
        onFiles={setFiles}
        label="Click or drag an image here"
        hint="Supports JPG, PNG, WebP, BMP, GIF"
      />

      {imgSrc && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={imgSrc} alt="Source" className="hidden" />

          <div className="space-y-5">
            {/* Watermark Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Watermark Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter watermark text"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Font Size: <span className="text-violet-600 font-bold">{fontSize}px</span>
                </label>
                <input
                  type="range"
                  min={12}
                  max={72}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>

              {/* Opacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opacity: <span className="text-violet-600 font-bold">{Math.round(opacity * 100)}%</span>
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-violet-600"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  />
                  <span className="text-sm text-gray-600 font-mono">{color.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Position Grid */}
            {!repeat && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <div className="grid grid-cols-3 gap-1.5 w-fit">
                  {POSITIONS.map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => setPosition(pos.value)}
                      title={pos.value.replace("-", " ")}
                      className={`w-10 h-10 rounded-lg border text-base font-bold transition-colors ${
                        position === pos.value
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-gray-500 border-gray-200 hover:border-violet-300"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Repeat Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={repeat}
                onChange={(e) => setRepeat(e.target.checked)}
                className="w-4 h-4 accent-violet-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Tile watermark across entire image</span>
            </label>

            <button
              onClick={applyWatermark}
              className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
            >
              <Stamp className="w-5 h-5" />
              Apply Watermark
            </button>
          </div>
        </>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {resultUrl && resultBlob && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Watermarked" className="max-h-72 max-w-full object-contain" />
          </div>
          <button
            onClick={() => downloadBlob(resultBlob, "watermarked-image.png")}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download as PNG
          </button>
        </div>
      )}
    </div>
  );
}
