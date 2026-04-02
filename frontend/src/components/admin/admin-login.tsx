"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/contexts/toast-context";
import { defaultStoreSettings } from "@/lib/data/default-store";

export function AdminLogin() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const response = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false
    });
    if (!response?.ok) {
      setError("Credenciais invalidas.");
      showToast({
        title: "Falha no login",
        description: "Verifique usuario e senha do painel.",
        variant: "error"
      });
      setIsSubmitting(false);
      return;
    }

    setError("");
    showToast({
      title: "Acesso liberado",
      description: "Bem-vinda ao painel administrativo.",
      variant: "success"
    });
    setIsSubmitting(false);
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-blush-100 bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blush-100 text-ink">
          <LockKeyhole className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-ink">Acesso ao painel</h2>
          <p className="text-sm text-muted">{defaultStoreSettings.storeName}</p>
        </div>
      </div>

      <form className="space-y-3" onSubmit={onSubmit}>
        <Input
          label="E-mail"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="admin@bellaaura.com"
        />
        <Input
          label="Senha"
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Digite sua senha"
          error={error || undefined}
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar no painel"}
        </Button>
        <p className="text-xs text-muted">
          Seed inicial: admin@bellaaura.com / 123456
        </p>
      </form>
    </section>
  );
}
