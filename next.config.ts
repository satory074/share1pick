import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '3rd.produce101.jp',
        pathname: '/static/produce101s3/profile/**',
      },
      {
        protocol: 'https',
        hostname: 'kprofiles.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'kpopping.com',
        pathname: '/documents/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      }
    ]
  }
};

export default nextConfig;
