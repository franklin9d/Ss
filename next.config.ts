import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Turbopack (Next.js 16 default)
  turbopack: {},

  // Security headers
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  // Externalize native packages for Vercel serverless
  serverExternalPackages: [
    "sharp",
    "tesseract.js",
    "mammoth",
    "archiver",
    "unzipper",
    "bcryptjs",
    "@prisma/client",
    "prisma",
  ],
};

export default nextConfig;
