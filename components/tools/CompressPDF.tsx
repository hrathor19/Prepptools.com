"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{ blob: Blob; originalSize: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function compress() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      // Strip metadata to reduce size
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("");
      doc.setCreator("");

      const compressed = await doc.save({ useObjectStreams: true, addDefaultPage: false });
      const blob = new Blob([compressed as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      setResult({ blob, originalSize: files[0].size });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed. This PDF may be password-protected.");
    } finally {
      setProcessing(false);
    }
  }

  const saving = result
    ? ((result.originalSize - result.blob.size) / result.originalSize) * 100
    : 0;

  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "document";

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Note:</span> This tool optimises PDF structure (metadata stripping, cross-reference streams). For heavy compression of scanned/image-based PDFs, results may vary.
        </p>
      </div>

      <FileDropZone
        accept="application/pdf"
        files={files}
        onFiles={(f) => { setFiles(f); setResult(null); }}
        label="Click or drag a PDF here"
        hint="Works best on PDFs with text content"
      />

      {files[0] && (
        <button onClick={compress} disabled={processing}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing ? "Compressing…" : "Compress PDF"}
        </button>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-sm font-bold text-gray-700">{formatBytes(result.originalSize)}</p>
              <p className="text-xs text-gray-400 mt-1">Original</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
              <p className="text-sm font-bold text-orange-700">{formatBytes(result.blob.size)}</p>
              <p className="text-xs text-gray-400 mt-1">Compressed</p>
            </div>
            <div className={`rounded-xl border p-4 text-center ${saving > 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
              <p className={`text-sm font-bold ${saving > 0 ? "text-green-600" : "text-gray-500"}`}>
                {saving > 0 ? `-${saving.toFixed(1)}%` : "~same"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Reduction</p>
            </div>
          </div>
          <DownloadButton blob={result.blob} filename={`${baseName}-compressed.pdf`} label="Download Compressed PDF" />
        </div>
      )}
    </div>
  );
}
