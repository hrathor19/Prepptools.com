import { cookies } from "next/headers";

// Fails closed: if ADMIN_SECRET isn't configured, no cookie value can authenticate.
export async function isAdminAuthenticated() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return !!token && token === secret;
}

// Throws if ADMIN_SECRET is missing so login/verify routes can never issue a
// cookie that the fail-closed check above would silently reject anyway.
export function requireAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not configured");
  return secret;
}
