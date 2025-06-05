import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Webpack 配置：别名映射到你的 Prisma Client 自定义输出目录
  webpack: (config, { isServer }) => {
    config.resolve.alias["@/actions/generated/client"] = path.resolve(
      __dirname,
      "src/actions/generated/client"
    );

    if (isServer) {
      // 解决 Prisma 在 Vercel 找不到 query engine 的问题
      config.externalsPresets = { node: true };
    }

    return config;
  },
};

export default nextConfig;
