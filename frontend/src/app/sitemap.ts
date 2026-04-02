import { MetadataRoute } from "next";
import { listProductSlugs } from "@/lib/server/product-queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bella-aura-atelier.vercel.app";

  const staticRoutes = [
    "",
    "/produtos",
    "/marcas",
    "/kits",
    "/promocoes",
    "/sobre",
    "/depoimentos",
    "/contato",
    "/sacola",
    "/politicas",
    "/faq"
  ];

  const staticItems = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7
  }));

  let productItems: MetadataRoute.Sitemap = [];
  if (process.env.DATABASE_URL) {
    try {
      const slugs = await listProductSlugs();
      productItems = slugs.map((slug) => ({
        url: `${baseUrl}/produtos/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8
      }));
    } catch {
      productItems = [];
    }
  }

  return [...staticItems, ...productItems];
}
