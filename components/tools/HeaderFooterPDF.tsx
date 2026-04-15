"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

export default function HeaderFooterPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [headerText, setHeaderText] = useState("");
  const [footerText, setFooterText] = useState("");
  const [fontSize, setFontSize] = useState(10);
  const [margin, setMargin] = useState(18);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function apply() {
    if (!files[0]) return;
    if (!headerText.trim() && !footerText.trim()) {
      setError("Please enter at least a header or footer text.");
      return;
    }
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const total = doc.getPageCount();

      doc.getPages().forEach((page, idx) => {
        const { width, height } = page.getSize();

        // Replace tokens in text
        const replace = (tpl: string) =>
          tpl
            .replace(/{page}/gi, String(idx + 1))
            .replace(/{total}/gi, String(total))
            .replace(/{date}/gi, new Date().toLocaleDateString());

        const drawCentered = (text: string, y: number) => {
          const tw = font.widthOfTextAtSize(text, fontSize);
          page.drawText(text, {
            x: (width - tw) / 2,
            y,
            size: fontSize,
            font,
            color: rgb(0.35, 0.35, 0.35),
          });
        };

        if (headerText.trim()) {
          drawCentered(replace(headerText), height - margin - fontSize);
        }
        if (footerText.trim()) {
          drawCentered(replace(footerText), margin);
        }
      });

      const out = await doc.save();
      setResult(new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add header/footer.");
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
        hint="Header and footer are added to all pages"
      />

      {files[0] && (
        <div className="space-y-5">
          {/* Token hint */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700">
              <strong>Tokens:</strong> use <code className="bg-blue-100 px-1 rounded">{"{page}"}</code> for page number,{" "}
              <code className="bg-blue-100 px-1 rounded">{"{total}"}</code> for total pages,{" "}
              <code className="bg-blue-100 px-1 rounded">{"{date}"}</code> for today&apos;s date.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Header Text</label>
            <input
              type="text"
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              placeholder='e.g. "Company Confidential" or "Page {page} of {total}"'
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Footer Text</label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder='e.g. "Page {page} of {total}" or "Generated on {date}"'
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Font size: <span className="text-orange-600 font-bold">{fontSize}pt</span>
              </label>
              <input type="range" min={7} max={18} step={1} value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-orange-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Margin: <span className="text-orange-600 font-bold">{margin}pt</span>
              </label>
              <input type="range" min={10} max={40} step={2} value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-orange-600" />
            </div>
          </div>

          {/* Live preview chip */}
          {(headerText || footerText) && (
            <div className="border border-gray-200 rounded-xl overflow-hidden text-xs text-gray-500">
              {headerText && (
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 text-center">
                  ↑ {headerText.replace(/{page}/gi, "1").replace(/{total}/gi, "?").replace(/{date}/gi, new Date().toLocaleDateString())}
                </div>
              )}
              <div className="px-4 py-5 text-center text-gray-300 italic">page content</div>
              {footerText && (
                <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-center">
                  ↓ {footerText.replace(/{page}/gi, "1").replace(/{total}/gi, "?").replace(/{date}/gi, new Date().toLocaleDateString())}
                </div>
              )}
            </div>
          )}

          <button onClick={apply} disabled={processing}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Adding…" : "Apply Header & Footer"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">Header &amp; footer added to all pages!</p>
          <DownloadButton blob={result} filename={`${baseName}-hf.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
