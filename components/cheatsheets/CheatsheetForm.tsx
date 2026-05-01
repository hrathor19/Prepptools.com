"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Image, X, Loader2, Eye, EyeOff } from "lucide-react";

type FormData = {
  title: string;
  description: string;
  longDescription: string;
  price: string;
  originalPrice: string;
  category: string;
  tags: string;
  pages: string;
  isPublished: boolean;
  isFree: boolean;
  pdfPath: string;
  previewImageUrl: string;
};

export default function CheatsheetForm({
  initial,
  id,
  redirectTo,
  categories = [],
}: {
  initial?: Partial<FormData>;
  id?: string;
  redirectTo?: string;
  categories?: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    longDescription: initial?.longDescription ?? "",
    price: initial?.price ?? "",
    originalPrice: initial?.originalPrice ?? "",
    category: initial?.category ?? "General",
    tags: initial?.tags ?? "",
    pages: initial?.pages ?? "",
    isPublished: initial?.isPublished ?? false,
    isFree: initial?.isFree ?? false,
    pdfPath: initial?.pdfPath ?? "",
    previewImageUrl: initial?.previewImageUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const uploadFile = async (file: File, type: "pdf" | "image") => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);
    const res = await fetch("/api/cheatsheets-admin/upload-pdf", { method: "POST", body: fd });
    return res.json();
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Only PDF files allowed"); return; }
    setUploadingPdf(true);
    setError(null);
    const data = await uploadFile(file, "pdf");
    if (data.path) set("pdfPath", data.path);
    else setError(data.error ?? "Upload failed");
    setUploadingPdf(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    const data = await uploadFile(file, "image");
    if (data.url) set("previewImageUrl", data.url);
    else setError(data.error ?? "Upload failed");
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pdfPath) { setError("Please upload a PDF file"); return; }
    if (!form.isFree && !form.price) { setError("Set a price or mark as free"); return; }
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const res = await fetch(id ? `/api/cheatsheets-admin/${id}` : "/api/cheatsheets-admin", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to save"); setSaving(false); return; }
    router.push(redirectTo ?? "/admin/cheatsheets");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
          placeholder="e.g. Python for Beginners" />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Short Description *</label>
        <input value={form.description} onChange={(e) => set("description", e.target.value)} required
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
          placeholder="One-line description shown on listing page" />
      </div>

      {/* Content — Markdown editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-300">
            Course Content <span className="text-gray-500 font-normal">(Markdown)</span>
          </label>
          <button
            type="button"
            onClick={() => setPreviewContent((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 border border-gray-700 hover:border-emerald-600 rounded-lg px-3 py-1.5 transition-colors"
          >
            {previewContent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewContent ? "Edit" : "Preview"}
          </button>
        </div>
        {previewContent ? (
          <div className="min-h-[280px] bg-white border border-gray-700 rounded-lg p-4 overflow-y-auto">
            {form.longDescription
              ? <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{form.longDescription}</p>
              : <p className="text-gray-400 text-sm italic">Nothing to preview yet.</p>}
          </div>
        ) : (
          <textarea
            value={form.longDescription}
            onChange={(e) => set("longDescription", e.target.value)}
            rows={12}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 resize-y font-mono leading-relaxed"
            placeholder={`## About this course\n\nDescribe what students will learn...\n\n## What's included\n\n- Topic 1\n- Topic 2\n\n## Who is this for\n\nBeginner to advanced learners...`}
          />
        )}
        <p className="text-xs text-gray-500 mt-1.5">Supports Markdown: **bold**, *italic*, ## headings, - lists</p>
      </div>

      {/* Category + Pages */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500">
            {categories.length === 0 ? (
              <option value={form.category}>{form.category || "No categories"}</option>
            ) : (
              categories.map((c) => <option key={c} value={c}>{c}</option>)
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Pages</label>
          <input type="number" value={form.pages} onChange={(e) => set("pages", e.target.value)} min="0"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
            placeholder="e.g. 4" />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Tags (comma separated)</label>
        <input value={form.tags} onChange={(e) => set("tags", e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
          placeholder="python, programming, basics" />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Pricing</label>
        <div className="flex items-center gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFree} onChange={(e) => set("isFree", e.target.checked)}
              className="w-4 h-4 accent-emerald-500" />
            <span className="text-sm text-gray-300">Free course</span>
          </label>
        </div>
        {!form.isFree && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Selling Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} min="1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="99" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Original Price / MRP <span className="text-gray-600">(shown as strikethrough)</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input type="number" value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} min="1"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-7 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="499" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PDF Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">PDF File *</label>
        {form.pdfPath ? (
          <div className="flex items-center gap-3 bg-gray-800 border border-emerald-700 rounded-lg px-4 py-3">
            <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm text-gray-300 flex-1 truncate">{form.pdfPath}</span>
            <button type="button" onClick={() => set("pdfPath", "")}
              className="text-gray-500 hover:text-red-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => pdfRef.current?.click()}
            disabled={uploadingPdf}
            className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-700 hover:border-emerald-600 rounded-lg py-8 text-gray-400 hover:text-emerald-400 transition-colors disabled:opacity-50">
            {uploadingPdf ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            <span className="text-sm">{uploadingPdf ? "Uploading…" : "Click to upload PDF (max 20MB)"}</span>
          </button>
        )}
        <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
      </div>

      {/* Preview Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Image (optional)</label>
        {form.previewImageUrl ? (
          <div className="relative w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.previewImageUrl} alt="Cover" className="w-40 h-28 object-cover rounded-lg" />
            <button type="button" onClick={() => set("previewImageUrl", "")}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => imgRef.current?.click()}
            disabled={uploadingImage}
            className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gray-700 hover:border-emerald-600 rounded-lg text-gray-400 hover:text-emerald-400 text-sm transition-colors disabled:opacity-50">
            {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
            {uploadingImage ? "Uploading…" : "Upload cover image"}
          </button>
        )}
        <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Publish toggle */}
      <div className="flex items-center gap-3 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)}
            className="w-4 h-4 accent-emerald-500" />
          <span className="text-sm text-gray-300">Publish immediately</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving…" : id ? "Update Course" : "Create Course"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
