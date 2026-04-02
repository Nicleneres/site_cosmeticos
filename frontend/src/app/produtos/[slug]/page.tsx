import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsPage } from "@/components/produto/product-details-page";
import { findProductBySlug } from "@/lib/server/product-queries";

type ProductSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  let product = null;
  try {
    product = await findProductBySlug(slug);
  } catch {
    product = null;
  }
  if (!product) {
    return {
      title: "Produto nao encontrado"
    };
  }
  return {
    title: product.name,
    description: product.shortDescription
  };
}

export default async function ProductPage({ params }: ProductSlugPageProps) {
  const { slug } = await params;
  let product = null;
  try {
    product = await findProductBySlug(slug);
  } catch {
    product = null;
  }
  if (!product) {
    notFound();
  }
  return <ProductDetailsPage slug={slug} />;
}
