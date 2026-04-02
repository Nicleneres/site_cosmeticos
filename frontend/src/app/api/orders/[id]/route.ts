import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapOrderStatusToDb, serializeOrder } from "@/lib/server/serializers";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const { id } = await context.params;
  const body = await request.json();

  if (!body.status) {
    return NextResponse.json({ error: "Status e obrigatorio." }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Pedido nao encontrado." }, { status: 404 });
  }

  const allowed = ["novo", "em-andamento", "finalizado"];
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: "Status invalido." }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: mapOrderStatusToDb(body.status)
    },
    include: { items: true }
  });

  return NextResponse.json({ order: serializeOrder(order) });
}
