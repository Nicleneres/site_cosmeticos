import { prisma } from "@/lib/prisma";
import { resolveSettingsFromEntries, serializeBrand, serializeCategory, serializeContactMessage, serializeNewsletterLead, serializeOrder, serializeProduct, serializePromotion, serializeTestimonial } from "@/lib/server/serializers";
import { defaultStoreData } from "@/lib/data/default-store";
import { StoreData } from "@/types/store";

export async function getStoreData(options?: { includeAdminData?: boolean }): Promise<StoreData> {
  const includeAdminData = options?.includeAdminData ?? false;

  const [products, brands, categories, promotions, testimonials, settingsEntries] =
    await Promise.all([
      prisma.product.findMany({
        where: includeAdminData ? undefined : { isActive: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.promotion.findMany({
        where: includeAdminData ? undefined : { isActive: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.setting.findMany()
    ]);

  const { settings, homeContent } = resolveSettingsFromEntries(
    settingsEntries.map((entry) => ({ key: entry.key, value: entry.value }))
  );

  let orders = defaultStoreData.orders;
  let newsletterLeads = defaultStoreData.newsletterLeads;
  let contactMessages = defaultStoreData.contactMessages;

  if (includeAdminData) {
    const [ordersRaw, leadsRaw, messagesRaw] = await Promise.all([
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.newsletterLead.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } })
    ]);

    orders = ordersRaw.map(serializeOrder);
    newsletterLeads = leadsRaw.map(serializeNewsletterLead);
    contactMessages = messagesRaw.map(serializeContactMessage);
  }

  return {
    products: products.map(serializeProduct),
    brands: brands.map(serializeBrand),
    categories: categories.map(serializeCategory),
    promotions: promotions.map(serializePromotion),
    testimonials: testimonials.map(serializeTestimonial),
    settings,
    homeContent,
    orders,
    newsletterLeads,
    contactMessages
  };
}
