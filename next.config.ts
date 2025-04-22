import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // This disables ESLint checking during the build process
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
