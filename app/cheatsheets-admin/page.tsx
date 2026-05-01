"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, FileText, Plus, IndianRupee } from "lucide-react";

type Cheatsheet = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  pages: number;
  is_published: boolean;
  is_free: boolean;
  created_at: string;
  preview_image_url: string | null;
};

export default function CheatsheetAdminPage() {
  const [sheets, setSheets] = useState<Cheatsheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cheatsheets-admin")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSheets(data);
        } else {
          setFetchError(data?.error ?? "Unexpected response from server");
        }
        setLoading(false);
      })
      .catch(() => { setFetchError("Failed to connect to server"); setLoading(false); });
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
    <div className="bg-red-900/20 border border-red-700 text-red-400 text-sm rounded-xl px-5 py-4 mt-4">
      <p className="font-medium mb-1">Failed to load cheatsheets</p>
      <p className="text-red-500">{fetchError}</p>
      <p className="mt-3 text-gray-400 text-xs">Make sure you have run the SQL to create the <code>cheatsheets</code> table in Supabase.</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Cheatsheets</h1>
          <p className="text-sm text-gray-400 mt-0.5">{sheets.length} total</p>
        </div>
        <Link href="/cheatsheets-admin/new"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New Cheatsheet
        </Link>
      </div>

      {sheets.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No cheatsheets yet</p>
          <Link href="/cheatsheets-admin/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Add First Cheatsheet
          </Link>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Title</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Price</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-400 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sheets.map((s) => (
                <tr key={s.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-white">{s.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{s.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.is_free ? (
                      <span className="text-xs font-semibold text-emerald-400">FREE</span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-sm font-semibold text-white">
                        <IndianRupee className="w-3.5 h-3.5" />{(s.price / 100).toFixed(0)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(s.id, s.is_published)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                        s.is_published
                          ? "bg-emerald-900/40 text-emerald-400 hover:bg-emerald-900/60"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}>
                      {s.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {s.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/cheatsheets/${s.slug}`} target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="Preview">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/cheatsheets-admin/${s.id}/edit`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteSheet(s.id, s.title)} disabled={deleting === s.id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors disabled:opacity-50" title="Delete">
                        <Trash2 className="w-4 h-4" />
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
