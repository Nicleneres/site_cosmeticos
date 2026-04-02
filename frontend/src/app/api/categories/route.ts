import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializeCategory } from "@/lib/server/serializers";
import { slugify } from "@/lib/utils/format";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ categories: categories.map(serializeCategory) });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: "Nome da categoria e obrigatorio." }, { status: 400 });
  }

  const slug = slugify(body.slug || body.name);
  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug,
      description: body.description ?? ""
    }
  });

  return NextResponse.json({ category: serializeCategory(category) }, { status: 201 });
}
