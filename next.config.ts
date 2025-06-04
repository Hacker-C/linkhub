// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [] // 你的图片配置
  },
  output: 'standalone',
}

export default nextConfig
