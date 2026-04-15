"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton, { downloadBlob } from "./shared/DownloadButton";
import { Loader2, GripVertical, X } from "lucide-react";

type PageSize = "a4" | "letter" | "fit";
type Orientation = "portrait" | "landscape";

export default function ImageToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState(10);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setResult(null);
  }

  async function convert() {
    if (files.length === 0) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { default: jsPDF } = await import("jspdf");

      // Page dimensions in mm
      const pageDims: Record<PageSize, [number, number]> = {
        a4: [210, 297],
        letter: [215.9, 279.4],
        fit: [0, 0], // will be set per image
      };

      let pdf: InstanceType<typeof jsPDF> | null = null;
      let isFirst = true;

      for (const file of files) {
        // Load image
        const dataUrl = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target?.result as string);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });

        const img = new Image();
        await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; img.src = dataUrl; });
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;
        const imgRatio = imgW / imgH;

        // Determine page width/height in mm
        let pw: number, ph: number;
        if (pageSize === "fit") {
          const px2mm = 25.4 / 96;
          pw = imgW * px2mm;
          ph = imgH * px2mm;
        } else {
          [pw, ph] = pageDims[pageSize];
          if (orientation === "landscape") [pw, ph] = [ph, pw];
        }

        // Create PDF on first image
        if (isFirst) {
          pdf = new jsPDF({ orientation: orientation === "landscape" ? "l" : "p", unit: "mm", format: pageSize === "fit" ? [pw, ph] : pageSize });
          isFirst = false;
        } else {
          pdf!.addPage(pageSize === "fit" ? [pw, ph] : pageSize, orientation === "landscape" ? "l" : "p");
        }

        // Fit image within margins
        const m = margin;
        const maxW = pw - m * 2;
        const maxH = ph - m * 2;
        let drawW = maxW;
        let drawH = drawW / imgRatio;
        if (drawH > maxH) { drawH = maxH; drawW = drawH * imgRatio; }

        const x = m + (maxW - drawW) / 2;
        const y = m + (maxH - drawH) / 2;

        const fmt = file.type.includes("png") ? "PNG" : "JPEG";
        pdf!.addImage(dataUrl, fmt, x, y, drawW, drawH);
      }

      if (!pdf) throw new Error("No pages created");
      const pdfBytes = pdf.output("arraybuffer");
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setResult(blob);
    } catch (e) {
      console.error(e);
      setError("Conversion failed. Please check your images and try again.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="image/jpeg,image/png,image/webp"
        multiple
        files={files}
        onFiles={setFiles}
        label="Click or drag images here"
        hint="JPG, PNG, WebP — multiple images supported (each becomes one page)"
      />

      {files.length > 1 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Page order — remove to exclude:</p>
          <ul className="space-y-1.5">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700">
                <GripVertical className="w-4 h-4 text-gray-300" />
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                <span className="flex-1 truncate">{f.name}</span>
                <button onClick={() => removeFile(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
              <div className="flex flex-col gap-1.5">
                {(["a4", "letter", "fit"] as const).map((s) => (
                  <button key={s} onClick={() => setPageSize(s)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-left ${
                      pageSize === s ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                    }`}>
                    {s === "a4" ? "A4" : s === "letter" ? "US Letter" : "Fit to Image"}
                  </button>
                ))}
              </div>
            </div>
            {pageSize !== "fit" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                <div className="flex flex-col gap-1.5">
                  {(["portrait", "landscape"] as const).map((o) => (
                    <button key={o} onClick={() => setOrientation(o)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                        orientation === o ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                      }`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Margin: <span className="text-orange-600 font-bold">{margin} mm</span>
              </label>
              <input type="range" min={0} max={30} step={5} value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-orange-600 mt-2" />
            </div>
          </div>

          <button onClick={convert} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Converting…" : `Convert ${files.length} Image${files.length > 1 ? "s" : ""} to PDF`}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">PDF created successfully!</p>
            <p className="text-xs text-green-600 mt-0.5">{files.length} page{files.length > 1 ? "s" : ""}</p>
          </div>
          <DownloadButton blob={result} filename="converted.pdf" label="Download PDF" />
        </div>
      )}
    </div>
  );
}
