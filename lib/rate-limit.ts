// Best-effort in-memory fixed-window rate limiter. It stops casual scripted
// abuse of unauthenticated write endpoints (form spam, like-count flooding)
// on a single long-running Node process. It is NOT a substitute for a shared
// store (Redis/Upstash) if this app ever runs as multiple serverless
// instances — each instance would track its own counts.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

// A client can send its own X-Forwarded-For header. Our reverse proxy (Vercel
// or an equivalent single-hop proxy in front of this app) appends the real
// connecting IP as the LAST entry rather than overwriting the header, so the
// first entry is attacker-controlled and must never be trusted — only the
// last one is guaranteed to have been set by our own infrastructure.
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim()).filter(Boolean);
    if (ips.length > 0) return ips[ips.length - 1];
  }
  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

export function rateLimitByIp(request: Request, routeKey: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (Math.random() < 0.01) sweep(now);

  const key = `${routeKey}:${getClientIp(request)}`;
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}
