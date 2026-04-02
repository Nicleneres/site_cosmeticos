import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name || !body?.phone || !body?.message) {
    return NextResponse.json(
      { error: "Nome, telefone e mensagem sao obrigatorios." },
      { status: 400 }
    );
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: body.name,
      phone: body.phone,
      message: body.message
    }
  });

  return NextResponse.json({ message }, { status: 201 });
}
