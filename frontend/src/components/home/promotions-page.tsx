"use client";

import { CalendarClock, Percent } from "lucide-react";
import { useMemo } from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/produto/product-grid";
import { formatDate } from "@/lib/utils/format";
import { useStore } from "@/contexts/store-context";

export function PromotionsPage() {
  const { storeData } = useStore();

  const promotionProducts = useMemo(
    () => storeData.products.filter((product) => product.isActive && Boolean(product.promoPrice)),
    [storeData.products]
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Promocoes"
        title="Ofertas selecionadas para economizar com elegancia"
        description="Aproveite precos especiais em produtos de beleza, cuidados e kits presenteaveis."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {storeData.promotions
          .filter((promotion) => promotion.isActive)
          .map((promotion) => (
            <article key={promotion.id} className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
              <p className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                <Percent className="h-3 w-3" />
                {promotion.discountLabel}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-ink">{promotion.title}</h3>
              <p className="mt-2 text-sm text-muted">{promotion.description}</p>
              {promotion.expiresAt && (
                <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-muted">
                  <CalendarClock className="h-4 w-4" />
                  Valida ate {formatDate(promotion.expiresAt)}
                </p>
              )}
            </article>
          ))}
      </div>

      <ProductGrid
        products={promotionProducts}
        emptyTitle="Sem promocoes ativas"
        emptyDescription="Em breve teremos novas campanhas e precos especiais."
      />
    </div>
  );
}
