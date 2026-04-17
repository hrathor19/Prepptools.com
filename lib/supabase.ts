import { createClient } from "@supabase/supabase-js";

// Lazy singleton — initialised on first use, not at module evaluation.
// This prevents build-time crashes when env vars are not yet available.
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
    _client = createClient(url, key);
  }
  return _client;
}

// Convenience alias — drop-in replacement for the old `supabase` export.
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    return (getSupabase() as Record<string | symbol, unknown>)[prop];
  },
});

// Admin client — uses service role key. ONLY use server-side (API routes, Server Actions).
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars for admin client.");
  return createClient(url, key);
}
