"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { Product } from "@/types/store";
import { Button } from "@/components/ui/button";
import { ProductBadge } from "@/components/common/product-badge";
import { formatCurrency } from "@/lib/utils/format";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";
import { buildProductMessage, generateWhatsAppLink } from "@/lib/utils/whatsapp";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, storeData } = useStore();
  const { showToast } = useToast();

  const finalPrice = product.promoPrice ?? product.price;

  const onAddToCart = () => {
    addToCart(product.id, 1);
    showToast({
      title: "Produto adicionado",
      description: `${product.name} foi para sua sacola.`,
      variant: "success"
    });
  };

  const whatsappUrl = generateWhatsAppLink(
    storeData.settings.whatsappNumber,
    buildProductMessage(product)
  );

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-blush-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative h-44 overflow-hidden rounded-xl bg-gradient-to-b from-nude-100 to-blush-100">
        <Image
          src={product.images[0] || "/placeholders/product.svg"}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 25vw"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-2">
        <ProductBadge seal={product.seal} />
        <span className="text-[11px] font-medium text-muted">{product.subcategory}</span>
      </div>

      <Link href={`/produtos/${product.slug}`} className="mt-3">
        <h3 className="line-clamp-2 text-base font-semibold text-ink transition group-hover:text-[#5f4f67]">
          {product.name}
        </h3>
      </Link>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{product.shortDescription}</p>

      <div className="mt-4">
        {product.promoPrice ? (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink">{formatCurrency(product.promoPrice)}</span>
            <span className="text-sm text-muted line-through">{formatCurrency(product.price)}</span>
          </div>
        ) : (
          <span className="text-lg font-bold text-ink">{formatCurrency(finalPrice)}</span>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button onClick={onAddToCart} className="gap-1.5">
          <ShoppingBag className="h-4 w-4" />
          Sacola
        </Button>
        <a href={whatsappUrl} target="_blank" rel="noreferrer">
          <Button variant="whatsapp" fullWidth className="gap-1.5">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </a>
      </div>
    </article>
  );
}
