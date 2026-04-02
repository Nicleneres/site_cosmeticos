"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useSession } from "next-auth/react";
import { defaultStoreData } from "@/lib/data/default-store";
import {
  Brand,
  CartItem,
  Category,
  ContactMessage,
  HomeContent,
  NewsletterLead,
  Order,
  Product,
  Promotion,
  StoreData,
  StoreSettings,
  Testimonial
} from "@/types/store";

type CreateProductInput = Omit<Product, "id" | "slug"> & { slug?: string };

type StoreContextValue = {
  storeData: StoreData;
  cart: CartItem[];
  isHydrated: boolean;
  cartCount: number;
  cartTotal: number;
  refreshStoreData: () => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (payload: {
    customerName: string;
    customerPhone: string;
    notes?: string;
  }) => Promise<Order>;
  addProduct: (product: CreateProductInput) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  addBrand: (brand: Omit<Brand, "id">) => Promise<void>;
  updateBrand: (brand: Brand) => Promise<void>;
  removeBrand: (brandId: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id" | "slug"> & { slug?: string }) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
  addPromotion: (promotion: Omit<Promotion, "id">) => Promise<void>;
  updatePromotion: (promotion: Promotion) => Promise<void>;
  removePromotion: (promotionId: string) => Promise<void>;
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt">) => Promise<void>;
  updateTestimonial: (testimonial: Testimonial) => Promise<void>;
  removeTestimonial: (testimonialId: string) => Promise<void>;
  updateHomeContent: (content: HomeContent) => Promise<void>;
  updateSettings: (settings: StoreSettings) => Promise<void>;
  addNewsletterLead: (lead: Omit<NewsletterLead, "id" | "createdAt">) => Promise<void>;
  addContactMessage: (message: Omit<ContactMessage, "id" | "createdAt">) => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function resolveCartTotal(cart: CartItem[], products: Product[]): number {
  return cart.reduce((total, item) => {
    const product = products.find((productItem) => productItem.id === item.productId);
    if (!product) return total;
    const unit = product.promoPrice ?? product.price;
    return total + unit * item.quantity;
  }, 0);
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    let message = "Erro ao processar solicitacao.";
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore json parsing error
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [storeData, setStoreData] = useState<StoreData>(defaultStoreData);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const refreshStoreData = useCallback(async () => {
    const data = await fetchJson<StoreData>("/api/store", {
      cache: "no-store"
    });
    setStoreData(data);
  }, []);

  useEffect(() => {
    refreshStoreData()
      .catch(() => {
        setStoreData(defaultStoreData);
      })
      .finally(() => setIsHydrated(true));
  }, [refreshStoreData]);

  useEffect(() => {
    if (!isHydrated) return;
    refreshStoreData().catch(() => {
      // ignore
    });
  }, [status, isHydrated, refreshStoreData]);

  const getProductById = useCallback(
    (productId: string) => storeData.products.find((product) => product.id === productId),
    [storeData.products]
  );

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((current) => {
      const hasItem = current.find((item) => item.productId === productId);
      if (hasItem) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
            : item
        );
      }
      return [...current, { productId, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.productId !== productId));
      return;
    }
    setCart((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const createOrder = useCallback(
    async (payload: { customerName: string; customerPhone: string; notes?: string }) => {
      const response = await fetchJson<{ order: Order }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          customerName: payload.customerName,
          customerPhone: payload.customerPhone,
          notes: payload.notes,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      await refreshStoreData();
      return response.order;
    },
    [cart, refreshStoreData]
  );

  const addProduct = useCallback(
    async (product: CreateProductInput) => {
      await fetchJson<{ product: Product }>("/api/products", {
        method: "POST",
        body: JSON.stringify(product)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const updateProduct = useCallback(
    async (product: Product) => {
      await fetchJson<{ product: Product }>(`/api/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify(product)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const removeProduct = useCallback(
    async (productId: string) => {
      await fetchJson(`/api/products/${productId}`, { method: "DELETE" });
      setCart((current) => current.filter((item) => item.productId !== productId));
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const addBrand = useCallback(
    async (brand: Omit<Brand, "id">) => {
      await fetchJson<{ brand: Brand }>("/api/brands", {
        method: "POST",
        body: JSON.stringify(brand)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const updateBrand = useCallback(
    async (brand: Brand) => {
      await fetchJson<{ brand: Brand }>(`/api/brands/${brand.id}`, {
        method: "PATCH",
        body: JSON.stringify(brand)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const removeBrand = useCallback(
    async (brandId: string) => {
      await fetchJson(`/api/brands/${brandId}`, { method: "DELETE" });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const addCategory = useCallback(
    async (category: Omit<Category, "id" | "slug"> & { slug?: string }) => {
      await fetchJson<{ category: Category }>("/api/categories", {
        method: "POST",
        body: JSON.stringify(category)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const updateCategory = useCallback(
    async (category: Category) => {
      await fetchJson<{ category: Category }>(`/api/categories/${category.id}`, {
        method: "PATCH",
        body: JSON.stringify(category)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const removeCategory = useCallback(
    async (categoryId: string) => {
      await fetchJson(`/api/categories/${categoryId}`, { method: "DELETE" });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const addPromotion = useCallback(
    async (promotion: Omit<Promotion, "id">) => {
      await fetchJson<{ promotion: Promotion }>("/api/promotions", {
        method: "POST",
        body: JSON.stringify(promotion)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const updatePromotion = useCallback(
    async (promotion: Promotion) => {
      await fetchJson<{ promotion: Promotion }>(`/api/promotions/${promotion.id}`, {
        method: "PATCH",
        body: JSON.stringify(promotion)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const removePromotion = useCallback(
    async (promotionId: string) => {
      await fetchJson(`/api/promotions/${promotionId}`, { method: "DELETE" });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const addTestimonial = useCallback(
    async (testimonial: Omit<Testimonial, "id" | "createdAt">) => {
      await fetchJson<{ testimonial: Testimonial }>("/api/testimonials", {
        method: "POST",
        body: JSON.stringify(testimonial)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const updateTestimonial = useCallback(
    async (testimonial: Testimonial) => {
      await fetchJson<{ testimonial: Testimonial }>(`/api/testimonials/${testimonial.id}`, {
        method: "PATCH",
        body: JSON.stringify(testimonial)
      });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const removeTestimonial = useCallback(
    async (testimonialId: string) => {
      await fetchJson(`/api/testimonials/${testimonialId}`, { method: "DELETE" });
      await refreshStoreData();
    },
    [refreshStoreData]
  );

  const updateHomeContent = useCallback(
    async (content: HomeContent) => {
      const response = await fetchJson<{ homeContent: HomeContent }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({ homeContent: content })
      });
      setStoreData((current) => ({ ...current, homeContent: response.homeContent }));
    },
    []
  );

  const updateSettings = useCallback(
    async (settings: StoreSettings) => {
      const response = await fetchJson<{ settings: StoreSettings }>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({ settings })
      });
      setStoreData((current) => ({ ...current, settings: response.settings }));
    },
    []
  );

  const addNewsletterLead = useCallback(
    async (lead: Omit<NewsletterLead, "id" | "createdAt">) => {
      const response = await fetchJson<{ lead: NewsletterLead }>("/api/newsletter", {
        method: "POST",
        body: JSON.stringify(lead)
      });
      setStoreData((current) => ({
        ...current,
        newsletterLeads: [response.lead, ...current.newsletterLeads]
      }));
    },
    []
  );

  const addContactMessage = useCallback(
    async (message: Omit<ContactMessage, "id" | "createdAt">) => {
      const response = await fetchJson<{ message: ContactMessage }>("/api/contact-messages", {
        method: "POST",
        body: JSON.stringify(message)
      });
      setStoreData((current) => ({
        ...current,
        contactMessages: [response.message, ...current.contactMessages]
      }));
    },
    []
  );

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => resolveCartTotal(cart, storeData.products),
    [cart, storeData.products]
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      storeData,
      cart,
      isHydrated,
      cartCount,
      cartTotal,
      refreshStoreData,
      getProductById,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      createOrder,
      addProduct,
      updateProduct,
      removeProduct,
      addBrand,
      updateBrand,
      removeBrand,
      addCategory,
      updateCategory,
      removeCategory,
      addPromotion,
      updatePromotion,
      removePromotion,
      addTestimonial,
      updateTestimonial,
      removeTestimonial,
      updateHomeContent,
      updateSettings,
      addNewsletterLead,
      addContactMessage
    }),
    [
      storeData,
      cart,
      isHydrated,
      cartCount,
      cartTotal,
      refreshStoreData,
      getProductById,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      createOrder,
      addProduct,
      updateProduct,
      removeProduct,
      addBrand,
      updateBrand,
      removeBrand,
      addCategory,
      updateCategory,
      removeCategory,
      addPromotion,
      updatePromotion,
      removePromotion,
      addTestimonial,
      updateTestimonial,
      removeTestimonial,
      updateHomeContent,
      updateSettings,
      addNewsletterLead,
      addContactMessage
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
