// Web Crypto (not Node's `crypto` module) so this works in both the Node
// route handlers and the Edge middleware without a runtime-specific import.
const ALGO = { name: "HMAC", hash: "SHA-256" };
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), ALGO, false, ["sign"]);
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Admin sessions are a signed, expiring token — `${expiry}.${hmac(expiry)}` —
// rather than a session-store lookup. This bounds how long a leaked cookie
// stays valid; the previous scheme used the raw ADMIN_SECRET as the cookie
// with no expiry enforced server-side, so a stolen cookie worked forever.
export async function createAdminToken(secret: string): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const sig = await crypto.subtle.sign(ALGO, await getKey(secret), new TextEncoder().encode(String(expiry)));
  return `${expiry}.${toHex(sig)}`;
}

export async function verifyAdminToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const [expiryStr, sig] = token.split(".");
  const expiry = Number(expiryStr);
  if (!sig || !Number.isFinite(expiry) || Date.now() > expiry) return false;
  const expectedSig = await crypto.subtle.sign(ALGO, await getKey(secret), new TextEncoder().encode(expiryStr));
  return timingSafeEqual(toHex(expectedSig), sig);
}
