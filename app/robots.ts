import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://ccrt2.github.io/CCRT2_Portfolio/sitemap.xml' };
}
