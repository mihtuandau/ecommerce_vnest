import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization — add your domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
