"use client";

import { useMemo } from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { StarRating } from "@/components/common/star-rating";
import { useStore } from "@/contexts/store-context";
import { formatDate } from "@/lib/utils/format";

export function TestimonialsPage() {
  const { storeData } = useStore();

  const orderedTestimonials = useMemo(
    () =>
      [...storeData.testimonials].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [storeData.testimonials]
  );

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Depoimentos"
        title="Clientes satisfeitas que compram com recorrencia"
        description="Estrutura pronta para receber novas avaliacoes e fortalecer a prova social da loja."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orderedTestimonials.map((testimonial) => (
          <article key={testimonial.id} className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
            <StarRating value={testimonial.rating} />
            <p className="mt-3 text-sm leading-relaxed text-muted">{testimonial.message}</p>
            <div className="mt-4 border-t border-blush-100 pt-4 text-xs text-muted">
              <p className="font-semibold uppercase tracking-wide text-ink">{testimonial.name}</p>
              <p>{testimonial.city}</p>
              <p className="mt-1">{formatDate(testimonial.createdAt)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
