"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import { downloadBlob } from "./shared/DownloadButton";
import { Loader2, Download } from "lucide-react";

type SheetResult = { name: string; csv: string };

export default function ExcelToCSV() {
  const [files, setFiles] = useState<File[]>([]);
  const [sheets, setSheets] = useState<SheetResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    if (files.length === 0) return;
    setProcessing(true);
    setError("");
    setSheets([]);

    try {
      const XLSX = await import("xlsx");
      const buffer = await files[0].arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });

      const results: SheetResult[] = wb.SheetNames.map((name) => {
        const ws = wb.Sheets[name];
        const csv = XLSX.utils.sheet_to_csv(ws);
        return { name, csv };
      });

      setSheets(results);
    } catch (e) {
      console.error(e);
      setError("Could not read this file. Make sure it is a valid .xlsx or .xls file.");
    } finally {
      setProcessing(false);
    }
  }

  function downloadSheet(sheet: SheetResult) {
    const blob = new Blob([sheet.csv], { type: "text/csv" });
    const base = (files[0]?.name ?? "spreadsheet").replace(/\.(xlsx?|ods)$/i, "");
    downloadBlob(blob, `${base}_${sheet.name}.csv`);
  }

  function downloadAll() {
    sheets.forEach(downloadSheet);
  }

  const baseName = (files[0]?.name ?? "spreadsheet").replace(/\.(xlsx?|ods)$/i, "");

  return (
    <div className="space-y-6">
      <FileDropZone
        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        multiple={false}
        files={files}
        onFiles={(f) => { setFiles(f); setSheets([]); setError(""); }}
        label="Click or drag an Excel file here"
        hint=".xlsx or .xls — all sheets will be converted"
        maxSizeMB={50}
      />

      {files.length > 0 && sheets.length === 0 && (
        <button
          onClick={convert}
          disabled={processing}
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 disabled:opacity-60 transition-colors"
        >
          {processing && <Loader2 className="w-5 h-5 animate-spin" />}
          {processing ? "Converting…" : "Convert to CSV"}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
      )}

      {sheets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {sheets.length} sheet{sheets.length > 1 ? "s" : ""} found
            </p>
            {sheets.length > 1 && (
              <button
                onClick={downloadAll}
                className="flex items-center gap-1.5 text-sm bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download All
              </button>
            )}
          </div>

          <div className="space-y-3">
            {sheets.map((sheet) => (
              <div key={sheet.name} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{sheet.name}</p>
                    <p className="text-xs text-gray-400">
                      {sheet.csv.split("\n").length - 1} rows
                    </p>
                  </div>
                  <button
                    onClick={() => downloadSheet(sheet)}
                    className="flex items-center gap-1.5 text-xs bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    {baseName}_{sheet.name}.csv
                  </button>
                </div>
                <pre className="p-4 text-xs text-gray-600 font-mono bg-gray-50 overflow-auto max-h-48 whitespace-pre">
                  {sheet.csv.split("\n").slice(0, 8).join("\n")}
                  {sheet.csv.split("\n").length > 8 && "\n…"}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
