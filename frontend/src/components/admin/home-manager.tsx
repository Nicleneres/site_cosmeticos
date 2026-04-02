"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";

export function HomeManager() {
  const { storeData, updateHomeContent } = useStore();
  const { showToast } = useToast();
  const [form, setForm] = useState(storeData.homeContent);

  useEffect(() => {
    setForm(storeData.homeContent);
  }, [storeData.homeContent]);

  const onSave = async () => {
    try {
      await updateHomeContent(form);
      showToast({
        title: "Textos da home atualizados",
        variant: "success"
      });
    } catch (error) {
      showToast({
        title: "Falha ao salvar textos da home",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  return (
    <section className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
      <h2 className="text-lg font-semibold text-ink">Editar textos da home</h2>
      <div className="mt-4 grid gap-3">
        <Input
          label="Badge do hero"
          value={form.heroBadge}
          onChange={(event) => setForm((current) => ({ ...current, heroBadge: event.target.value }))}
        />
        <Input
          label="Titulo principal"
          value={form.heroTitle}
          onChange={(event) => setForm((current) => ({ ...current, heroTitle: event.target.value }))}
        />
        <Textarea
          label="Subtitulo principal"
          value={form.heroSubtitle}
          onChange={(event) =>
            setForm((current) => ({ ...current, heroSubtitle: event.target.value }))
          }
        />
        <Input
          label="CTA principal"
          value={form.heroCtaPrimary}
          onChange={(event) =>
            setForm((current) => ({ ...current, heroCtaPrimary: event.target.value }))
          }
        />
        <Input
          label="CTA secundario"
          value={form.heroCtaSecondary}
          onChange={(event) =>
            setForm((current) => ({ ...current, heroCtaSecondary: event.target.value }))
          }
        />
        <Textarea
          label="Banner principal"
          value={form.bannerText}
          onChange={(event) => setForm((current) => ({ ...current, bannerText: event.target.value }))}
        />
        <Textarea
          label="Resumo sobre a consultora"
          value={form.aboutShort}
          onChange={(event) => setForm((current) => ({ ...current, aboutShort: event.target.value }))}
        />
      </div>

      <h3 className="mt-6 text-base font-semibold text-ink">Beneficios da home</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {form.benefits.map((benefit, index) => (
          <article key={benefit.id} className="rounded-xl border border-blush-100 bg-blush-50 p-3">
            <Input
              label={`Titulo beneficio ${index + 1}`}
              value={benefit.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  benefits: current.benefits.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, title: event.target.value } : item
                  )
                }))
              }
            />
            <Textarea
              label="Descricao"
              value={benefit.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  benefits: current.benefits.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, description: event.target.value } : item
                  )
                }))
              }
            />
          </article>
        ))}
      </div>
      <Button className="mt-4" onClick={onSave}>
        Salvar textos da home
      </Button>
    </section>
  );
}
