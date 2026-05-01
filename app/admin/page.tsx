import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/admin-data";
import { getAdminClient } from "@/lib/supabase";
import { PlusCircle, PenSquare, FileText, MessageCircle, BookMarked, ArrowRight, Tag } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard | Admin" };

export default async function AdminDashboard() {
  const admin = getAdminClient();

  const [posts, { data: sheets }, { count: qaCount }, { count: catCount }] = await Promise.all([
    getAllPostsAdmin(),
    admin.from("cheatsheets").select("id, title, slug, is_published, is_free, price, created_at").order("created_at", { ascending: false }),
    admin.from("questions").select("*", { count: "exact", head: true }).eq("is_answered", false),
    admin.from("course_categories").select("*", { count: "exact", head: true }),
  ]);

  const publishedPosts = posts.filter((p) => p.published).length;
  const publishedSheets = (sheets ?? []).filter((s) => s.is_published).length;
  const recentPosts = posts.slice(0, 4);
  const recentSheets = (sheets ?? []).slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your content</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Blog Posts" value={posts.length}
          sub={`${publishedPosts} published · ${posts.length - publishedPosts} draft`}
          color="orange" icon={<PenSquare className="w-5 h-5" />} href="/admin/posts" />
        <StatCard label="Courses" value={sheets?.length ?? 0}
          sub={`${publishedSheets} published`}
          color="emerald" icon={<BookMarked className="w-5 h-5" />} href="/admin/cheatsheets" />
        <StatCard label="Categories" value={catCount ?? 0}
          sub="course categories"
          color="purple" icon={<Tag className="w-5 h-5" />} href="/admin/categories" />
        <StatCard label="Q&A Pending" value={qaCount ?? 0}
          sub="unanswered questions"
          color={qaCount ? "red" : "gray"} icon={<MessageCircle className="w-5 h-5" />} href="/admin/qa" />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-colors">
            <PlusCircle className="w-4 h-4" /> New Blog Post
          </Link>
          <Link href="/admin/cheatsheets/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
            <PlusCircle className="w-4 h-4" /> New Course
          </Link>
          <Link href="/admin/categories"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
            <Tag className="w-4 h-4" /> Manage Categories
          </Link>
          <Link href="/admin/qa"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
            <MessageCircle className="w-4 h-4" /> Answer Q&amp;A
            {(qaCount ?? 0) > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{qaCount}</span>
            )}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Blog Posts</h2>
            <Link href="/admin/posts" className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">No posts yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentPosts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                  <span className="text-base w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg shrink-0">{p.coverEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${p.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.published ? "Live" : "Draft"}
                  </span>
                  <Link href={`/admin/posts/${p.id}/edit`} className="text-gray-400 hover:text-orange-600 transition-colors shrink-0">
                    <PenSquare className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Courses</h2>
            <Link href="/admin/cheatsheets" className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentSheets.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">No courses yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentSheets.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.title}</p>
                    <p className="text-xs text-gray-400">{s.is_free ? "Free" : `₹${(s.price / 100).toFixed(0)}`}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${s.is_published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.is_published ? "Live" : "Draft"}
                  </span>
                  <Link href={`/admin/cheatsheets/${s.id}/edit`} className="text-gray-400 hover:text-emerald-600 transition-colors shrink-0">
                    <PenSquare className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color, icon, href }: {
  label: string; value: number | string; sub: string; color: string; icon: React.ReactNode; href: string;
}) {
  const colors: Record<string, string> = {
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-100 text-gray-500",
  };
  return (
    <Link href={href} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 transition-colors block">
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 ${colors[color]}`}>{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </Link>
  );
}
