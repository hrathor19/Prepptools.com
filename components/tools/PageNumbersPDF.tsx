"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

type VPos = "bottom" | "top";
type HPos = "left" | "center" | "right";
type Format = "1" | "Page 1" | "1 / N" | "Page 1 of N";

export default function PageNumbersPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [vPos, setVPos] = useState<VPos>("bottom");
  const [hPos, setHPos] = useState<HPos>("center");
  const [format, setFormat] = useState<Format>("Page 1 of N");
  const [fontSize, setFontSize] = useState(11);
  const [startFrom, setStartFrom] = useState(1);
  const [margin, setMargin] = useState(20);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function apply() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = pages.length;

      pages.forEach((page, idx) => {
        const pageNum = idx + startFrom;
        let label = "";
        switch (format) {
          case "1":           label = String(pageNum); break;
          case "Page 1":      label = `Page ${pageNum}`; break;
          case "1 / N":       label = `${pageNum} / ${total}`; break;
          case "Page 1 of N": label = `Page ${pageNum} of ${total}`; break;
        }

        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(label, fontSize);

        let x = margin;
        if (hPos === "center") x = (width - textWidth) / 2;
        else if (hPos === "right") x = width - textWidth - margin;

        const y = vPos === "bottom" ? margin : height - margin - fontSize;

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const out = await doc.save();
      setResult(new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add page numbers.");
    } finally {
      setProcessing(false);
    }
  }

  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "document";

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf,.pdf"
        files={files}
        onFiles={(f) => { setFiles(f); setResult(null); setError(""); }}
        label="Click or drag a PDF here"
      />

      {files[0] && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex flex-col gap-1.5">
                {(["1", "Page 1", "1 / N", "Page 1 of N"] as Format[]).map((f) => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`px-3 py-2 rounded-xl border text-sm text-left font-medium transition-colors ${
                      format === f ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                    }`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Vertical position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vertical</label>
                <div className="flex gap-2">
                  {(["bottom", "top"] as VPos[]).map((v) => (
                    <button key={v} onClick={() => setVPos(v)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                        vPos === v ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                      }`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horizontal position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horizontal</label>
                <div className="flex gap-2">
                  {(["left", "center", "right"] as HPos[]).map((h) => (
                    <button key={h} onClick={() => setHPos(h)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-sm font-medium capitalize transition-colors ${
                        hPos === h ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                      }`}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Font size: <span className="text-orange-600 font-bold">{fontSize}pt</span>
                </label>
                <input type="range" min={8} max={20} step={1} value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-orange-600" />
              </div>

              {/* Start from */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start numbering from</label>
                <input type="number" min={1} value={startFrom}
                  onChange={(e) => setStartFrom(Math.max(1, Number(e.target.value)))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
          </div>

          {/* Preview badge */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-gray-500">Preview:</span>
            <span className="text-sm font-mono text-gray-800">
              {format.replace(/1/g, String(startFrom)).replace(/N/g, "?")}
            </span>
          </div>

          <button onClick={apply} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Adding Numbers…" : "Add Page Numbers"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">Page numbers added to all pages!</p>
          <DownloadButton blob={result} filename={`${baseName}-numbered.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
