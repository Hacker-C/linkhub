// File: next.config.mjs (or next.config.js)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Or any other existing configurations
  images: {
    remotePatterns: [
      // Add any other hostnames you might use here
    ]
  }
};

export default nextConfig;