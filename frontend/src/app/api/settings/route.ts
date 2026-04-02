import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { defaultHomeContent, defaultStoreSettings } from "@/lib/data/default-store";
import { requireAdminSession, unauthorizedResponse } from "@/lib/server/auth-guard";
import { resolveSettingsFromEntries } from "@/lib/server/serializers";
import { HomeContent, StoreSettings } from "@/types/store";

type SettingsPatchPayload = {
  settings?: StoreSettings;
  homeContent?: HomeContent;
};

export async function GET() {
  const entries = await prisma.setting.findMany();
  const { settings, homeContent } = resolveSettingsFromEntries(
    entries.map((entry) => ({ key: entry.key, value: entry.value }))
  );
  return NextResponse.json({ settings, homeContent });
}

export async function PATCH(request: Request) {
  const session = await requireAdminSession();
  if (!session) return unauthorizedResponse();

  const body = (await request.json()) as SettingsPatchPayload;

  const settings = body.settings ? { ...defaultStoreSettings, ...body.settings } : undefined;
  const homeContent = body.homeContent
    ? {
        ...defaultHomeContent,
        ...body.homeContent,
        benefits: body.homeContent.benefits?.length
          ? body.homeContent.benefits
          : defaultHomeContent.benefits
      }
    : undefined;

  if (settings) {
    await prisma.setting.upsert({
      where: { key: "store_settings" },
      update: { value: settings },
      create: { key: "store_settings", value: settings }
    });
  }

  if (homeContent) {
    await prisma.setting.upsert({
      where: { key: "home_content" },
      update: { value: homeContent },
      create: { key: "home_content", value: homeContent }
    });
  }

  const entries = await prisma.setting.findMany();
  const resolved = resolveSettingsFromEntries(entries.map((entry) => ({ key: entry.key, value: entry.value })));
  return NextResponse.json(resolved);
}
