import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializeCategory } from "@/lib/server/serializers";
import { slugify } from "@/lib/utils/format";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Categoria nao encontrada." }, { status: 404 });
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      slug: slugify(body.slug || body.name || existing.name),
      description: body.description ?? existing.description
    }
  });

  return NextResponse.json({ category: serializeCategory(category) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: "Nao e possivel remover categoria com produtos vinculados." },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
