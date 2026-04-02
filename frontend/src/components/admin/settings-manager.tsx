"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";

export function SettingsManager() {
  const { storeData, updateSettings } = useStore();
  const { showToast } = useToast();
  const [form, setForm] = useState(storeData.settings);

  useEffect(() => {
    setForm(storeData.settings);
  }, [storeData.settings]);

  const onSave = async () => {
    try {
      await updateSettings(form);
      showToast({
        title: "Configuracoes salvas",
        description: "Dados de contato e WhatsApp atualizados.",
        variant: "success"
      });
    } catch (error) {
      showToast({
        title: "Falha ao salvar configuracoes",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  return (
    <section className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
      <h2 className="text-lg font-semibold text-ink">Configuracoes gerais</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input
          label="Nome da loja"
          value={form.storeName}
          onChange={(event) => setForm((current) => ({ ...current, storeName: event.target.value }))}
        />
        <Input
          label="Nome da consultora"
          value={form.consultantName}
          onChange={(event) =>
            setForm((current) => ({ ...current, consultantName: event.target.value }))
          }
        />
        <Input
          label="WhatsApp (com DDI)"
          value={form.whatsappNumber}
          onChange={(event) =>
            setForm((current) => ({ ...current, whatsappNumber: event.target.value }))
          }
        />
        <Input
          label="Instagram (@)"
          value={form.instagramHandle}
          onChange={(event) =>
            setForm((current) => ({ ...current, instagramHandle: event.target.value }))
          }
        />
        <Input
          label="URL do Instagram"
          value={form.instagramUrl}
          onChange={(event) => setForm((current) => ({ ...current, instagramUrl: event.target.value }))}
        />
        <Input
          label="Cidade / regiao"
          value={form.cityRegion}
          onChange={(event) => setForm((current) => ({ ...current, cityRegion: event.target.value }))}
        />
        <Input
          label="Horario de atendimento"
          value={form.serviceHours}
          onChange={(event) =>
            setForm((current) => ({ ...current, serviceHours: event.target.value }))
          }
        />
        <Input
          label="E-mail de suporte"
          value={form.supportEmail}
          onChange={(event) =>
            setForm((current) => ({ ...current, supportEmail: event.target.value }))
          }
        />
      </div>

      <div className="mt-3 space-y-3">
        <Textarea
          label="Mensagem padrao do pedido"
          value={form.orderMessageTemplate}
          onChange={(event) =>
            setForm((current) => ({ ...current, orderMessageTemplate: event.target.value }))
          }
        />
        <Textarea
          label="Texto de privacidade"
          value={form.privacyText}
          onChange={(event) => setForm((current) => ({ ...current, privacyText: event.target.value }))}
        />
        <Textarea
          label="Texto de trocas"
          value={form.exchangePolicyText}
          onChange={(event) =>
            setForm((current) => ({ ...current, exchangePolicyText: event.target.value }))
          }
        />
        <Textarea
          label="Texto de atendimento"
          value={form.attendancePolicyText}
          onChange={(event) =>
            setForm((current) => ({ ...current, attendancePolicyText: event.target.value }))
          }
        />
        <Textarea
          label="Aviso legal de revenda independente"
          value={form.independentNotice}
          onChange={(event) =>
            setForm((current) => ({ ...current, independentNotice: event.target.value }))
          }
        />
      </div>

      <p className="mt-3 text-xs text-muted">
        Credenciais administrativas sao gerenciadas na tabela de usuarios do banco.
      </p>

      <Button className="mt-4" onClick={onSave}>
        Salvar configuracoes
      </Button>
    </section>
  );
}
