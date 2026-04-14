import type { MetadataRoute } from "next";
import { getProducts } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts({ limit: 50000, isAvailable: "true" });
  const productUrls: MetadataRoute.Sitemap = products.data.map((product) => ({
    url: `https://wazeerstoreofficial.com/product/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [
    {
      url: "https://wazeerstoreofficial.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://wazeerstoreofficial.com/store",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
  ];
}
