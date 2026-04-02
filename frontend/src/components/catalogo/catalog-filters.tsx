"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Brand, Category, ProductFilters } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

type CatalogFiltersProps = {
  filters: ProductFilters;
  onChange: (next: ProductFilters) => void;
  brands: Brand[];
  categories: Category[];
  onClear: () => void;
};

export function CatalogFilters({
  filters,
  onChange,
  brands,
  categories,
  onClear
}: CatalogFiltersProps) {
  return (
    <section className="rounded-2xl border border-blush-100 bg-white p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros inteligentes
        </h3>
        <Button variant="ghost" className="h-8 px-2 text-xs" onClick={onClear}>
          <X className="mr-1 h-3 w-3" />
          Limpar
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Input
          label="Busca"
          value={filters.search}
          placeholder="Nome ou palavra-chave"
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          className="xl:col-span-2"
        />

        <Select
          label="Marca"
          value={filters.brandId}
          onChange={(event) => onChange({ ...filters, brandId: event.target.value })}
        >
          <option value="all">Todas as marcas</option>
          {brands
            .filter((brand) => brand.isActive)
            .map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
        </Select>

        <Select
          label="Categoria"
          value={filters.categoryId}
          onChange={(event) => onChange({ ...filters, categoryId: event.target.value })}
        >
          <option value="all">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>

        <Select
          label="Faixa de preco"
          value={filters.priceRange}
          onChange={(event) =>
            onChange({
              ...filters,
              priceRange: event.target.value as ProductFilters["priceRange"]
            })
          }
        >
          <option value="all">Todos</option>
          <option value="0-79">Ate R$ 79</option>
          <option value="80-149">R$ 80 a R$ 149</option>
          <option value="150+">Acima de R$ 150</option>
        </Select>

        <Select
          label="Ordenacao"
          value={filters.sortBy}
          onChange={(event) =>
            onChange({
              ...filters,
              sortBy: event.target.value as ProductFilters["sortBy"]
            })
          }
        >
          <option value="price-asc">Menor preco</option>
          <option value="price-desc">Maior preco</option>
          <option value="best-sellers">Mais vendidos</option>
          <option value="launches">Novidades</option>
        </Select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            filters.promotionsOnly
              ? "bg-red-100 text-red-700"
              : "bg-blush-100 text-muted hover:bg-blush-200"
          }`}
          onClick={() => onChange({ ...filters, promotionsOnly: !filters.promotionsOnly })}
        >
          Apenas promocoes
        </button>
        <button
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            filters.launchesOnly
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blush-100 text-muted hover:bg-blush-200"
          }`}
          onClick={() => onChange({ ...filters, launchesOnly: !filters.launchesOnly })}
        >
          Apenas lancamentos
        </button>
      </div>
    </section>
  );
}
