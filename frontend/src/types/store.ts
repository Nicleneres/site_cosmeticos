export type ProductSeal = "mais-vendido" | "novo" | "promocao" | "kit" | null;

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  brandId: string;
  categoryId: string;
  subcategory: string;
  price: number;
  promoPrice?: number;
  images: string[];
  stock?: number;
  seal: ProductSeal;
  isActive: boolean;
  featured: boolean;
  isLaunch: boolean;
  bestSeller: boolean;
  keywords: string[];
  usageMode: string;
  benefits: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Brand = {
  id: string;
  name: string;
  slug?: string;
  description: string;
  relatedCategories: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  productIds: string[];
  isActive: boolean;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  rating: number;
  message: string;
  createdAt: string;
};

export type Benefit = {
  id: string;
  title: string;
  description: string;
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroBadge: string;
  bannerText: string;
  aboutShort: string;
  benefits: Benefit[];
};

export type StoreSettings = {
  storeName: string;
  consultantName: string;
  whatsappNumber: string;
  instagramHandle: string;
  instagramUrl: string;
  cityRegion: string;
  supportEmail: string;
  serviceHours: string;
  orderMessageTemplate: string;
  privacyText: string;
  exchangePolicyText: string;
  attendancePolicyText: string;
  independentNotice: string;
};

export type NewsletterLead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: "novo" | "em-andamento" | "finalizado";
  updatedAt?: string;
};

export type ProductSortKey =
  | "price-asc"
  | "price-desc"
  | "best-sellers"
  | "launches";

export type ProductFilters = {
  search: string;
  brandId: string;
  categoryId: string;
  priceRange: "all" | "0-79" | "80-149" | "150+";
  promotionsOnly: boolean;
  launchesOnly: boolean;
  sortBy: ProductSortKey;
};

export type StoreData = {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  promotions: Promotion[];
  testimonials: Testimonial[];
  homeContent: HomeContent;
  settings: StoreSettings;
  newsletterLeads: NewsletterLead[];
  contactMessages: ContactMessage[];
  orders: Order[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
};
