import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/server/serializers";

export async function findProductBySlug(slug: string, options?: { includeInactive?: boolean }) {
  const product = await prisma.product.findUnique({
    where: { slug }
  });

  if (!product) return null;
  if (!options?.includeInactive && !product.isActive) return null;
  return serializeProduct(product);
}

export async function listProductSlugs() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true }
  });
  return products.map((product) => product.slug);
}
