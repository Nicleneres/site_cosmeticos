import { Product } from "@/types/store";
import { ProductCard } from "@/components/produto/product-card";
import { EmptyState } from "@/components/common/empty-state";
import { SkeletonCard } from "@/components/common/skeleton-card";

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function ProductGrid({
  products,
  loading,
  emptyTitle = "Nenhum produto encontrado",
  emptyDescription = "Ajuste seus filtros ou tente uma nova busca para encontrar itens ideais para voce."
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
