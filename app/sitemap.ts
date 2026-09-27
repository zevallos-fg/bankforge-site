import { MetadataRoute } from 'next';
import { ROUTES, absoluteUrl } from './lib/site';

/**
 * Generated from ROUTES and SITE_URL. No hostname is written here — repointing
 * the site to another domain is one environment variable, not a sitemap edit.
 * /terms and /privacy are deliberately absent: they are noindex until counsel
 * publishes them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
