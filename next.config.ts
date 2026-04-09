import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: '/geo-score',
        destination: '/ai-seo-score',
        permanent: true,
      },
      {
        source: '/geo-remediation',
        destination: '/ai-seo-remediation',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
