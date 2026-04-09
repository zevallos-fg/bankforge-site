import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://bankforge.ai',                         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: 'https://bankforge.ai/for-banks',               lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://bankforge.ai/for-credit-unions',       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://bankforge.ai/for-rias',                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://bankforge.ai/insights',                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://bankforge.ai/insights/bank-ai-score',  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://bankforge.ai/ai-seo-remediation',         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://bankforge.ai/ai-seo-score',               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://bankforge.ai/sec-marketing-rule-audit',  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}
