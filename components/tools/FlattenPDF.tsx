"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

export default function FlattenPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Blob | null>(null);
  const [fieldCount, setFieldCount] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function flatten() {
    if (!files[0]) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

      const form = doc.getForm();
      const fields = form.getFields();
      setFieldCount(fields.length);

      // Flatten — bakes all field values into static content
      form.flatten();

      const out = await doc.save();
      setResult(new Blob([out as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to flatten the PDF.");
    } finally {
      setProcessing(false);
    }
  }

  const baseName = files[0]?.name.replace(/\.pdf$/i, "") ?? "document";

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <p className="text-xs text-blue-700 leading-relaxed">
          Flattening bakes all form fields, checkboxes, and annotations into static content.
          The resulting PDF can no longer be filled or edited — ideal for archiving or sharing final versions.
        </p>
      </div>

      <FileDropZone
        accept="application/pdf,.pdf"
        files={files}
        onFiles={(f) => { setFiles(f); setResult(null); setFieldCount(null); setError(""); }}
        label="Click or drag a PDF here"
        hint="Works best on PDFs with fillable forms"
      />

      {files[0] && !result && (
        <button
          onClick={flatten}
          disabled={processing}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing ? "Flattening…" : "Flatten PDF"}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">PDF flattened successfully!</p>
            <p className="text-xs text-green-600 mt-0.5">
              {fieldCount != null
                ? `${fieldCount} field${fieldCount !== 1 ? "s" : ""} baked into static content`
                : "All form fields removed"}
            </p>
          </div>
          <DownloadButton blob={result} filename={`${baseName}-flattened.pdf`} label="Download PDF" />
        </div>
      )}
    </div>
  );
}
