"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";
import { ROUTES } from "@/lib/constants";
import { formatCurrency, phoneMaskBR } from "@/lib/utils/format";
import { isRequiredFilled, isValidPhone } from "@/lib/utils/validation";
import { buildOrderMessage, generateWhatsAppLink } from "@/lib/utils/whatsapp";

export function CartPage() {
  const {
    cart,
    storeData,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder
  } = useStore();
  const { showToast } = useToast();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    notes: ""
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = storeData.products.find((productItem) => productItem.id === item.productId);
          if (!product) return null;
          const unitPrice = product.promoPrice ?? product.price;
          return {
            ...item,
            product,
            unitPrice,
            subtotal: unitPrice * item.quantity
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [cart, storeData.products]
  );

  const onCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!isRequiredFilled(customer.name)) nextErrors.name = "Informe seu nome.";
    if (!isValidPhone(customer.phone)) nextErrors.phone = "Telefone invalido.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (cartItems.length === 0) {
      showToast({
        title: "Sacola vazia",
        description: "Adicione produtos antes de finalizar.",
        variant: "error"
      });
      return;
    }

    try {
      await createOrder({
        customerName: customer.name,
        customerPhone: customer.phone,
        notes: customer.notes
      });

      const orderMessage = buildOrderMessage({
        customerName: customer.name,
        customerPhone: customer.phone,
        notes: customer.notes,
        cart,
        products: storeData.products,
        settings: storeData.settings
      });
      const whatsappUrl = generateWhatsAppLink(storeData.settings.whatsappNumber, orderMessage);

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      clearCart();
      setCustomer({ name: "", phone: "", notes: "" });
      showToast({
        title: "Pedido preparado com sucesso",
        description: "Abrimos o WhatsApp com sua mensagem pronta.",
        variant: "success"
      });
    } catch (error) {
      showToast({
        title: "Falha ao finalizar pedido",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Sua sacola esta vazia"
        description="Escolha produtos no catalogo para montar seu pedido e finalizar no WhatsApp."
        action={
          <Link href={ROUTES.catalog}>
            <Button variant="secondary" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Ir para catalogo
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Minha sacola"
        title="Revise itens e finalize seu pedido pelo WhatsApp"
        description="A mensagem e montada automaticamente com itens, quantidades, valores e total."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink">Itens selecionados</h2>
          <div className="mt-5 space-y-3">
            {cartItems.map((item) => (
              <article
                key={item.productId}
                className="grid gap-3 rounded-xl border border-blush-100 bg-blush-50 p-4 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-semibold text-ink">{item.product.name}</p>
                  <p className="mt-1 text-sm text-muted">{item.product.shortDescription}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    Unitario: {formatCurrency(item.unitPrice)}
                  </p>
                  <p className="text-sm text-muted">Subtotal: {formatCurrency(item.subtotal)}</p>
                </div>

                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-full border border-blush-200 bg-white">
                    <button
                      className="p-2 text-muted hover:text-ink"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                    <button
                      className="p-2 text-muted hover:text-ink"
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink">Finalizar pedido</h2>
          <p className="mt-2 text-sm text-muted">Total parcial: {formatCurrency(cartTotal)}</p>

          <form className="mt-5 space-y-3" onSubmit={onCheckout}>
            <Input
              label="Seu nome"
              value={customer.name}
              error={errors.name}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Nome completo"
            />
            <Input
              label="Telefone"
              value={customer.phone}
              error={errors.phone}
              onChange={(event) =>
                setCustomer((current) => ({
                  ...current,
                  phone: phoneMaskBR(event.target.value)
                }))
              }
              placeholder="(11) 99999-9999"
            />
            <Textarea
              label="Observacoes (opcional)"
              value={customer.notes}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Ex.: entrega apos as 18h."
            />
            <Button type="submit" variant="whatsapp" fullWidth className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Finalizar pelo WhatsApp
            </Button>
          </form>
        </aside>
      </div>
    </div>
  );
}
