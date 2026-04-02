import { CartItem, Product, StoreData } from "@/types/store";

export function getProductBySlug(storeData: StoreData, slug: string): Product | undefined {
  return storeData.products.find((product) => product.slug === slug && product.isActive);
}

export function getCartTotal(cart: CartItem[], products: Product[]): number {
  return cart.reduce((total, item) => {
    const product = products.find((productItem) => productItem.id === item.productId);
    if (!product) return total;
    const unit = product.promoPrice ?? product.price;
    return total + unit * item.quantity;
  }, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
