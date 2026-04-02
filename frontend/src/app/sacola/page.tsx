import { Metadata } from "next";
import { CartPage } from "@/components/sacola/cart-page";

export const metadata: Metadata = {
  title: "Minha sacola",
  description:
    "Revise os produtos selecionados e finalize o pedido com mensagem automatica no WhatsApp."
};

export default function Page() {
  return <CartPage />;
}
