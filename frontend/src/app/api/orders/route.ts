import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializeOrder } from "@/lib/server/serializers";

type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  notes?: string;
  items: Array<{ productId: string; quantity: number }>;
};

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ orders: orders.map(serializeOrder) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateOrderPayload;

  if (!body.customerName?.trim() || !body.customerPhone?.trim() || !Array.isArray(body.items) || !body.items.length) {
    return NextResponse.json(
      { error: "Nome, telefone e itens do pedido sao obrigatorios." },
      { status: 400 }
    );
  }

  const productIds = body.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true
    }
  });

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "Um ou mais produtos sao invalidos." }, { status: 400 });
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const normalizedItems = body.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error("Produto nao encontrado");
    }
    const quantity = Math.max(1, Number(item.quantity) || 1);
    const unitPrice = product.promotionalPrice ?? product.price;
    return {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice,
      subtotal: new Prisma.Decimal(unitPrice.toNumber() * quantity)
    };
  });

  for (const item of normalizedItems) {
    const product = productMap.get(item.productId);
    if (product?.stock !== null && product?.stock !== undefined && product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Estoque insuficiente para ${product.name}.` },
        { status: 400 }
      );
    }
  }

  const total = normalizedItems.reduce((sum, item) => sum + item.subtotal.toNumber(), 0);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        notes: body.notes?.trim() || null,
        total: new Prisma.Decimal(total),
        status: "NOVO",
        items: {
          create: normalizedItems
        }
      },
      include: { items: true }
    });

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);
      if (!product || product.stock === null || product.stock === undefined) continue;

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return createdOrder;
  });

  return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
}
