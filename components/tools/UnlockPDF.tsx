"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

export default function UnlockPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function unlock() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();

      let doc;
      try {
        doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      } catch {
        throw new Error("Could not open this file. It may be corrupted.");
      }

      // Re-save without encryption metadata
      const out = await doc.save();
      setResult(new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to unlock the PDF.");
    } finally {
      setProcessing(false);
    }
  }

  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "document";

  return (
    <div className="space-y-6">
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <span className="text-amber-500 text-lg shrink-0">⚠️</span>
        <p className="text-xs text-amber-700 leading-relaxed">
          This tool removes <strong>owner-level restrictions</strong> (copy, print, edit locks) from PDFs you own.
          It does not bypass user-password protection (open password). Only use on files you have rights to.
        </p>
      </div>

      <FileDropZone
        accept="application/pdf,.pdf"
        files={files}
        onFiles={(f) => { setFiles(f); setResult(null); setError(""); }}
        label="Click or drag a restricted PDF here"
        hint="Removes copy/print/edit restrictions"
      />

      {files[0] && (
        <button
          onClick={unlock}
          disabled={processing}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing ? "Unlocking…" : "Remove Restrictions"}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <p className="flex-1 text-sm font-semibold text-green-800">Password removed! The PDF is now unlocked.</p>
          <DownloadButton blob={result} filename={`${baseName}-unlocked.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
