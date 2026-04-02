import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializeTestimonial } from "@/lib/server/serializers";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ testimonials: testimonials.map(serializeTestimonial) });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const body = await request.json();
  if (!body?.name || !body?.message) {
    return NextResponse.json({ error: "Nome e mensagem sao obrigatorios." }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      name: body.name,
      city: body.city ?? "Brasil",
      rating: Number(body.rating) || 5,
      message: body.message
    }
  });

  return NextResponse.json({ testimonial: serializeTestimonial(testimonial) }, { status: 201 });
}
