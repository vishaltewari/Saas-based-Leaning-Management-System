import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Allow embedding your app inside Moodle or any other iframe
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // --- Sentry Settings ---
  org: "vishal-ke",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for better stack traces
  widenClientFileUpload: true,

  // Automatically instrument Vercel cron monitors (optional)
  automaticVercelMonitors: true,

  // Reduce bundle size by removing Sentry debug logs
  disableLogger: true,
});
