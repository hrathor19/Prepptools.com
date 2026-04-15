import { createClient } from "@supabase/supabase-js";

// Public client — safe to use in Server Components, Client Components, and API routes for reads
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client — uses service role key. ONLY use server-side (API routes, Server Actions).
// Never import this in a "use client" component.
export function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
