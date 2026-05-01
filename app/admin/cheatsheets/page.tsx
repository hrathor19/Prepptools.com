"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, FileText, Plus, IndianRupee, ArrowLeft } from "lucide-react";

type Cheatsheet = {
  id: string; slug: string; title: string; description: string;
  price: number; category: string; pages: number;
  is_published: boolean; is_free: boolean;
  created_at: string; preview_image_url: string | null;
};

export default function AdminCheatsheetListPage() {
  const [sheets, setSheets] = useState<Cheatsheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cheatsheets-admin")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSheets(data);
        else setFetchError(data?.error ?? "Unexpected response");
        setLoading(false);
      })
      .catch(() => { setFetchError("Failed to load"); setLoading(false); });
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    const sheet = sheets.find((s) => s.id === id);
    if (!sheet) return;
    await fetch(`/api/cheatsheets-admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sheet, price: sheet.price / 100, isPublished: !current, isFree: sheet.is_free, longDescription: "", pdfPath: sheet.slug }),
    });
    setSheets((prev) => prev.map((s) => s.id === id ? { ...s, is_published: !current } : s));
  };

  const deleteSheet = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/cheatsheets-admin/${id}`, { method: "DELETE" });
    setSheets((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (fetchError) return (
    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4">
      {fetchError}
    </div>
  );

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">{sheets.length} total</p>
        </div>
        <Link href="/admin/cheatsheets/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      {sheets.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-16 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No courses yet</p>
          <Link href="/admin/cheatsheets/new"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" /> Add First Course
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sheets.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{s.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{s.description}</p>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{s.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    {s.is_free ? (
                      <span className="text-xs font-semibold text-emerald-600">FREE</span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-sm font-semibold text-gray-900">
                        <IndianRupee className="w-3.5 h-3.5" />{(s.price / 100).toFixed(0)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => togglePublish(s.id, s.is_published)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors border ${
                        s.is_published
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                      }`}>
                      {s.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {s.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/courses/${s.slug}`} target="_blank"
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Preview
                      </Link>
                      <Link href={`/admin/cheatsheets/${s.id}/edit`}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </Link>
                      <button onClick={() => deleteSheet(s.id, s.title)} disabled={deleting === s.id}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
