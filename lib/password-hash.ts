import { randomBytes, scryptSync, timingSafeEqual, createHash } from "crypto";

const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

function verifyScrypt(password: string, stored: string): boolean {
  const [, salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const candidate = scryptSync(password, salt, KEYLEN);
  const expected = Buffer.from(hashHex, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function verifyLegacySha256(password: string, stored: string): boolean {
  const candidate = createHash("sha256").update(password).digest();
  const expected = Buffer.from(stored, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

// `stored` may be either the current salted scrypt format ("scrypt:salt:hash")
// or the legacy unsalted sha256 hex digest this app used to store. When a
// legacy hash verifies, `needsRehash` tells the caller to upgrade it in place
// so the plaintext password is never persisted or logged to migrate it.
export function verifyPassword(password: string, stored: string): { valid: boolean; needsRehash: boolean } {
  if (stored.startsWith("scrypt:")) {
    return { valid: verifyScrypt(password, stored), needsRehash: false };
  }
  const valid = verifyLegacySha256(password, stored);
  return { valid, needsRehash: valid };
}
