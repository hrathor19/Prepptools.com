"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import DownloadButton from "./shared/DownloadButton";
import { Loader2 } from "lucide-react";

export default function CSVToExcel() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    if (files.length === 0) return;
    setProcessing(true);
    setError("");
    setResult(null);

    try {
      const XLSX = await import("xlsx");
      const text = await files[0].text();

      const parsedRows = text.split("\n").map((line) =>
        line.split(",").map((cell) => cell.replace(/^"|"$/g, ""))
      );
      const ws = XLSX.utils.aoa_to_sheet(parsedRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const arrayBuf = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
      const blob = new Blob([arrayBuf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      setResult(blob);
      setPreview(parsedRows.slice(0, 6).map((row) => row.map((cell) => cell.trim())));
    } catch (e) {
      console.error(e);
      setError("Could not parse this CSV file. Make sure it is valid comma-separated text.");
    } finally {
      setProcessing(false);
    }
  }

  const outName = (files[0]?.name ?? "spreadsheet").replace(/\.csv$/i, "") + ".xlsx";

  return (
    <div className="space-y-6">
      <FileDropZone
        accept=".csv,text/csv"
        multiple={false}
        files={files}
        onFiles={(f) => { setFiles(f); setResult(null); setPreview([]); setError(""); }}
        label="Click or drag a .csv file here"
        hint="Comma-separated values (.csv)"
        maxSizeMB={20}
      />

      {files.length > 0 && !result && (
        <button
          onClick={convert}
          disabled={processing}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing ? "Converting…" : "Convert to Excel"}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-green-800">Excel file ready!</p>
              <p className="text-xs text-green-600 mt-0.5">{outName}</p>
            </div>
            <DownloadButton blob={result} filename={outName} label="Download .xlsx" />
          </div>

          {preview.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Preview (first 5 rows)</p>
              <div className="overflow-auto border border-gray-200 rounded-2xl">
                <table className="text-xs text-gray-700 w-full">
                  <tbody>
                    {preview.map((row, ri) => (
                      <tr key={ri} className={ri === 0 ? "bg-gray-50 font-semibold" : "border-t border-gray-100"}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 border-r border-gray-100 last:border-r-0 truncate max-w-[160px]">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
