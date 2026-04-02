import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { mapSealToDb, serializeProduct } from "@/lib/server/serializers";
import { slugify } from "@/lib/utils/format";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Produto nao encontrado." }, { status: 404 });
  }

  const nextName = body.name ?? existing.name;
  const baseSlug = slugify(body.slug || nextName);
  const duplicate = await prisma.product.findFirst({
    where: {
      slug: baseSlug,
      NOT: { id }
    }
  });
  const slug = duplicate ? `${baseSlug}-${Date.now()}` : baseSlug;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: nextName,
      slug,
      shortDescription: body.shortDescription ?? existing.shortDescription,
      fullDescription: body.fullDescription ?? existing.fullDescription,
      brandId: body.brandId ?? existing.brandId,
      categoryId: body.categoryId ?? existing.categoryId,
      subcategory: body.subcategory ?? existing.subcategory,
      price:
        body.price !== undefined ? new Prisma.Decimal(body.price) : existing.price,
      promotionalPrice:
        body.promoPrice !== undefined || body.promotionalPrice !== undefined
          ? body.promoPrice || body.promotionalPrice
            ? new Prisma.Decimal(body.promoPrice ?? body.promotionalPrice)
            : null
          : existing.promotionalPrice,
      images: Array.isArray(body.images) ? body.images : existing.images,
      stock: body.stock !== undefined ? body.stock : existing.stock,
      seal:
        body.seal !== undefined ? mapSealToDb(body.seal) : existing.seal,
      isActive: body.isActive ?? existing.isActive,
      featured: body.featured ?? existing.featured,
      isLaunch: body.isLaunch ?? existing.isLaunch,
      bestSeller: body.bestSeller ?? existing.bestSeller,
      keywords: Array.isArray(body.keywords) ? body.keywords : existing.keywords,
      usageMode: body.usageMode ?? existing.usageMode,
      benefits: Array.isArray(body.benefits) ? body.benefits : existing.benefits
    }
  });

  return NextResponse.json({ product: serializeProduct(product) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Produto nao encontrado." }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
