import { Product, ProductFilters } from "@/types/store";

function productFinalPrice(product: Product): number {
  return product.promoPrice ?? product.price;
}

export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  const filtered = products.filter((product) => {
    if (!product.isActive) return false;

    const query = filters.search.trim().toLowerCase();
    if (query) {
      const searchable = [
        product.name,
        product.shortDescription,
        product.subcategory,
        ...product.keywords
      ]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(query)) return false;
    }

    if (filters.brandId !== "all" && product.brandId !== filters.brandId) return false;
    if (filters.categoryId !== "all" && product.categoryId !== filters.categoryId) return false;

    const price = productFinalPrice(product);
    if (filters.priceRange === "0-79" && (price < 0 || price > 79.99)) return false;
    if (filters.priceRange === "80-149" && (price < 80 || price > 149.99)) return false;
    if (filters.priceRange === "150+" && price < 150) return false;

    if (filters.promotionsOnly && !product.promoPrice) return false;
    if (filters.launchesOnly && !product.isLaunch) return false;

    return true;
  });

  const sorted = [...filtered];
  switch (filters.sortBy) {
    case "price-asc":
      sorted.sort((a, b) => productFinalPrice(a) - productFinalPrice(b));
      break;
    case "price-desc":
      sorted.sort((a, b) => productFinalPrice(b) - productFinalPrice(a));
      break;
    case "best-sellers":
      sorted.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
      break;
    case "launches":
      sorted.sort((a, b) => Number(b.isLaunch) - Number(a.isLaunch));
      break;
    default:
      break;
  }

  return sorted;
}

export function getRelatedProducts(products: Product[], currentProduct: Product): Product[] {
  return products
    .filter(
      (product) =>
        product.id !== currentProduct.id &&
        product.isActive &&
        (product.categoryId === currentProduct.categoryId ||
          product.brandId === currentProduct.brandId)
    )
    .slice(0, 4);
}
