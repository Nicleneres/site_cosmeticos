import { Metadata } from "next";
import { PoliciesPage } from "@/components/home/policies-page";

export const metadata: Metadata = {
  title: "Politicas",
  description: "Politicas de privacidade, atendimento, trocas e orientacoes da loja."
};

export default function Page() {
  return <PoliciesPage />;
}
