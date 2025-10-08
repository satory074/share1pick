import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '3rd.produce101.jp',
        pathname: '/static/produce101s3/profile/**',
      }
    ]
  }
};

export default nextConfig;
