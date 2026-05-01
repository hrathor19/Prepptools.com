import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PostForm from "@/components/admin/PostForm";

export const metadata = { title: "New Post" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Blog Posts
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">New Post</h1>
        <p className="text-sm text-gray-500 mt-0.5">Write and publish a new blog post</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8">
        <PostForm />
      </div>
    </div>
  );
}
