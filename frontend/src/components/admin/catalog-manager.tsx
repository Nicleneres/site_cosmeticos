"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useStore } from "@/contexts/store-context";
import { useToast } from "@/contexts/toast-context";

export function CatalogManager() {
  const { storeData, addBrand, removeBrand, addCategory, removeCategory } = useStore();
  const { showToast } = useToast();

  const [brandForm, setBrandForm] = useState({
    name: "",
    description: "",
    relatedCategories: [] as string[]
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });

  const onCreateBrand = async () => {
    if (!brandForm.name.trim()) {
      showToast({ title: "Nome da marca obrigatorio", variant: "error" });
      return;
    }

    try {
      await addBrand({
        name: brandForm.name.trim(),
        description: brandForm.description.trim(),
        relatedCategories: brandForm.relatedCategories,
        isActive: true
      });
      setBrandForm({ name: "", description: "", relatedCategories: [] });
      showToast({ title: "Marca cadastrada", variant: "success" });
    } catch (error) {
      showToast({
        title: "Falha ao cadastrar marca",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  const onCreateCategory = async () => {
    if (!categoryForm.name.trim()) {
      showToast({ title: "Nome da categoria obrigatorio", variant: "error" });
      return;
    }

    try {
      await addCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim()
      });
      setCategoryForm({ name: "", description: "" });
      showToast({ title: "Categoria cadastrada", variant: "success" });
    } catch (error) {
      showToast({
        title: "Falha ao cadastrar categoria",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "error"
      });
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Cadastrar marca</h2>
        <div className="mt-4 space-y-3">
          <Input
            label="Nome da marca"
            value={brandForm.name}
            onChange={(event) => setBrandForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Textarea
            label="Descricao"
            value={brandForm.description}
            onChange={(event) =>
              setBrandForm((current) => ({ ...current, description: event.target.value }))
            }
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink">Categorias relacionadas</p>
            <div className="grid gap-2">
              {storeData.categories.map((category) => (
                <label key={category.id} className="inline-flex items-center gap-2 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={brandForm.relatedCategories.includes(category.id)}
                    onChange={(event) => {
                      setBrandForm((current) => {
                        if (event.target.checked) {
                          return {
                            ...current,
                            relatedCategories: [...current.relatedCategories, category.id]
                          };
                        }
                        return {
                          ...current,
                          relatedCategories: current.relatedCategories.filter((id) => id !== category.id)
                        };
                      });
                    }}
                  />
                  {category.name}
                </label>
              ))}
            </div>
          </div>

          <Button onClick={onCreateBrand}>Cadastrar marca</Button>
        </div>

        <div className="mt-5 space-y-2">
          {storeData.brands.map((brand) => (
            <article
              key={brand.id}
              className="flex items-center justify-between rounded-xl border border-blush-100 bg-blush-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-ink">{brand.name}</span>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    await removeBrand(brand.id);
                    showToast({ title: "Marca removida", variant: "success" });
                  } catch (error) {
                    showToast({
                      title: "Falha ao remover marca",
                      description: error instanceof Error ? error.message : "Tente novamente.",
                      variant: "error"
                    });
                  }
                }}
              >
                Remover
              </Button>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-blush-100 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold text-ink">Cadastrar categoria</h2>
        <div className="mt-4 space-y-3">
          <Input
            label="Nome da categoria"
            value={categoryForm.name}
            onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
          />
          <Textarea
            label="Descricao"
            value={categoryForm.description}
            onChange={(event) =>
              setCategoryForm((current) => ({ ...current, description: event.target.value }))
            }
          />
          <Button onClick={onCreateCategory}>Cadastrar categoria</Button>
        </div>

        <div className="mt-5 space-y-2">
          {storeData.categories.map((category) => (
            <article
              key={category.id}
              className="flex items-center justify-between rounded-xl border border-blush-100 bg-blush-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-ink">{category.name}</span>
              <Button
                variant="danger"
                onClick={async () => {
                  try {
                    await removeCategory(category.id);
                    showToast({ title: "Categoria removida", variant: "success" });
                  } catch (error) {
                    showToast({
                      title: "Falha ao remover categoria",
                      description: error instanceof Error ? error.message : "Tente novamente.",
                      variant: "error"
                    });
                  }
                }}
              >
                Remover
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
