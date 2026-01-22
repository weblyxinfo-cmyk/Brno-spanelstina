import type { NextConfig } from "next";

// ===========================================
// Environment Validation on Build
// ===========================================

const requiredEnvVars = [
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "JWT_SECRET",
] as const;

// Only validate in production builds, not during development
if (process.env.NODE_ENV === "production") {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("\n");
    console.error("=".repeat(60));
    console.error("BUILD ERROR: Missing required environment variables");
    console.error("=".repeat(60));
    missing.forEach((key) => {
      console.error(`  - ${key}`);
    });
    console.error("");
    console.error("Please set these variables in your deployment environment.");
    console.error("See .env.example for documentation.");
    console.error("=".repeat(60));
    console.error("\n");

    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// ===========================================
// Next.js Configuration
// ===========================================

const nextConfig: NextConfig = {
  devIndicators: false,

  // Image optimization configuration
  // Images should be placed in /public/images/ directory
  // Recommended structure:
  //   /public/images/hero/      - Hero and banner images
  //   /public/images/courses/   - Course-related images
  //   /public/images/team/      - Instructor/team photos
  //   /public/images/icons/     - Icons and small graphics
  images: {
    // Remote image domains for external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placeholder.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],

    // Supported formats (Next.js will serve the best format based on browser support)
    formats: ["image/avif", "image/webp"],

    // Device sizes for responsive images (viewport widths)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for the `sizes` prop (when using layout="responsive" or layout="fill")
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
