"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

export default function WatermarkPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(60);
  const [color, setColor] = useState<"gray" | "red" | "blue">("gray");
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const colorMap = {
    gray: { r: 0.5, g: 0.5, b: 0.5 },
    red: { r: 0.8, g: 0.1, b: 0.1 },
    blue: { r: 0.1, g: 0.3, b: 0.8 },
  };

  async function apply() {
    if (!files[0] || !text.trim()) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const { r, g, b } = colorMap[color];
      const pages = doc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: opacity / 100,
          rotate: degrees(45),
        });
      });

      const pdfBytes = await doc.save();
      setResult(new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add watermark.");
    } finally {
      setProcessing(false);
    }
  }

  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "document";

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf"
        files={files}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        label="Click or drag a PDF here"
      />

      {files[0] && (
        <div className="space-y-5">
          {/* Watermark text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Watermark Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={50}
              placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex gap-2">
              {(["gray", "red", "blue"] as const).map((c) => (
                <button key={c} onClick={() => setColor(c)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                    color === c ? "border-orange-500 bg-orange-50 text-orange-700" : "bg-white border-gray-200 text-gray-600 hover:border-orange-200"
                  }`}>
                  <span className={`inline-block w-3 h-3 rounded-full mr-1.5 ${c === "gray" ? "bg-gray-400" : c === "red" ? "bg-red-500" : "bg-blue-600"}`} />
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Font size & Opacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Font Size: <span className="text-orange-600 font-bold">{fontSize}pt</span>
              </label>
              <input type="range" min={20} max={120} step={5} value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-orange-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Opacity: <span className="text-orange-600 font-bold">{opacity}%</span>
              </label>
              <input type="range" min={5} max={80} step={5} value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-orange-600" />
            </div>
          </div>

          {/* Preview */}
          <div className="relative flex items-center justify-center h-24 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className={`font-bold select-none rotate-45 ${color === "red" ? "text-red-500" : color === "blue" ? "text-blue-600" : "text-gray-400"}`}
                style={{ fontSize: `${Math.min(fontSize * 0.3, 28)}px`, opacity: opacity / 100 }}
              >
                {text || "WATERMARK"}
              </span>
            </div>
            <span className="text-xs text-gray-300 italic">Preview</span>
          </div>

          <button onClick={apply} disabled={processing || !text.trim()}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Adding Watermark…" : "Add Watermark"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">Watermark added to all pages!</p>
          <DownloadButton blob={result} filename={`${baseName}-watermarked.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
