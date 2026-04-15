"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2, GripVertical, X } from "lucide-react";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setResult(null);
  }

  async function merge() {
    if (files.length < 2) { setError("Please add at least 2 PDF files to merge."); return; }
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      let totalPages = 0;

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let doc;
        try {
          doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        } catch {
          throw new Error(`"${file.name}" could not be read. It may be corrupted or password-protected.`);
        }
        const copied = await merged.copyPages(doc, doc.getPageIndices());
        copied.forEach((p) => merged.addPage(p));
        totalPages += doc.getPageCount();
      }

      const pdfBytes = await merged.save();
      setResult(new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" }));
      setPageCount(totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Merge failed. Please check your files.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropZone
        accept="application/pdf"
        multiple
        files={files}
        onFiles={setFiles}
        label="Click or drag PDF files here"
        hint="Add 2 or more PDFs — they'll be merged in the order shown below"
      />

      {files.length > 0 && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </p>
              {files.length > 0 && (
                <button onClick={() => { setFiles([]); setResult(null); }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                  Clear all
                </button>
              )}
            </div>
            <ul className="space-y-1.5">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`}
                  className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
                  <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-700 truncate">{f.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                  <button onClick={() => removeFile(i)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button onClick={merge} disabled={processing || files.length < 2}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors">
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing ? "Merging…" : `Merge ${files.length} PDFs`}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">Merged successfully!</p>
            <p className="text-xs text-green-600 mt-0.5">{files.length} files · {pageCount} total pages</p>
          </div>
          <DownloadButton blob={result} filename="merged.pdf" label="Download PDF" />
        </div>
      )}
    </div>
  );
}
