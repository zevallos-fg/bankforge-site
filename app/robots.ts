import { MetadataRoute } from 'next';
import { absoluteUrl, NOINDEX_ROUTES } from './lib/site';

/**
 * AI crawlers are allowed deliberately: being readable by the assistants is the
 * thing this business measures, so excluding them would be incoherent.
 * The unpublished legal pages are disallowed until counsel signs them off.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = [...NOINDEX_ROUTES];

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: 'Googlebot', allow: '/', disallow },
      { userAgent: 'GPTBot', allow: '/', disallow },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow },
      { userAgent: 'ClaudeBot', allow: '/', disallow },
      { userAgent: 'anthropic-ai', allow: '/', disallow },
      { userAgent: 'PerplexityBot', allow: '/', disallow },
      { userAgent: 'Google-Extended', allow: '/', disallow },
      { userAgent: 'cohere-ai', allow: '/', disallow },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
