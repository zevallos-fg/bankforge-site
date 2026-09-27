import type { NextConfig } from "next";

/**
 * Redirects.
 *
 * The first two predate this rebuild (/geo-score, /geo-remediation). The rest
 * map the old information architecture onto the new one. They are permanent
 * (301) because the old URLs have been indexed and linked, and losing them would
 * throw away whatever standing those pages have.
 *
 * Note what is NOT here: the bankforge.ai -> tiqsi.ai redirect. That is a
 * domain-level move and belongs to the launch leg, gated on the attorney's Terms
 * and Privacy. Nothing in this branch attaches, detaches or redirects a domain.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      // Pre-existing.
      { source: '/geo-score', destination: '/banks/ai-visibility', permanent: true },
      { source: '/geo-remediation', destination: '/banks/ai-visibility', permanent: true },

      // Audience pages.
      { source: '/for-rias', destination: '/rias', permanent: true },
      { source: '/for-banks', destination: '/banks', permanent: true },
      { source: '/for-credit-unions', destination: '/banks', permanent: true },

      // Product pages, folded under their audience.
      { source: '/sec-marketing-rule-audit', destination: '/rias/compliance', permanent: true },
      { source: '/compliance-review', destination: '/banks/compliance', permanent: true },
      { source: '/ai-seo-score', destination: '/banks/ai-visibility', permanent: true },
      { source: '/ai-seo-remediation', destination: '/banks/ai-visibility', permanent: true },
    ];
  },
};

export default nextConfig;
