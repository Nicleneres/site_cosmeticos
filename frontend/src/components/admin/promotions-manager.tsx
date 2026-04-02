"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";

export function PromotionsManager() {
  const { storeData, addPromotion, updatePromotion, removePromotion } = useStore();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountLabel: "",
    productIds: "",
    expiresAt: "",
    isActive: true
  });

  const onCreatePromotion = async () => {
    if (!form.title.trim()) {
      showToast({ title: "Titulo da promocao obrigatorio", variant: "error" });
      return;
    }
    try {
      await addPromotion({
        title: form.title.trim(),
        description: form.description.trim(),
        discountLabel: form.discountLabel.trim() || "Oferta especial",
        productIds: form.productIds
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        expiresAt: form.expiresAt || undefined,
        isActive: form.isActive
      });
      setForm({
        title: "",
        description: "",
        discountLabel: "",
        productIds: "",
        expiresAt: "",
        isActive: true
      });
      showToast({ title: "Promocao cadastrada", variant: "success" });
    } catch (error) {
      showToast({
        title: "Falha ao cadastrar promocao",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Cadastrar promocao</h2>
        <div className="mt-4 space-y-3">
          <Input
            label="Titulo"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          />
          <Textarea
            label="Descricao"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
          />
          <Input
            label="Etiqueta de desconto"
            value={form.discountLabel}
            onChange={(event) =>
              setForm((current) => ({ ...current, discountLabel: event.target.value }))
            }
          />
          <Input
            label="IDs de produtos (separados por virgula)"
            value={form.productIds}
            onChange={(event) =>
              setForm((current) => ({ ...current, productIds: event.target.value }))
            }
          />
          <Input
            label="Data limite (opcional)"
            type="date"
            value={form.expiresAt}
            onChange={(event) =>
              setForm((current) => ({ ...current, expiresAt: event.target.value }))
            }
          />
          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            />
            Promocao ativa
          </label>
          <Button onClick={onCreatePromotion}>Cadastrar promocao</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h3 className="text-lg font-semibold text-ink">Promocoes cadastradas</h3>
        <div className="mt-4 space-y-2">
          {storeData.promotions.map((promotion) => (
            <article key={promotion.id} className="rounded-xl border border-blush-100 bg-blush-50 p-3">
              <p className="font-semibold text-ink">{promotion.title}</p>
              <p className="text-xs text-muted">{promotion.discountLabel}</p>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await updatePromotion({ ...promotion, isActive: !promotion.isActive });
                      showToast({ title: "Promocao atualizada", variant: "success" });
                    } catch (error) {
                      showToast({
                        title: "Falha ao atualizar promocao",
                        description: error instanceof Error ? error.message : "Tente novamente.",
                        variant: "error"
                      });
                    }
                  }}
                >
                  {promotion.isActive ? "Desativar" : "Ativar"}
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await removePromotion(promotion.id);
                      showToast({ title: "Promocao removida", variant: "success" });
                    } catch (error) {
                      showToast({
                        title: "Falha ao remover promocao",
                        description: error instanceof Error ? error.message : "Tente novamente.",
                        variant: "error"
                      });
                    }
                  }}
                >
                  Remover
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
