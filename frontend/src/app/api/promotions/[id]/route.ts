import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializePromotion } from "@/lib/server/serializers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();
  const existing = await prisma.promotion.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Promocao nao encontrada." }, { status: 404 });
  }

  const promotion = await prisma.promotion.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      discountLabel: body.discountLabel ?? existing.discountLabel,
      productIds: Array.isArray(body.productIds) ? body.productIds : existing.productIds,
      isActive: body.isActive ?? existing.isActive,
      expiresAt:
        body.expiresAt !== undefined
          ? body.expiresAt
            ? new Date(body.expiresAt)
            : null
          : existing.expiresAt
    }
  });

  return NextResponse.json({ promotion: serializePromotion(promotion) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  await prisma.promotion.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
