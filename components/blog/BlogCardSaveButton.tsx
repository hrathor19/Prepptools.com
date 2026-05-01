"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, getAuthClient } from "@/components/AuthProvider";

export default function BlogCardSaveButton({ slug }: { slug: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    const client = getAuthClient();
    client
      .from("user_saved_blogs")
      .select("id")
      .eq("user_id", user.id)
      .eq("blog_slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setSaved(!!data);
      });
  }, [user, slug]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
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

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? "Unsave blog" : "Save blog"}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 disabled:opacity-50 ${
        saved
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          : "bg-white/90 dark:bg-gray-800/90 text-gray-400 dark:text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      }`}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
