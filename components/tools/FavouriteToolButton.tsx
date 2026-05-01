"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, getAuthClient } from "@/components/AuthProvider";

export default function FavouriteToolButton({ slug }: { slug: string }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [faved, setFaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) { setChecked(true); return; }
    const client = getAuthClient();
    client
      .from("user_favourites")
      .select("id")
      .eq("user_id", user.id)
      .eq("tool_slug", slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error) setFaved(!!data);
        setChecked(true);
      });
  }, [user, slug]);

  const toggle = async () => {
    if (loading || !checked) return;
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

  if (!checked) return null;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      title={faved ? "Remove from favourites" : "Add to favourites"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 shrink-0 ${
        faved
          ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-700"
          : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-red-300 hover:text-red-500"
      }`}
    >
      <Heart className={`w-4 h-4 ${faved ? "fill-current" : ""}`} />
      {faved ? "Favourited" : "Favourite"}
    </button>
  );
}
