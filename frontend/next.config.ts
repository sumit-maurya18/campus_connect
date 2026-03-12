import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  reactCompiler: true,

  experimental: {
    staleTimes: {
      dynamic: process.env.NODE_ENV === "development" ? 0 : 60
    }
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      },
      {
        protocol: "http",
        hostname: "**"
      }
    ]
  }

};

export default nextConfig;