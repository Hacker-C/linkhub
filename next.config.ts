// File: next.config.mjs (or next.config.js)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Or any other existing configurations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindcss.com',
        port: '',
        pathname: '/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'developer.mozilla.org',
        port: '',
        pathname: '/**', // Allow any path for this hostname
      },
      {
        protocol: 'https',
        hostname: 'static.figma.com',
        port: '',
        pathname: '/app/icon/**',
      },
      {
        protocol: 'https',
        hostname: 'github.githubassets.com',
        port: '',
        pathname: '/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dribbble.com',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/favicon.ico',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sstatic.net',
        port: '',
        pathname: '/Sites/stackoverflow/Img/**',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // For user avatar placeholders
        port: '',
        pathname: '/**',
      },
      // Add any other hostnames you might use here
    ],
  },
};

export default nextConfig;