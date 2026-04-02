import { Metadata } from "next";
import { KitsPage } from "@/components/home/kits-page";

export const metadata: Metadata = {
  title: "Kits e presentes",
  description:
    "Kits presenteaveis e opcoes personalizadas para aniversario, datas especiais e mimos."
};

export default function Page() {
  return <KitsPage />;
}
