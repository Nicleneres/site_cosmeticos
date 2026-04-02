"use client";

import Image from "next/image";
import { HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { useStore } from "@/contexts/store-context";

const reasons = [
  {
    title: "Atendimento com proximidade",
    description: "Escuta ativa para indicar produtos conforme sua rotina e preferencia."
  },
  {
    title: "Curadoria multimarcas",
    description: "Mais liberdade para montar pedidos de varias linhas em um unico atendimento."
  },
  {
    title: "Confianca e seguranca",
    description: "Compra com orientacao clara sobre uso, entrega e suporte pos-venda."
  },
  {
    title: "Acompanhamento real",
    description: "Voce recebe suporte para reposicao, presentes e novas necessidades."
  }
];

const icons = [HeartHandshake, Sparkles, ShieldCheck, Users];

export function AboutPage() {
  const { storeData } = useStore();

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Sobre a consultora"
        title={`Prazer, eu sou ${storeData.settings.consultantName}`}
        description="Consultora e revendedora independente de beleza, apaixonada por autoestima e atendimento humanizado."
      />

      <section className="grid gap-8 rounded-3xl border border-blush-100 bg-white p-6 shadow-card lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div className="relative mx-auto h-72 w-full max-w-sm overflow-hidden rounded-2xl bg-blush-100">
          <Image
            src="/placeholders/consultora.svg"
            alt={`Foto da consultora ${storeData.settings.consultantName}`}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm leading-relaxed text-muted">
            Comecei a {storeData.settings.storeName} para transformar a experiencia de compra em algo leve,
            elegante e sem pressa. Aqui voce encontra produtos de marcas diferentes, com recomendacoes
            personalizadas para seu perfil.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Meu foco e construir relacao de confianca: indicar com responsabilidade, acompanhar resultados e
            facilitar seu pedido com atendimento rapido pelo WhatsApp.
          </p>
          <article className="mt-5 rounded-xl bg-blush-50 p-4 text-xs text-muted">
            Loja de revenda independente. As marcas citadas pertencem a seus respectivos proprietarios.
          </article>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {reasons.map((reason, index) => {
          const Icon = icons[index];
          return (
            <article key={reason.title} className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink">{reason.title}</h3>
              <p className="mt-2 text-sm text-muted">{reason.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
