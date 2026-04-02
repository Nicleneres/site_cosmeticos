import { Metadata } from "next";
import { CatalogPage } from "@/components/catalogo/catalog-page";

export const metadata: Metadata = {
  title: "Catalogo de produtos",
  description:
    "Explore perfumes, maquiagem, skincare, corpo, cabelos e kits com filtros por marca, categoria e preco."
};

export default function ProductsPage() {
  return <CatalogPage />;
}
