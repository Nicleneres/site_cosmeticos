import {
  Brand as DbBrand,
  Category as DbCategory,
  ContactMessage as DbContactMessage,
  NewsletterLead as DbNewsletterLead,
  Order as DbOrder,
  OrderItem as DbOrderItem,
  OrderStatus as DbOrderStatus,
  Product as DbProduct,
  ProductSeal as DbProductSeal,
  Promotion as DbPromotion,
  Testimonial as DbTestimonial
} from "@prisma/client";
import { HomeContent, Order, Product, ProductSeal, StoreSettings } from "@/types/store";
import { defaultHomeContent, defaultStoreSettings } from "@/lib/data/default-store";

function decimalToNumber(value: { toNumber: () => number } | number | null | undefined) {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number") return value;
  return value.toNumber();
}

function mapSealToClient(seal: DbProductSeal | null): ProductSeal {
  if (!seal) return null;
  if (seal === "MAIS_VENDIDO") return "mais-vendido";
  if (seal === "NOVO") return "novo";
  if (seal === "PROMOCAO") return "promocao";
  return "kit";
}

export function mapSealToDb(seal: ProductSeal): DbProductSeal | null {
  if (!seal) return null;
  if (seal === "mais-vendido") return "MAIS_VENDIDO";
  if (seal === "novo") return "NOVO";
  if (seal === "promocao") return "PROMOCAO";
  return "KIT";
}

export function mapOrderStatusToClient(status: DbOrderStatus): Order["status"] {
  if (status === "NOVO") return "novo";
  if (status === "EM_ANDAMENTO") return "em-andamento";
  return "finalizado";
}

export function mapOrderStatusToDb(status: Order["status"]): DbOrderStatus {
  if (status === "novo") return "NOVO";
  if (status === "em-andamento") return "EM_ANDAMENTO";
  return "FINALIZADO";
}

export function serializeProduct(product: DbProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    brandId: product.brandId,
    categoryId: product.categoryId,
    subcategory: product.subcategory,
    price: decimalToNumber(product.price) ?? 0,
    promoPrice: decimalToNumber(product.promotionalPrice),
    images: product.images,
    stock: product.stock ?? undefined,
    seal: mapSealToClient(product.seal),
    isActive: product.isActive,
    featured: product.featured,
    isLaunch: product.isLaunch,
    bestSeller: product.bestSeller,
    keywords: product.keywords,
    usageMode: product.usageMode,
    benefits: product.benefits,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

export function serializeBrand(brand: DbBrand) {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    relatedCategories: brand.relatedCategories,
    isActive: brand.isActive,
    createdAt: brand.createdAt.toISOString(),
    updatedAt: brand.updatedAt.toISOString()
  };
}

export function serializeCategory(category: DbCategory) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString()
  };
}

export function serializePromotion(promotion: DbPromotion) {
  return {
    id: promotion.id,
    title: promotion.title,
    description: promotion.description,
    discountLabel: promotion.discountLabel,
    productIds: promotion.productIds,
    isActive: promotion.isActive,
    expiresAt: promotion.expiresAt?.toISOString(),
    createdAt: promotion.createdAt.toISOString(),
    updatedAt: promotion.updatedAt.toISOString()
  };
}

export function serializeTestimonial(testimonial: DbTestimonial) {
  return {
    id: testimonial.id,
    name: testimonial.name,
    city: testimonial.city,
    rating: testimonial.rating,
    message: testimonial.message,
    createdAt: testimonial.createdAt.toISOString()
  };
}

export function serializeNewsletterLead(lead: DbNewsletterLead) {
  return {
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? undefined,
    createdAt: lead.createdAt.toISOString()
  };
}

export function serializeContactMessage(message: DbContactMessage) {
  return {
    id: message.id,
    name: message.name,
    phone: message.phone,
    message: message.message,
    createdAt: message.createdAt.toISOString()
  };
}

export function serializeOrder(order: DbOrder & { items: DbOrderItem[] }): Order {
  return {
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    notes: order.notes ?? undefined,
    status: mapOrderStatusToClient(order.status),
    total: decimalToNumber(order.total) ?? 0,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.productName,
      quantity: item.quantity,
      price: decimalToNumber(item.unitPrice) ?? 0
    }))
  };
}

type SettingsPayload = {
  store_settings?: unknown;
  home_content?: unknown;
};

function mergeStoreSettings(value: unknown): StoreSettings {
  if (!value || typeof value !== "object") return defaultStoreSettings;
  return { ...defaultStoreSettings, ...(value as Partial<StoreSettings>) };
}

function mergeHomeContent(value: unknown): HomeContent {
  if (!value || typeof value !== "object") return defaultHomeContent;
  const partial = value as Partial<HomeContent>;
  return {
    ...defaultHomeContent,
    ...partial,
    benefits:
      Array.isArray(partial.benefits) && partial.benefits.length
        ? partial.benefits
        : defaultHomeContent.benefits
  };
}

export function resolveSettingsFromEntries(entries: Array<{ key: string; value: unknown }>) {
  const payload = entries.reduce<SettingsPayload>((acc, entry) => {
    if (entry.key === "store_settings") acc.store_settings = entry.value;
    if (entry.key === "home_content") acc.home_content = entry.value;
    return acc;
  }, {});

  return {
    settings: mergeStoreSettings(payload.store_settings),
    homeContent: mergeHomeContent(payload.home_content)
  };
}
