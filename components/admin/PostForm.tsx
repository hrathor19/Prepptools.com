"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Wand2, ImagePlus, X, Upload } from "lucide-react";
import BlogContent from "@/components/blog/BlogContent";
import type { AdminPost } from "@/lib/admin-data";

type Props = { post?: AdminPost };

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function PostForm({ post }: Props) {
  const isEdit = !!post;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    slug: post?.slug ?? "",
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    author: post?.author ?? "Himanshu Rathore",
    date: post?.date ?? new Date().toISOString().split("T")[0],
    readTime: post?.readTime ?? 5,
    coverImageUrl: post?.coverImageUrl ?? "",
    tags: (post?.tags ?? []).join(", "),
    published: post?.published ?? false,
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  function set(field: string, value: string | boolean | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setUploadError(data.error || "Upload failed");
    } else {
      set("coverImageUrl", data.url);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.slug || !form.title || !form.content) {
      setError("Title, slug, and content are required.");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      readTime: Number(form.readTime),
      coverImageUrl: form.coverImageUrl || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const url = isEdit ? `/api/admin/posts/${post!.id}` : "/api/admin/posts";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const inputCls = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── LEFT: Fields ── */}
        <div className="flex-1 space-y-5">

          {/* Cover Image */}
          <div>
            <label className={labelCls}>Cover Image</label>
            {form.coverImageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.coverImageUrl}
                  alt="Cover"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => set("coverImageUrl", "")}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Upload className="w-3 h-3" /> Replace
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  dragOver
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/50"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                    <p className="text-sm text-gray-500">Uploading…</p>
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-7 h-7 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-orange-600">Click to upload</span> or drag & drop
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP, GIF · Max 5 MB</p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileInput}
            />
            {uploadError && (
              <p className="text-xs text-red-600 mt-1">{uploadError}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className={labelCls}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              placeholder="Your post title"
              className={inputCls}
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>Slug *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                required
                placeholder="my-post-url"
                className={inputCls + " font-mono text-xs"}
              />
              <button
                type="button"
                onClick={() => set("slug", slugify(form.title))}
                title="Generate from title"
                className="flex-shrink-0 flex items-center px-3 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              URL: /blog/<span className="font-mono">{form.slug || "…"}</span>
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelCls}>Excerpt *</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              required
              rows={2}
              placeholder="Short summary shown on the listing page"
              className={inputCls + " resize-none"}
            />
          </div>

          {/* Author / Date / Read time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Author</label>
              <input type="text" value={form.author} onChange={(e) => set("author", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Read (min)</label>
              <input type="number" min={1} max={60} value={form.readTime} onChange={(e) => set("readTime", Number(e.target.value))} className={inputCls} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="productivity, tools, finance"
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3 py-1">
            <button
              type="button"
              onClick={() => set("published", !form.published)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.published ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="text-sm font-medium">
              {form.published
                ? <span className="text-green-700">Published</span>
                : <span className="text-gray-500">Draft</span>}
            </span>
          </div>
        </div>

        {/* ── RIGHT: Content + Preview ── */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelCls + " mb-0"}>Content * (Markdown)</label>
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-600 border border-gray-200 hover:border-orange-300 rounded-lg px-3 py-1.5 transition-colors"
            >
              {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {preview ? "Edit" : "Preview"}
            </button>
          </div>

          {preview ? (
            <div className="flex-1 min-h-[480px] border border-gray-200 rounded-xl p-5 overflow-y-auto bg-white">
              {form.content
                ? <article className="prose"><BlogContent content={form.content} /></article>
                : <p className="text-gray-400 text-sm italic">Nothing to preview yet.</p>}
            </div>
          ) : (
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              required
              placeholder={`## Introduction\n\nWrite your post in Markdown…\n\n### Sub-heading\n\nMore content here.`}
              className={inputCls + " flex-1 min-h-[480px] resize-y font-mono text-xs leading-relaxed"}
            />
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-5">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-6 border-t border-gray-200 mt-6">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-60 transition-colors"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading
            ? isEdit ? "Saving…" : "Publishing…"
            : isEdit ? "Save Changes" : form.published ? "Publish Post" : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-5 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
