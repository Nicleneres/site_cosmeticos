import { Metadata } from "next";
import { AdminPage } from "@/components/admin/admin-page";

export const metadata: Metadata = {
  title: "Painel administrativo",
  description: "Gestao local de produtos, textos da home, promocoes e pedidos."
};

export default function Page() {
  return <AdminPage />;
}
