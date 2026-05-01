import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "prepptools.com" }],
        destination: "https://www.prepptools.com/:path*",
        permanent: true,
      },
      {
        source: "/cheatsheets",
        destination: "/courses",
        permanent: true,
      },
      {
        source: "/cheatsheets/:path*",
        destination: "/courses/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
