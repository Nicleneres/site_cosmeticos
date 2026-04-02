import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStoreData } from "@/lib/server/store-service";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const includeAdminData = session?.user?.role === "ADMIN";
  const storeData = await getStoreData({ includeAdminData });
  return NextResponse.json(storeData);
}
