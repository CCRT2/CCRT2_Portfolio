import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://ccrt2.github.io/CCRT2_Portfolio/', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
