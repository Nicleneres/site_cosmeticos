"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { useStore } from "@/contexts/store-context";

export function PoliciesPage() {
  const { storeData } = useStore();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Politicas"
        title="Privacidade, trocas e atendimento"
        description="Informacoes transparentes para fortalecer a confianca de quem compra."
      />

      <section className="grid gap-4">
        <article className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink">Privacidade</h2>
          <p className="mt-2 text-sm text-muted">{storeData.settings.privacyText}</p>
        </article>

        <article className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink">Trocas e devolucoes</h2>
          <p className="mt-2 text-sm text-muted">{storeData.settings.exchangePolicyText}</p>
        </article>

        <article className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink">Atendimento e pedidos</h2>
          <p className="mt-2 text-sm text-muted">{storeData.settings.attendancePolicyText}</p>
          <p className="mt-2 text-sm text-muted">
            Horario: <span className="font-semibold text-ink">{storeData.settings.serviceHours}</span>
          </p>
        </article>
      </section>
    </div>
  );
}
