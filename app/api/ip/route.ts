import { NextRequest, NextResponse } from "next/server";

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
  // Extract real client IP from headers (works on Vercel, Cloudflare, etc.)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp    = req.headers.get("x-real-ip");
  let ip          = (forwarded ? forwarded.split(",")[0] : realIp)?.trim() ?? "unknown";

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
