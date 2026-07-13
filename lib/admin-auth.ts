import { cookies } from "next/headers";
import { createAdminToken, verifyAdminToken } from "@/lib/admin-token";

// Fails closed: if ADMIN_SECRET isn't configured, no cookie value can authenticate.
export async function isAdminAuthenticated() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return verifyAdminToken(token, secret);
}

// Throws if ADMIN_SECRET is missing so login/verify routes can never issue a
// cookie that the fail-closed check above would silently reject anyway.
export function requireAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not configured");
  return secret;
}

// Issues a signed, expiring session token — never the raw secret itself —
// so a leaked cookie can't be replayed indefinitely.
export async function issueAdminToken(): Promise<string> {
  return createAdminToken(requireAdminSecret());
}
