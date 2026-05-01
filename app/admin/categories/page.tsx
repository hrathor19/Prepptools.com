import Link from "next/link";
import { getAdminClient } from "@/lib/supabase";
import CategoryManager from "@/components/admin/CategoryManager";
import { Tag, ArrowLeft } from "lucide-react";

export const metadata = { title: "Categories | Admin" };
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const admin = getAdminClient();
  const { data } = await admin
    .from("course_categories")
    .select("id, name")
    .order("name");

  const categories: { id: string; name: string }[] = data ?? [];

  return (
    <div className="space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard
      </Link>
      <div className="flex items-center gap-3">
        <Tag className="w-6 h-6 text-orange-400" />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Course Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage categories used when uploading courses.
          </p>
        </div>
      </div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
