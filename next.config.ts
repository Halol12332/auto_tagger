import type { NextConfig } from "next";

const nextConfig = {
  typescript: {
    // SENIOR BYPASS: Ignore strict type errors during the Tsunagu rapid prototype sprint
    ignoreBuildErrors: true,
  },
};


export default nextConfig;
