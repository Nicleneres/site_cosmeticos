import { Metadata } from "next";
import { AboutPage } from "@/components/home/about-page";

export const metadata: Metadata = {
  title: "Sobre a consultora",
  description:
    "Conheca a historia da consultora de beleza e os diferenciais de atendimento da revendedora independente."
};

export default function Page() {
  return <AboutPage />;
}
