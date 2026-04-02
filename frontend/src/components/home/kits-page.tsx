"use client";

import { Gift, MessageCircle } from "lucide-react";
import { useMemo } from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/produto/product-grid";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/store-context";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";

export function KitsPage() {
  const { storeData } = useStore();

  const kits = useMemo(
    () =>
      storeData.products.filter(
        (product) => product.isActive && product.categoryId === "kits-presenteaveis"
      ),
    [storeData.products]
  );

  const customKitUrl = generateWhatsAppLink(
    storeData.settings.whatsappNumber,
    "Ola, gostaria de montar um kit personalizado para presente."
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Kits e presentes"
        title="Kits montados para encantar em datas especiais"
        description="Opcoes para aniversario, dia das maes, natal, datas romanticas e presente corporativo."
      />

      <section className="rounded-2xl border border-blush-100 bg-hero-glow p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold text-ink">
              <Gift className="h-5 w-5" />
              Kits personalizados sob consulta
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Escolha o valor aproximado, preferencia de fragrancia e estilo da pessoa presenteada.
            </p>
          </div>
          <a href={customKitUrl} target="_blank" rel="noreferrer">
            <Button variant="whatsapp" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Montar meu kit
            </Button>
          </a>
        </div>
      </section>

      <ProductGrid
        products={kits}
        emptyTitle="Sem kits disponiveis no momento"
        emptyDescription="Atualizaremos esta secao com novos kits em breve."
      />
    </div>
  );
}
