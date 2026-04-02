"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CatalogFilters } from "@/components/catalogo/catalog-filters";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/produto/product-grid";
import { Button } from "@/components/ui/button";
import { useStore } from "@/contexts/store-context";
import { filterAndSortProducts } from "@/lib/utils/products";
import { ProductFilters } from "@/types/store";

const PRODUCTS_PER_PAGE = 8;

const defaultFilters: ProductFilters = {
  search: "",
  brandId: "all",
  categoryId: "all",
  priceRange: "all",
  promotionsOnly: false,
  launchesOnly: false,
  sortBy: "price-asc"
};

export function CatalogPage() {
  const { storeData, isHydrated } = useStore();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("categoria");
    if (categoryFromUrl) {
      setFilters((current) => ({ ...current, categoryId: categoryFromUrl }));
    }
  }, [searchParams]);

  const visibleProducts = useMemo(
    () => filterAndSortProducts(storeData.products, filters),
    [storeData.products, filters]
  );

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE));
  const pagedProducts = visibleProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Catalogo completo"
        title="Escolha por marca, categoria e faixa de preco"
        description="Filtros reais para facilitar seus pedidos e aumentar a conversao da vitrine."
      />

      <CatalogFilters
        filters={filters}
        onChange={setFilters}
        brands={storeData.brands}
        categories={storeData.categories}
        onClear={() => setFilters(defaultFilters)}
      />

      <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-card">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{visibleProducts.length}</span> produto(s) encontrado(s)
        </p>
        <p className="text-sm text-muted">
          Pagina <span className="font-semibold text-ink">{page}</span> de{" "}
          <span className="font-semibold text-ink">{totalPages}</span>
        </p>
      </div>

      <ProductGrid
        products={pagedProducts}
        loading={!isHydrated}
        emptyDescription="Nao encontramos produtos para esses filtros. Tente remover algum criterio."
      />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
            Anterior
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Proxima
          </Button>
        </div>
      )}
    </div>
  );
}
