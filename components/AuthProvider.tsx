"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { User, SupabaseClient } from "@supabase/supabase-js";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  unreadCount: number;
  refreshUnread: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  unreadCount: 0,
  refreshUnread: () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

let _browserClient: SupabaseClient | null = null;

export function getAuthClient(): SupabaseClient {
  if (!_browserClient) {
    _browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _browserClient;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async (userId: string) => {
    const client = getAuthClient();
    const { count } = await client
      .from("user_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);
    setUnreadCount(count ?? 0);
  };

  useEffect(() => {
    const client = getAuthClient();

    client.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) fetchUnread(u.id);
    });

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) fetchUnread(u.id);
      else setUnreadCount(0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshUnread = () => {
    if (user) fetchUnread(user.id);
  };

  const signInWithGoogle = async () => {
    const client = getAuthClient();
    await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    const client = getAuthClient();
    await client.auth.signOut();
    setUnreadCount(0);
  };

  return (
    <AuthContext.Provider value={{ user, loading, unreadCount, refreshUnread, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
