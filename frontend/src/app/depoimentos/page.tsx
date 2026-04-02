import { Metadata } from "next";
import { TestimonialsPage } from "@/components/home/testimonials-page";

export const metadata: Metadata = {
  title: "Depoimentos",
  description: "Avaliacoes de clientes reais que compram com atendimento personalizado."
};

export default function Page() {
  return <TestimonialsPage />;
}
