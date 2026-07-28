import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Enables lean Docker image via .next/standalone
};

export default nextConfig;
