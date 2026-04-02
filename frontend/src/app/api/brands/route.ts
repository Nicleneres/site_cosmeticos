import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { serializeBrand } from "@/lib/server/serializers";
import { slugify } from "@/lib/utils/format";

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ brands: brands.map(serializeBrand) });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: "Nome da marca e obrigatorio." }, { status: 400 });
  }

  const brand = await prisma.brand.create({
    data: {
      name: body.name,
      slug: slugify(body.slug || body.name),
      description: body.description ?? "",
      relatedCategories: Array.isArray(body.relatedCategories) ? body.relatedCategories : [],
      isActive: body.isActive ?? true
    }
  });

  return NextResponse.json({ brand: serializeBrand(brand) }, { status: 201 });
}
