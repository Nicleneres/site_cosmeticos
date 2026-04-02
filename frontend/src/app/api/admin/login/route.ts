import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const email = body?.email?.toString().trim().toLowerCase();
  const password = body?.password?.toString();

  if (!email || !password) {
    return NextResponse.json({ error: "E-mail e senha sao obrigatorios." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
  }

  const validPassword = await compare(password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: "Credenciais invalidas." }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}
