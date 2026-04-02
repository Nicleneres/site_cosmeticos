"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";

const faqItems = [
  {
    question: "Os produtos sao originais?",
    answer:
      "Sim. A revendedora trabalha com curadoria de fornecedores e marcas reconhecidas, com atendimento transparente."
  },
  {
    question: "Como faco meu pedido?",
    answer:
      "Voce pode adicionar itens na sacola e finalizar no WhatsApp com mensagem automatica contendo produtos e valores."
  },
  {
    question: "Vocês entregam em outras cidades?",
    answer:
      "O atendimento principal e local, mas encomendas para outras regioes podem ser avaliadas conforme disponibilidade."
  },
  {
    question: "Posso montar kit personalizado?",
    answer:
      "Sim. Pelo WhatsApp voce informa faixa de preco, preferencia de fragrancia e ocasiao para montarmos o kit."
  },
  {
    question: "Tem reposicao de produtos com frequencia?",
    answer:
      "Sim. Novidades e reposicoes sao comunicadas na lista VIP e nas redes sociais da loja."
  }
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="FAQ"
        title="Perguntas frequentes"
        description="Respostas rapidas para facilitar sua decisao de compra."
      />

      <section className="space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article key={item.question} className="rounded-2xl border border-blush-100 bg-white shadow-card">
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenIndex((current) => (current === index ? null : index))}
              >
                <span className="text-sm font-semibold text-ink">{item.question}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.answer}</p>}
            </article>
          );
        })}
      </section>
    </div>
  );
}
