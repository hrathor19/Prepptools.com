import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/admin-data";
import { PenSquare, Trash2, Eye, EyeOff, PlusCircle, Heart } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "All Posts" };

export default async function AdminDashboard() {
  const posts = await getAllPostsAdmin();

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">All Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {posts.length} total · {published} published · {drafts} draft{drafts !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl py-16 text-center">
          <p className="text-gray-500 mb-4">No posts yet</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Post</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">
                  <Heart className="w-3.5 h-3.5 inline" />
                </th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {post.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={post.coverImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <span className="text-xl w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">{post.coverEmoji}</span>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-xs">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-400 font-mono truncate">/blog/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-4 text-center hidden md:table-cell">
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                        <Eye className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-gray-500 hidden md:table-cell">
                    {post.likes}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <PenSquare className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <DeleteButton id={post.id} title={post.title} />
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
