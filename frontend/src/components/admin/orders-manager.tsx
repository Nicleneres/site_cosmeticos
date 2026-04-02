"use client";

import { EmptyState } from "@/components/common/empty-state";
import { useStore } from "@/contexts/store-context";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/toast-context";

export function OrdersManager() {
  const { storeData, refreshStoreData } = useStore();
  const { showToast } = useToast();

  const updateStatus = async (orderId: string, status: "novo" | "em-andamento" | "finalizado") => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) {
        throw new Error("Falha ao atualizar pedido.");
      }
      await refreshStoreData();
      showToast({
        title: "Status atualizado",
        variant: "success"
      });
    } catch {
      showToast({
        title: "Falha ao atualizar status",
        variant: "error"
      });
    }
  };

  return (
    <section className="space-y-6">
      <article className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Pedidos recebidos</h2>
        {storeData.orders.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Sem pedidos ainda"
              description="Quando os pedidos forem finalizados na sacola, eles aparecem aqui."
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {storeData.orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-blush-100 bg-blush-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">
                    {order.customerName} - {order.customerPhone}
                  </p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink">
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{formatDate(order.createdAt)}</p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.productId}`}>
                      {item.name} - {item.quantity}x ({formatCurrency(item.price)})
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm font-semibold text-ink">Total: {formatCurrency(order.total)}</p>
                {order.notes && <p className="mt-1 text-xs text-muted">Obs.: {order.notes}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => updateStatus(order.id, "novo")}>
                    Novo
                  </Button>
                  <Button variant="outline" onClick={() => updateStatus(order.id, "em-andamento")}>
                    Em andamento
                  </Button>
                  <Button variant="secondary" onClick={() => updateStatus(order.id, "finalizado")}>
                    Finalizado
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </article>

      <article className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Leads e contatos captados</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">Lista VIP</h3>
            <div className="mt-2 space-y-2">
              {storeData.newsletterLeads.length === 0 && (
                <p className="text-sm text-muted">Nenhum lead cadastrado ainda.</p>
              )}
              {storeData.newsletterLeads.map((lead) => (
                <article key={lead.id} className="rounded-xl border border-blush-100 bg-blush-50 px-3 py-2">
                  <p className="text-sm font-medium text-ink">{lead.name}</p>
                  <p className="text-xs text-muted">
                    {lead.phone} {lead.email ? `- ${lead.email}` : ""}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Mensagens de contato</h3>
            <div className="mt-2 space-y-2">
              {storeData.contactMessages.length === 0 && (
                <p className="text-sm text-muted">Nenhuma mensagem recebida ainda.</p>
              )}
              {storeData.contactMessages.map((message) => (
                <article key={message.id} className="rounded-xl border border-blush-100 bg-blush-50 px-3 py-2">
                  <p className="text-sm font-medium text-ink">
                    {message.name} - {message.phone}
                  </p>
                  <p className="text-xs text-muted">{message.message}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
