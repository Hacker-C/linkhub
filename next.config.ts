import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

export default {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'src/db/schema.prisma'),
              to: path.resolve(__dirname, '.next/server/db/schema.prisma'),
            },
          ],
        })
      );
    }
    return config;
  },
};