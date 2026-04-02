import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { mapSealToDb, serializeProduct } from "@/lib/server/serializers";
import { slugify } from "@/lib/utils/format";

function resolveFinalPrice(product: { promotionalPrice: Prisma.Decimal | null; price: Prisma.Decimal }) {
  return product.promotionalPrice ? product.promotionalPrice.toNumber() : product.price.toNumber();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const brandId = searchParams.get("brandId");
  const categoryId = searchParams.get("categoryId");
  const priceRange = searchParams.get("priceRange");
  const promotionsOnly = searchParams.get("promotionsOnly") === "true";
  const launchesOnly = searchParams.get("launchesOnly") === "true";
  const sortBy = searchParams.get("sortBy") ?? "price-asc";
  const includeInactive = searchParams.get("includeInactive") === "true";

  const where: Prisma.ProductWhereInput = {};

  if (!includeInactive) where.isActive = true;
  if (brandId && brandId !== "all") where.brandId = brandId;
  if (categoryId && categoryId !== "all") where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
      { fullDescription: { contains: search, mode: "insensitive" } },
      { subcategory: { contains: search, mode: "insensitive" } },
      { keywords: { has: search.toLowerCase() } }
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  let filtered = products.filter((product) => {
    const finalPrice = resolveFinalPrice(product);
    if (priceRange === "0-79" && (finalPrice < 0 || finalPrice > 79.99)) return false;
    if (priceRange === "80-149" && (finalPrice < 80 || finalPrice > 149.99)) return false;
    if (priceRange === "150+" && finalPrice < 150) return false;
    if (promotionsOnly && !product.promotionalPrice) return false;
    if (launchesOnly && !product.isLaunch) return false;
    return true;
  });

  filtered = filtered.sort((a, b) => {
    if (sortBy === "price-desc") return resolveFinalPrice(b) - resolveFinalPrice(a);
    if (sortBy === "best-sellers") return Number(b.bestSeller) - Number(a.bestSeller);
    if (sortBy === "launches") return Number(b.isLaunch) - Number(a.isLaunch);
    return resolveFinalPrice(a) - resolveFinalPrice(b);
  });

  return NextResponse.json({
    products: filtered.map(serializeProduct)
  });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const body = await request.json();

  if (!body?.name || !body?.brandId || !body?.categoryId) {
    return NextResponse.json(
      { error: "Nome, marca e categoria sao obrigatorios." },
      { status: 400 }
    );
  }

  const baseSlug = slugify(body.slug || body.name);
  const existingSlug = await prisma.product.findUnique({ where: { slug: baseSlug } });
  const slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug,
      shortDescription: body.shortDescription ?? "",
      fullDescription: body.fullDescription ?? "",
      brandId: body.brandId,
      categoryId: body.categoryId,
      subcategory: body.subcategory ?? "Geral",
      price: new Prisma.Decimal(body.price ?? 0),
      promotionalPrice:
        body.promoPrice || body.promotionalPrice
          ? new Prisma.Decimal(body.promoPrice ?? body.promotionalPrice)
          : null,
      images: Array.isArray(body.images) ? body.images : [],
      stock: typeof body.stock === "number" ? body.stock : null,
      seal: mapSealToDb(body.seal ?? null),
      isActive: body.isActive ?? true,
      featured: body.featured ?? false,
      isLaunch: body.isLaunch ?? false,
      bestSeller: body.bestSeller ?? false,
      keywords: Array.isArray(body.keywords) ? body.keywords : [],
      usageMode: body.usageMode ?? "",
      benefits: Array.isArray(body.benefits) ? body.benefits : []
    }
  });

  return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
}
