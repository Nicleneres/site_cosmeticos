import { Metadata } from "next";
import { ContactPage } from "@/components/contato/contact-page";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a consultora por WhatsApp, Instagram ou formulario de contato."
};

export default function Page() {
  return <ContactPage />;
}
