"use client";

import { useSession } from "next-auth/react";
import { SectionHeading } from "@/components/common/section-heading";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLogin } from "@/components/admin/admin-login";

export function AdminPage() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Painel administrativo"
        title="Gestao local da revendedora"
        description="Acesso restrito para editar produtos, textos, promocoes e configuracoes do WhatsApp."
      />

      {status === "loading" ? (
        <div className="rounded-2xl border border-blush-100 bg-white p-6 text-sm text-muted shadow-card">
          Carregando sessao...
        </div>
      ) : isAdmin ? (
        <AdminDashboard />
      ) : (
        <AdminLogin />
      )}
    </div>
  );
}
