import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimitByIp } from "@/lib/rate-limit";

function isPrivateIP(ip: string) {
  return (
    ip === "unknown" ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip.startsWith("::ffff:127.") ||
    ip.startsWith("fc") ||
    ip.startsWith("fd")
  );
}

export async function GET(req: NextRequest) {
  // This route proxies two third-party geo APIs on the caller's behalf, so it
  // must be rate-limited per-IP to stop it being used as a free bulk lookup
  // relay against ip-api.com's free-tier quota (45 req/min, shared by our
  // whole server).
  if (!rateLimitByIp(req, "ip-lookup", 10, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  // Extract real client IP from headers (works on Vercel, Cloudflare, etc.)
  let ip = getClientIp(req);

  // In development the IP is always 127.0.0.1 / ::1.
  // Fall back to fetching the machine's real public IP from ipify.
  if (isPrivateIP(ip)) {
    try {
      const pub = await fetch("https://api.ipify.org?format=json", { cache: "no-store" });
      const { ip: publicIp } = await pub.json();
      ip = publicIp;
    } catch {
      // If ipify is unreachable, ip-api will still return a clear error
    }
  }

  try {
    // ip-api.com — free, no API key, no plan restrictions for server-side use
    const fields = "status,message,country,countryCode,regionName,city,isp,org,lat,lon,timezone,query";
    const res  = await fetch(
      `http://ip-api.com/json/${ip}?fields=${fields}`,
      { cache: "no-store" }
    );
    const data = await res.json();

    if (data.status !== "success") {
      return NextResponse.json({ error: data.message ?? "Lookup failed" }, { status: 502 });
    }

    return NextResponse.json({
      ip:          data.query,
      country:     data.country,
      countryCode: data.countryCode,
      region:      data.regionName,
      city:        data.city,
      isp:         data.isp || data.org || "—",
      timezone:    data.timezone ?? "—",
      latitude:    data.lat,
      longitude:   data.lon,
    });
  } catch {
    return NextResponse.json({ error: "Could not reach geo service." }, { status: 503 });
  }
}
