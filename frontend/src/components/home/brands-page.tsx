"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { useStore } from "@/contexts/store-context";

export function BrandsPage() {
  const { storeData } = useStore();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Marcas"
        title="Marcas trabalhadas com curadoria independente"
        description="Selecionamos produtos de diferentes marcas para atender voce com mais liberdade de escolha."
      />

      <article className="rounded-2xl border border-blush-200 bg-blush-50 p-4 text-sm text-muted">
        Loja de revenda independente. As marcas citadas pertencem a seus respectivos proprietarios.
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        {storeData.brands
          .filter((brand) => brand.isActive)
          .map((brand) => {
            const relatedCategories = brand.relatedCategories
              .map((categoryId) => storeData.categories.find((category) => category.id === categoryId))
              .filter(Boolean);

            const sampleProducts = storeData.products
              .filter((product) => product.isActive && product.brandId === brand.id)
              .slice(0, 3);

            return (
              <article key={brand.id} className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
                <h3 className="text-xl font-semibold text-ink">{brand.name}</h3>
                <p className="mt-2 text-sm text-muted">{brand.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedCategories.map((category) => (
                    <span
                      key={category?.id}
                      className="rounded-full bg-blush-100 px-2.5 py-1 text-xs font-semibold text-ink"
                    >
                      {category?.name}
                    </span>
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  {sampleProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/produtos/${product.slug}`}
                      className="flex items-center justify-between rounded-xl bg-blush-50 px-3 py-2 text-sm text-muted transition hover:bg-blush-100 hover:text-ink"
                    >
                      <span>{product.name}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
      </div>
    </div>
  );
}
