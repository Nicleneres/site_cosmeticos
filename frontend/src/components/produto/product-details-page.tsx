"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductBadge } from "@/components/common/product-badge";
import { ProductGrid } from "@/components/produto/product-grid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { formatCurrency } from "@/lib/utils/format";
import { getRelatedProducts } from "@/lib/utils/products";
import { buildProductMessage, generateWhatsAppLink } from "@/lib/utils/whatsapp";
import { ROUTES } from "@/lib/constants";

type ProductDetailsPageProps = {
  slug: string;
};

export function ProductDetailsPage({ slug }: ProductDetailsPageProps) {
  const { storeData, addToCart, isHydrated } = useStore();
  const { showToast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = useMemo(
    () => storeData.products.find((item) => item.slug === slug && item.isActive),
    [slug, storeData.products]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getRelatedProducts(storeData.products, product);
  }, [product, storeData.products]);

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-blush-100" />
        <div className="h-[460px] animate-pulse rounded-3xl bg-blush-100" />
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Produto nao encontrado"
        description="Esse item pode ter sido removido ou esta indisponivel no momento."
        action={
          <Link href={ROUTES.catalog}>
            <Button variant="outline">Voltar ao catalogo</Button>
          </Link>
        }
      />
    );
  }

  const brand = storeData.brands.find((item) => item.id === product.brandId);
  const category = storeData.categories.find((item) => item.id === product.categoryId);
  const price = product.promoPrice ?? product.price;

  const whatsappUrl = generateWhatsAppLink(
    storeData.settings.whatsappNumber,
    buildProductMessage(product)
  );

  const onAddToCart = () => {
    addToCart(product.id, 1);
    showToast({
      title: "Produto adicionado na sacola",
      description: "Voce pode continuar comprando ou finalizar no WhatsApp.",
      variant: "success"
    });
  };

  return (
    <div className="space-y-12">
      <Link href={ROUTES.catalog} className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catalogo
      </Link>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-blush-100 bg-white shadow-card">
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={`relative h-20 overflow-hidden rounded-xl border ${
                    activeImageIndex === index ? "border-ink" : "border-blush-100"
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-blush-100 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <ProductBadge seal={product.seal} />
            <span className="rounded-full bg-blush-100 px-2.5 py-1 text-xs font-semibold text-ink">
              {brand?.name}
            </span>
            <span className="rounded-full bg-nude-100 px-2.5 py-1 text-xs font-semibold text-ink">
              {category?.name}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink">{product.name}</h1>
          <p className="mt-3 text-sm text-muted">{product.shortDescription}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-ink">{formatCurrency(price)}</span>
            {product.promoPrice && (
              <span className="text-sm text-muted line-through">{formatCurrency(product.price)}</span>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button onClick={onAddToCart} className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Adicionar a sacola
            </Button>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <Button variant="whatsapp" fullWidth className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Pedir no WhatsApp
              </Button>
            </a>
          </div>

          <div className="mt-8 space-y-5">
            <article>
              <h2 className="text-base font-semibold text-ink">Descricao detalhada</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{product.fullDescription}</p>
            </article>

            <article>
              <h2 className="text-base font-semibold text-ink">Beneficios</h2>
              <ul className="mt-2 space-y-2">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </article>

            <article>
              <h2 className="text-base font-semibold text-ink">Modo de uso</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{product.usageMode}</p>
            </article>

            <article className="rounded-xl bg-blush-50 p-4 text-xs text-muted">
              Loja de revenda independente. As marcas citadas pertencem a seus respectivos proprietarios.
            </article>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Relacionados" title="Voce tambem pode gostar" />
        <div className="mt-6">
          <ProductGrid
            products={relatedProducts}
            emptyTitle="Sem relacionados por enquanto"
            emptyDescription="Em breve teremos mais opcoes dentro dessa categoria."
          />
        </div>
      </section>
    </div>
  );
}
