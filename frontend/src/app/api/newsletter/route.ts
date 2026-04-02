import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name || !body?.phone) {
    return NextResponse.json({ error: "Nome e telefone sao obrigatorios." }, { status: 400 });
  }

  const lead = await prisma.newsletterLead.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email || null
    }
  });

  return NextResponse.json({ lead }, { status: 201 });
}
