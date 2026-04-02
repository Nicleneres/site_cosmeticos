import { Metadata } from "next";
import { FaqPage } from "@/components/home/faq-page";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Perguntas frequentes sobre pedidos, entregas, kits e atendimento."
};

export default function Page() {
  return <FaqPage />;
}
