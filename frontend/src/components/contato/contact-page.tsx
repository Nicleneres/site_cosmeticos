"use client";

import { FormEvent, useState } from "react";
import { Clock3, Instagram, MapPin, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";
import { phoneMaskBR } from "@/lib/utils/format";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";
import { isRequiredFilled, isValidPhone } from "@/lib/utils/validation";

export function ContactPage() {
  const { storeData, addContactMessage } = useStore();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; message?: string }>({});

  const whatsappUrl = generateWhatsAppLink(
    storeData.settings.whatsappNumber,
    "Ola, vim pelo site e gostaria de atendimento personalizado."
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!isRequiredFilled(form.name)) nextErrors.name = "Informe seu nome.";
    if (!isValidPhone(form.phone)) nextErrors.phone = "Telefone invalido.";
    if (!isRequiredFilled(form.message)) nextErrors.message = "Escreva sua mensagem.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await addContactMessage({
        name: form.name,
        phone: form.phone,
        message: form.message
      });
      setForm({ name: "", phone: "", message: "" });
      showToast({
        title: "Mensagem recebida",
        description: "Retornaremos seu contato no horario de atendimento.",
        variant: "success"
      });
    } catch (error) {
      showToast({
        title: "Falha ao enviar mensagem",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Contato"
        title="Atendimento direto com a consultora"
        description="Fale por WhatsApp, Instagram ou envie sua mensagem para receber indicacoes personalizadas."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="space-y-4 rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#1f8f4b] transition hover:bg-[#25D366]/15"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp: atendimento rapido
          </a>

          <a
            href={storeData.settings.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl bg-blush-50 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-blush-100"
          >
            <Instagram className="h-4 w-4" />
            Instagram: {storeData.settings.instagramHandle}
          </a>

          <div className="space-y-2 rounded-xl bg-blush-50 px-4 py-4 text-sm text-muted">
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {storeData.settings.serviceHours}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Atendimento em {storeData.settings.cityRegion}
            </p>
          </div>

          <div className="rounded-xl bg-blush-50 px-4 py-4 text-xs text-muted">
            Entregas, encomendas e retirada podem ser combinadas durante o atendimento.
          </div>
        </aside>

        <section className="rounded-2xl border border-blush-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink">Envie sua mensagem</h2>
          <p className="mt-2 text-sm text-muted">
            Preencha os dados para receber retorno com sugestoes e disponibilidade.
          </p>

          <form className="mt-5 space-y-3" onSubmit={onSubmit}>
            <Input
              label="Nome"
              value={form.name}
              error={errors.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Seu nome"
            />
            <Input
              label="Telefone"
              value={form.phone}
              error={errors.phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: phoneMaskBR(event.target.value)
                }))
              }
              placeholder="(11) 99999-9999"
            />
            <Textarea
              label="Mensagem"
              value={form.message}
              error={errors.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              placeholder="Ex.: quero sugestao de kit para presente ate R$ 150."
            />
            <Button type="submit">Enviar mensagem</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
