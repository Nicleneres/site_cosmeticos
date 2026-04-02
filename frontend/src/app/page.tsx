import { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "Cosmeticos, perfumes e kits com pedido por WhatsApp",
  description:
    "Vitrine multimarcas de revendedora independente com perfumes, maquiagem, skincare e kits presenteaveis."
};

export default function Home() {
  return <HomePage />;
}
