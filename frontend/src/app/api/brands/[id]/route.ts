import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializeBrand } from "@/lib/server/serializers";
import { slugify } from "@/lib/utils/format";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();

  const existing = await prisma.brand.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Marca nao encontrada." }, { status: 404 });
  }

  const brand = await prisma.brand.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      slug: slugify(body.slug || body.name || existing.name),
      description: body.description ?? existing.description,
      relatedCategories: Array.isArray(body.relatedCategories)
        ? body.relatedCategories
        : existing.relatedCategories,
      isActive: body.isActive ?? existing.isActive
    }
  });

  return NextResponse.json({ brand: serializeBrand(brand) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const productCount = await prisma.product.count({ where: { brandId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: "Nao e possivel remover marca com produtos vinculados." },
      { status: 409 }
    );
  }

  await prisma.brand.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
