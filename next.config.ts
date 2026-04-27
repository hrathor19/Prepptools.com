import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "prepptools.com" }],
        destination: "https://www.prepptools.com/:path*",
        permanent: true, // 301 — tells Google this is the canonical domain
      },
    ];
  },
};

export default nextConfig;
