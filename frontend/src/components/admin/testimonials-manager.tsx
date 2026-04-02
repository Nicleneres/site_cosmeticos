"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";

export function TestimonialsManager() {
  const { storeData, addTestimonial, removeTestimonial } = useStore();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    city: "",
    rating: "5",
    message: ""
  });

  const onCreateTestimonial = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      showToast({
        title: "Nome e mensagem sao obrigatorios",
        variant: "error"
      });
      return;
    }
    try {
      await addTestimonial({
        name: form.name.trim(),
        city: form.city.trim() || "Brasil",
        rating: Number(form.rating) || 5,
        message: form.message.trim()
      });
      setForm({ name: "", city: "", rating: "5", message: "" });
      showToast({ title: "Depoimento adicionado", variant: "success" });
    } catch (error) {
      showToast({
        title: "Falha ao salvar depoimento",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Adicionar depoimento</h2>
        <div className="mt-4 space-y-3">
          <Input
            label="Nome"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Input
            label="Cidade"
            value={form.city}
            onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
          />
          <Select
            label="Nota"
            value={form.rating}
            onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
          </Select>
          <Textarea
            label="Mensagem"
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          />
          <Button onClick={onCreateTestimonial}>Cadastrar depoimento</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h3 className="text-lg font-semibold text-ink">Depoimentos cadastrados</h3>
        <div className="mt-4 space-y-2">
          {storeData.testimonials.map((testimonial) => (
            <article key={testimonial.id} className="rounded-xl border border-blush-100 bg-blush-50 p-3">
              <p className="font-semibold text-ink">{testimonial.name}</p>
              <p className="text-xs text-muted">
                {testimonial.city} - Nota {testimonial.rating}
              </p>
              <p className="mt-1 text-sm text-muted">{testimonial.message}</p>
              <Button
                variant="danger"
                className="mt-2"
                onClick={async () => {
                  try {
                    await removeTestimonial(testimonial.id);
                    showToast({ title: "Depoimento removido", variant: "success" });
                  } catch (error) {
                    showToast({
                      title: "Falha ao remover depoimento",
                      description: error instanceof Error ? error.message : "Tente novamente.",
                      variant: "error"
                    });
                  }
                }}
              >
                Remover
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
