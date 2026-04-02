import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializeTestimonial } from "@/lib/server/serializers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();
  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Depoimento nao encontrado." }, { status: 404 });
  }

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      city: body.city ?? existing.city,
      rating: Number(body.rating) || existing.rating,
      message: body.message ?? existing.message
    }
  });

  return NextResponse.json({ testimonial: serializeTestimonial(testimonial) });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
