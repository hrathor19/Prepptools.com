import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminClient } from "@/lib/supabase";
import CheatsheetForm from "@/components/cheatsheets/CheatsheetForm";

export const metadata = { title: "New Course | Admin" };
export const dynamic = "force-dynamic";

export default async function NewCheatsheetPage() {
  const admin = getAdminClient();
  const { data } = await admin
    .from("course_categories")
    .select("name")
    .order("name");
  const categories = (data ?? []).map((r) => r.name);

  return (
    <div className="space-y-6">
      <Link href="/admin/cheatsheets" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Courses
      </Link>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">New Course</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload a PDF and fill in the details to list it.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8">
        <CheatsheetForm redirectTo="/admin/cheatsheets" categories={categories} />
      </div>
    </div>
  );
}
