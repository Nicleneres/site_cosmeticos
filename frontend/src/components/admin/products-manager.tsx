"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";
import { formatCurrency, slugify } from "@/lib/utils/format";
import { Product, ProductSeal } from "@/types/store";

type ProductFormState = {
  name: string;
  shortDescription: string;
  fullDescription: string;
  brandId: string;
  categoryId: string;
  subcategory: string;
  price: string;
  promoPrice: string;
  images: string;
  stock: string;
  seal: "" | Exclude<ProductSeal, null>;
  isActive: boolean;
  featured: boolean;
  isLaunch: boolean;
  bestSeller: boolean;
  keywords: string;
  usageMode: string;
  benefits: string;
};

function defaultProductForm(brandId: string, categoryId: string): ProductFormState {
  return {
    name: "",
    shortDescription: "",
    fullDescription: "",
    brandId,
    categoryId,
    subcategory: "",
    price: "",
    promoPrice: "",
    images: "/placeholders/product.svg",
    stock: "",
    seal: "",
    isActive: true,
    featured: false,
    isLaunch: false,
    bestSeller: false,
    keywords: "",
    usageMode: "",
    benefits: ""
  };
}

function mapProductToForm(product: Product): ProductFormState {
  return {
    name: product.name,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    brandId: product.brandId,
    categoryId: product.categoryId,
    subcategory: product.subcategory,
    price: String(product.price),
    promoPrice: product.promoPrice ? String(product.promoPrice) : "",
    images: product.images.join(", "),
    stock: product.stock ? String(product.stock) : "",
    seal: product.seal ?? "",
    isActive: product.isActive,
    featured: product.featured,
    isLaunch: product.isLaunch,
    bestSeller: product.bestSeller,
    keywords: product.keywords.join(", "),
    usageMode: product.usageMode,
    benefits: product.benefits.join("\n")
  };
}

