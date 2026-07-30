import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // ── Compiler optimizations ──────────────────────────────────────────────────
  compiler: {
    // Strip console.log in production (saves JS bytes, removes console overhead)
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // ── Package import optimizations ────────────────────────────────────────────
  // Tells Next.js bundler to import only the specific icons/components used,
  // instead of pulling in the entire library. Reduces bundle size significantly.
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
};

export default nextConfig;

