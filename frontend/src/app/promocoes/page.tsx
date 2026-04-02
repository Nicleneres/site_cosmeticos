import { Metadata } from "next";
import { PromotionsPage } from "@/components/home/promotions-page";

export const metadata: Metadata = {
  title: "Promocoes ativas",
  description:
    "Confira ofertas de perfumes, maquiagem, skincare e kits com precos especiais por tempo limitado."
};

export default function Page() {
  return <PromotionsPage />;
}
