import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `standalone` emits .next/standalone with a self-contained server.js and only
   * the node_modules actually reached at runtime. On a 1 GB shared box that is
   * the difference between shipping ~400 MB of dependencies and ~60 MB.
   */

  // The build box has one core and one thread. Letting Next fan out to a worker
  // pool it does not have just thrashes and OOMs.
  experimental: {
    cpus: 1,
    workerThreads: false,
  },

  images: {
    // AVIF costs noticeably more CPU to encode than WebP. On a single-core box
    // serving a handful of photos, WebP alone is the right trade.
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // The x-powered-by header tells attackers what to target and helps nobody.
  poweredByHeader: false,

  compress: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Next already sets immutable caching on its own fingerprinted assets,
        // so only the files served straight out of /public need a policy.
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, must-revalidate" },
        ],
      },
      {
        source: "/kartikey-fasteners-company-profile.pdf",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
