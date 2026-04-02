import { CartItem, Product, StoreSettings } from "@/types/store";
import { formatCurrency, stripPhone } from "@/lib/utils/format";

export function generateWhatsAppLink(phone: string, message: string): string {
  const normalizedPhone = stripPhone(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

export function buildProductMessage(product: Product): string {
  const value = product.promoPrice ?? product.price;
  return `Ola, vim pelo site e tenho interesse em:\n- ${product.name}\nValor: ${formatCurrency(value)}\nPode me ajudar com o pedido?`;
}

export function buildOrderMessage(params: {
  customerName: string;
  customerPhone: string;
  notes?: string;
  cart: CartItem[];
  products: Product[];
  settings: StoreSettings;
}): string {
  const { customerName, customerPhone, notes, cart, products, settings } = params;
  const items = cart
    .map((item) => {
      const product = products.find((productItem) => productItem.id === item.productId);
      if (!product) return "";
      const price = product.promoPrice ?? product.price;
      return `- ${product.name} - ${item.quantity} unidade(s) - ${formatCurrency(
        price * item.quantity
      )}`;
    })
    .filter(Boolean)
    .join("\n");

  const totalValue = cart.reduce((acc, item) => {
    const product = products.find((productItem) => productItem.id === item.productId);
    if (!product) return acc;
    const price = product.promoPrice ?? product.price;
    return acc + price * item.quantity;
  }, 0);

  return settings.orderMessageTemplate
    .replace("{{itens}}", items || "- Sem itens")
    .replace("{{total}}", formatCurrency(totalValue))
    .replace("{{nome}}", customerName)
    .replace("{{telefone}}", customerPhone)
    .replace("{{observacoes}}", notes?.trim() || "Sem observacoes");
}
