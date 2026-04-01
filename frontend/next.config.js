const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
  // Enable compression
  compress: true,
};

module.exports = withSentryConfig(nextConfig, {
  // your Sentry configuration
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  // Upload wider set of client source files for better stack trace resolution
  widenClientFileUpload: true,
  
  // Create a proxy API route to bypass ad-blockers
  tunnelRoute: "/monitoring",
  
  // Suppress non-CI output
  silent: !process.env.CI,
});