export function ProductsManager() {
  const { storeData, addProduct, updateProduct, removeProduct } = useStore();
  const { showToast } = useToast();

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState<ProductFormState>(() =>
    defaultProductForm(storeData.brands[0]?.id ?? "", storeData.categories[0]?.id ?? "")
  );

  const sortedProducts = useMemo(
    () => [...storeData.products].sort((a, b) => a.name.localeCompare(b.name)),
    [storeData.products]
  );

  const selectedProduct = useMemo(
    () => storeData.products.find((product) => product.id === editingProductId) ?? null,
    [editingProductId, storeData.products]
  );

  const resetForm = () => {
    setEditingProductId(null);
    setForm(defaultProductForm(storeData.brands[0]?.id ?? "", storeData.categories[0]?.id ?? ""));
  };

  const onSave = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      showToast({
        title: "Nome e preco sao obrigatorios",
        variant: "error"
      });
      return;
    }

    const payload = {
      name: form.name.trim(),
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      brandId: form.brandId,
      categoryId: form.categoryId,
      subcategory: form.subcategory.trim() || "Geral",
      price: Number(form.price.replace(",", ".")) || 0,
      promoPrice: Number(form.promoPrice.replace(",", ".")) || undefined,
      images: form.images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      stock: Number(form.stock) || undefined,
      seal: form.seal || null,
      isActive: form.isActive,
      featured: form.featured,
      isLaunch: form.isLaunch,
      bestSeller: form.bestSeller,
      keywords: form.keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      usageMode: form.usageMode.trim(),
      benefits: form.benefits
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      setIsSaving(true);
      if (editingProductId && selectedProduct) {
        await updateProduct({
          ...selectedProduct,
          ...payload,
          slug: slugify(payload.name)
        });
        showToast({ title: "Produto atualizado", variant: "success" });
      } else {
        await addProduct({
          ...payload,
          slug: slugify(payload.name)
        });
        showToast({ title: "Produto cadastrado", variant: "success" });
      }
      resetForm();
    } catch (error) {
      showToast({
        title: "Falha ao salvar produto",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Falha no upload da imagem.");
      }

      setForm((current) => {
        const currentImages = current.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        return {
          ...current,
          images: [...currentImages, data.url].join(", ")
        };
      });
      showToast({
        title: "Imagem enviada",
        variant: "success"
      });
    } catch (error) {
      showToast({
        title: "Falha ao enviar imagem",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">
          {editingProductId ? "Editar produto" : "Cadastrar produto"}
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            label="Nome"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Input
            label="Subcategoria"
            value={form.subcategory}
            onChange={(event) =>
              setForm((current) => ({ ...current, subcategory: event.target.value }))
            }
          />
          <Select
            label="Marca"
            value={form.brandId}
            onChange={(event) => setForm((current) => ({ ...current, brandId: event.target.value }))}
          >
            {storeData.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </Select>
          <Select
            label="Categoria"
            value={form.categoryId}
            onChange={(event) =>
              setForm((current) => ({ ...current, categoryId: event.target.value }))
            }
          >
            {storeData.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Input
            label="Preco"
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
          />
          <Input
            label="Preco promocional"
            value={form.promoPrice}
            onChange={(event) =>
              setForm((current) => ({ ...current, promoPrice: event.target.value }))
            }
          />
          <Input
            label="Estoque"
            value={form.stock}
            onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
          />
          <Select
            label="Selo"
            value={form.seal}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                seal: event.target.value as ProductFormState["seal"]
              }))
            }
          >
            <option value="">Sem selo</option>
            <option value="mais-vendido">Mais vendido</option>
            <option value="novo">Novo</option>
            <option value="promocao">Promocao</option>
            <option value="kit">Kit</option>
          </Select>
        </div>

        <div className="mt-3 grid gap-3">
          <Textarea
            label="Descricao curta"
            value={form.shortDescription}
            onChange={(event) =>
              setForm((current) => ({ ...current, shortDescription: event.target.value }))
            }
          />
          <Textarea
            label="Descricao completa"
            value={form.fullDescription}
            onChange={(event) =>
              setForm((current) => ({ ...current, fullDescription: event.target.value }))
            }
          />
          <Textarea
            label="Modo de uso"
            value={form.usageMode}
            onChange={(event) => setForm((current) => ({ ...current, usageMode: event.target.value }))}
          />
          <Textarea
            label="Beneficios (uma linha por item)"
            value={form.benefits}
            onChange={(event) => setForm((current) => ({ ...current, benefits: event.target.value }))}
          />
          <Input
            label="Imagens (URLs separadas por virgula)"
            value={form.images}
            onChange={(event) => setForm((current) => ({ ...current, images: event.target.value }))}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">Upload de imagem (Cloudinary)</span>
            <input
              type="file"
              accept="image/*"
              onChange={onUploadImage}
              disabled={isUploading}
              className="rounded-xl border border-blush-200 bg-white px-3 py-2 text-sm text-ink"
            />
            <span className="text-xs text-muted">
              {isUploading ? "Enviando imagem..." : "A URL sera adicionada automaticamente no campo de imagens."}
            </span>
          </label>
          <Input
            label="Palavras-chave (separadas por virgula)"
            value={form.keywords}
            onChange={(event) => setForm((current) => ({ ...current, keywords: event.target.value }))}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            />
            Ativo
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
            />
            Destaque
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isLaunch}
              onChange={(event) => setForm((current) => ({ ...current, isLaunch: event.target.checked }))}
            />
            Lancamento
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.bestSeller}
              onChange={(event) => setForm((current) => ({ ...current, bestSeller: event.target.checked }))}
            />
            Mais vendido
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving
              ? "Salvando..."
              : editingProductId
                ? "Salvar alteracoes"
                : "Cadastrar produto"}
          </Button>
          {editingProductId && (
            <Button variant="outline" onClick={resetForm} disabled={isSaving}>
              Cancelar
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h3 className="text-lg font-semibold text-ink">Produtos cadastrados</h3>
        <div className="mt-4 grid gap-3">
          {sortedProducts.map((product) => (
            <article
              key={product.id}
              className="grid gap-3 rounded-xl border border-blush-100 bg-blush-50 p-4 md:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-semibold text-ink">{product.name}</p>
                <p className="text-xs text-muted">
                  {product.slug} - {formatCurrency(product.promoPrice ?? product.price)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setEditingProductId(product.id); setForm(mapProductToForm(product)); }}>
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={async () => {
                    try {
                      await removeProduct(product.id);
                      showToast({ title: "Produto removido", variant: "success" });
                    } catch (error) {
                      showToast({
                        title: "Falha ao remover produto",
                        description: error instanceof Error ? error.message : "Tente novamente.",
                        variant: "error"
                      });
                    }
                  }}
                >
                  Remover
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
