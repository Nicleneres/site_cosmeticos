import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializePromotion } from "@/lib/server/serializers";

export async function GET() {
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ promotions: promotions.map(serializePromotion) });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const body = await request.json();
  if (!body?.title) {
    return NextResponse.json({ error: "Titulo da promocao e obrigatorio." }, { status: 400 });
  }

  const promotion = await prisma.promotion.create({
    data: {
      title: body.title,
      description: body.description ?? "",
      discountLabel: body.discountLabel ?? "Oferta especial",
      productIds: Array.isArray(body.productIds) ? body.productIds : [],
      isActive: body.isActive ?? true,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
    }
  });

  return NextResponse.json({ promotion: serializePromotion(promotion) }, { status: 201 });
}
