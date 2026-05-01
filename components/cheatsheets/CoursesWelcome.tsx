"use client";

import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";

export default function CoursesWelcome() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  const name = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "there";
  const firstName = name.split(" ")[0];
  const avatarUrl = user.user_metadata?.avatar_url ?? null;
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  const createdAt     = user.created_at ? new Date(user.created_at).getTime() : 0;
  const lastSignIn    = user.last_sign_in_at ? new Date(user.last_sign_in_at).getTime() : 0;
  const isNewUser     = lastSignIn - createdAt < 5 * 60 * 1000;

  return (
    <div className="flex items-center gap-5 py-7 border-b border-gray-200">
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} width={64} height={64}
          className="rounded-full shrink-0 object-cover" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNewUser ? `Welcome, ${firstName}` : `Welcome back, ${firstName}`}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isNewUser ? "Start your learning journey today" : "Continue where you left off"}
        </p>
      </div>
    </div>
  );
}
