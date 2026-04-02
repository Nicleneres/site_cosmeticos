"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  ClipboardList,
  LayoutTemplate,
  LogOut,
  Megaphone,
  MessageSquareQuote,
  Package,
  Settings2,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsManager } from "@/components/admin/products-manager";
import { CatalogManager } from "@/components/admin/catalog-manager";
import { PromotionsManager } from "@/components/admin/promotions-manager";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { HomeManager } from "@/components/admin/home-manager";
import { SettingsManager } from "@/components/admin/settings-manager";
import { OrdersManager } from "@/components/admin/orders-manager";

type AdminTab =
  | "produtos"
  | "catalogo"
  | "promocoes"
  | "depoimentos"
  | "home"
  | "configuracoes"
  | "pedidos";

const tabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "catalogo", label: "Marcas e categorias", icon: Store },
  { id: "promocoes", label: "Promocoes", icon: Megaphone },
  { id: "depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { id: "home", label: "Textos da home", icon: LayoutTemplate },
  { id: "configuracoes", label: "Configuracoes", icon: Settings2 },
  { id: "pedidos", label: "Pedidos", icon: ClipboardList }
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("produtos");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Painel administrativo</h1>
            <p className="text-sm text-muted">Gestao local de produtos, conteudos e pedidos.</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => signOut({ callbackUrl: "/admin" })}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-2xl border border-blush-100 bg-white p-3 shadow-card">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active ? "bg-blush-100 text-ink" : "text-muted hover:bg-blush-50"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div>
          {activeTab === "produtos" && <ProductsManager />}
          {activeTab === "catalogo" && <CatalogManager />}
          {activeTab === "promocoes" && <PromotionsManager />}
          {activeTab === "depoimentos" && <TestimonialsManager />}
          {activeTab === "home" && <HomeManager />}
          {activeTab === "configuracoes" && <SettingsManager />}
          {activeTab === "pedidos" && <OrdersManager />}
        </div>
      </section>
    </div>
  );
}
