import { Metadata } from "next";
import { BrandsPage } from "@/components/home/brands-page";

export const metadata: Metadata = {
  title: "Marcas trabalhadas",
  description:
    "Conheca as marcas revendidas de forma independente, com curadoria e atendimento personalizado."
};

export default function Page() {
  return <BrandsPage />;
}
