import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPostByIdAdmin } from "@/lib/admin-data";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Post" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Blog Posts
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Post</h1>
        <p className="text-sm text-gray-500 mt-0.5 font-mono">/blog/{post.slug}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8">
        <PostForm post={post} />
      </div>
    </div>
  );
}
