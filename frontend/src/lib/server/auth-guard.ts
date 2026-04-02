import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
}
