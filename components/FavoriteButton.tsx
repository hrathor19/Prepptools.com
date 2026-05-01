"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, getAuthClient } from "@/components/AuthProvider";

export default function FavoriteButton({ slug }: { slug: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [faved, setFaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    const client = getAuthClient();
    client
      .from("user_favourites")
      .select("id")
      .eq("user_id", user.id)
      .eq("tool_slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setFaved(!!data);
      });
  }, [user, slug]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    setBusy(true);
    const client = getAuthClient();
    if (faved) {
      const { error } = await client
        .from("user_favourites")
        .delete()
        .eq("user_id", user.id)
        .eq("tool_slug", slug);
      if (!error) setFaved(false);
    } else {
      const { error } = await client
        .from("user_favourites")
        .insert({ user_id: user.id, tool_slug: slug });
      if (!error) setFaved(true);
    }
    setBusy(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={faved ? "Remove from favourites" : "Add to favourites"}
      className={`w-7 h-7 flex items-center justify-center rounded-full transition-all duration-150 disabled:opacity-50 ${
        faved
          ? "bg-red-50 dark:bg-red-900/30 text-red-500"
          : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
      }`}
    >
      <Heart className={`w-3.5 h-3.5 ${faved ? "fill-current" : ""}`} />
    </button>
  );
}
