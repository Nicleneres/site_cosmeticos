"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/produto/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/common/star-rating";
import { ROUTES } from "@/lib/constants";
import { formatCurrency, phoneMaskBR } from "@/lib/utils/format";
import { isRequiredFilled, isValidEmail, isValidPhone } from "@/lib/utils/validation";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";

const iconByBenefit = [HeartHandshake, MessageCircle, ShieldCheck, Sparkles];

export function HomePage() {
  const { storeData, addNewsletterLead, isHydrated } = useStore();
  const { showToast } = useToast();

  const [newsletter, setNewsletter] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  const featuredProducts = useMemo(
    () => storeData.products.filter((product) => product.isActive && product.featured).slice(0, 8),
    [storeData.products]
  );

  const bestSellers = useMemo(
    () => storeData.products.filter((product) => product.isActive && product.bestSeller).slice(0, 4),
    [storeData.products]
  );

  const kits = useMemo(
    () =>
      storeData.products
        .filter((product) => product.isActive && product.categoryId === "kits-presenteaveis")
        .slice(0, 4),
    [storeData.products]
  );

  const whatsappHomeLink = generateWhatsAppLink(
    storeData.settings.whatsappNumber,
    "Ola, vim pela home e gostaria de ajuda para montar meu pedido."
  );

  const onNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!isRequiredFilled(newsletter.name)) nextErrors.name = "Informe seu nome.";
    if (!isValidPhone(newsletter.phone)) nextErrors.phone = "Telefone invalido.";
    if (newsletter.email && !isValidEmail(newsletter.email)) nextErrors.email = "E-mail invalido.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await addNewsletterLead({
        name: newsletter.name,
        phone: newsletter.phone,
        email: newsletter.email || undefined
      });
      setNewsletter({ name: "", phone: "", email: "" });
      showToast({
        title: "Cadastro confirmado",
        description: "Voce entrou na lista VIP com sucesso.",
        variant: "success"
      });
    } catch (error) {
      showToast({
        title: "Falha no cadastro",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-3xl bg-blush-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-blush-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-8">
      <section className="overflow-hidden rounded-[2rem] bg-hero-glow px-6 py-12 shadow-soft sm:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
              {storeData.homeContent.heroBadge}
            </span>
            <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              {storeData.homeContent.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {storeData.homeContent.heroSubtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={ROUTES.catalog}>
                <Button className="gap-2">
                  {storeData.homeContent.heroCtaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href={whatsappHomeLink} target="_blank" rel="noreferrer">
                <Button variant="whatsapp" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {storeData.homeContent.heroCtaSecondary}
                </Button>
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-card">
            <p className="text-sm font-semibold text-ink">Destaques da semana</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <p className="rounded-xl bg-white px-4 py-3">{storeData.homeContent.bannerText}</p>
              <p className="rounded-xl bg-white px-4 py-3">
                Perfumes, maquiagem, skincare e kits presenteaveis com curadoria especial.
              </p>
              <p className="rounded-xl bg-white px-4 py-3">
                Entrega na regiao de {storeData.settings.cityRegion}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {storeData.homeContent.benefits.map((benefit, index) => {
          const Icon = iconByBenefit[index] ?? Sparkles;
          return (
            <article
              key={benefit.id}
              className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card transition hover:shadow-soft"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-ink">{benefit.title}</h3>
              <p className="mt-2 text-sm text-muted">{benefit.description}</p>
            </article>
          );
        })}
      </section>

      <section>
        <SectionHeading
          eyebrow="Marcas atendidas"
          title="Curadoria multimarcas para diferentes estilos"
          description="Trabalhamos com marcas reconhecidas no Brasil, sempre com atendimento humano para voce comprar com seguranca."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {storeData.brands
            .filter((brand) => brand.isActive)
            .map((brand) => (
              <article key={brand.id} className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
                <p className="text-base font-semibold text-ink">{brand.name}</p>
                <p className="mt-2 text-sm text-muted">{brand.description}</p>
              </article>
            ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Categorias"
          title="Tudo para sua rotina de beleza em um so lugar"
          description="Perfumes, maquiagem, skincare, corpo, cabelos e opcoes especiais para presentear."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {storeData.categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`${ROUTES.catalog}?categoria=${category.id}`}
              className="group rounded-2xl border border-blush-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <p className="text-sm font-semibold text-ink group-hover:text-[#5f4f67]">{category.name}</p>
              <p className="mt-2 text-sm text-muted">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Produtos em destaque"
          title="Selecao especial para vender mais e encantar clientes"
        />
        <div className="mt-6">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <SectionHeading eyebrow="Promocoes" title="Ofertas ativas" description="Aproveite os melhores precos da semana." />
          <div className="mt-5 space-y-3">
            {storeData.promotions.filter((promotion) => promotion.isActive).map((promotion) => (
              <article key={promotion.id} className="rounded-xl bg-blush-50 p-4">
                <p className="text-sm font-semibold text-ink">{promotion.title}</p>
                <p className="mt-1 text-sm text-muted">{promotion.description}</p>
                <span className="mt-2 inline-block rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink">
                  {promotion.discountLabel}
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <SectionHeading eyebrow="Mais vendidos" title="Favoritos das clientes" />
          <div className="mt-5 grid gap-3">
            {bestSellers.map((product) => (
              <Link
                key={product.id}
                href={`/produtos/${product.slug}`}
                className="flex items-center justify-between rounded-xl bg-blush-50 px-4 py-3 text-sm transition hover:bg-blush-100"
              >
                <span className="font-medium text-ink">{product.name}</span>
                <span className="text-ink">{formatCurrency(product.promoPrice ?? product.price)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Kits para presente"
          title="Presentes prontos para surpreender em qualquer data especial"
        />
        <div className="mt-6">
          <ProductGrid products={kits} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <SectionHeading
            eyebrow="Depoimentos"
            title="Clientes que compram e recomendam"
            description="Experiencia real de quem confia no atendimento da consultora."
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {storeData.testimonials.slice(0, 4).map((testimonial) => (
              <article key={testimonial.id} className="rounded-xl bg-blush-50 p-4">
                <StarRating value={testimonial.rating} />
                <p className="mt-3 text-sm text-muted">{testimonial.message}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink">
                  {testimonial.name} - {testimonial.city}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <SectionHeading
            eyebrow="Lista VIP"
            title="Receba novidades e promocoes"
            description="Entre na lista e seja avisada sobre lancamentos e kits especiais."
          />
          <form className="mt-5 space-y-3" onSubmit={onNewsletterSubmit}>
            <Input
              label="Nome"
              value={newsletter.name}
              error={errors.name}
              onChange={(event) => setNewsletter((current) => ({ ...current, name: event.target.value }))}
              placeholder="Seu nome"
            />
            <Input
              label="Telefone"
              value={newsletter.phone}
              error={errors.phone}
              onChange={(event) =>
                setNewsletter((current) => ({
                  ...current,
                  phone: phoneMaskBR(event.target.value)
                }))
              }
              placeholder="(11) 99999-9999"
            />
            <Input
              label="E-mail (opcional)"
              type="email"
              value={newsletter.email}
              error={errors.email}
              onChange={(event) => setNewsletter((current) => ({ ...current, email: event.target.value }))}
              placeholder="voce@email.com"
            />
            <Button type="submit" fullWidth>
              Quero entrar na lista VIP
            </Button>
          </form>
        </aside>
      </section>

      <section className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-ink">
              Produtos selecionados para perfumes, cuidados e maquiagem
            </p>
            <p className="mt-1 text-sm text-muted">
              Fale direto com a consultora e finalize seu pedido em poucos minutos.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={ROUTES.catalog}>
              <Button variant="secondary">Ver catalogo completo</Button>
            </Link>
            <a href={whatsappHomeLink} target="_blank" rel="noreferrer">
              <Button variant="whatsapp" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Chamar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
