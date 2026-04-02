import { NextResponse } from "next/server";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo invalido." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Apenas imagens sao permitidas." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  try {
    const result = await uploadImageToCloudinary(buffer);
    return NextResponse.json({ url: result.secure_url }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Falha no upload da imagem."
      },
      { status: 500 }
    );
  }
}
