import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/data/products';
import { getOrgData, getCurrentOrgId } from '@/lib/data/org';

const BASE_URL = 'https://devi-shresta-gold.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const orgId = getCurrentOrgId();
  const orgData = await getOrgData(orgId);
  const products = await getProducts(orgId);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/collections`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/book`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/ring-size-guide`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/emi-calculator`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/exchange-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = orgData.categories.map((cat: { slug: string }) => ({
    url: `${BASE_URL}/collections?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/collections/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
