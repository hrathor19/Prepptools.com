"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, getAuthClient } from "@/components/AuthProvider";

export default function SaveBlogButton({ slug }: { slug: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) { setChecked(true); return; }
    const client = getAuthClient();
    client
      .from("user_saved_blogs")
      .select("id")
      .eq("user_id", user.id)
      .eq("blog_slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setSaved(!!data);
        setChecked(true);
      });
  }, [user, slug]);

  const toggle = async () => {
    if (loading || !checked) return;
    if (!user) { router.push("/login"); return; }
    setBusy(true);
    const client = getAuthClient();
    if (saved) {
      const { error } = await client
        .from("user_saved_blogs")
        .delete()
        .eq("user_id", user.id)
        .eq("blog_slug", slug);
      if (!error) setSaved(false);
    } else {
      const { error } = await client
        .from("user_saved_blogs")
        .insert({ user_id: user.id, blog_slug: slug });
      if (!error) setSaved(true);
    }
    setBusy(false);
  };

  if (!checked) return null;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      title={saved ? "Unsave blog" : "Save blog"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 ${
        saved
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700"
          : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
