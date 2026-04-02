import { Sparkles, Tag, TrendingUp, Gift } from "lucide-react";
import { ProductSeal } from "@/types/store";

type ProductBadgeProps = {
  seal: ProductSeal;
};

export function ProductBadge({ seal }: ProductBadgeProps) {
  if (!seal) return null;

  if (seal === "mais-vendido") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
        <TrendingUp className="h-3 w-3" />
        Mais vendido
      </span>
    );
  }

  if (seal === "novo") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
        <Sparkles className="h-3 w-3" />
        Novo
      </span>
    );
  }

  if (seal === "promocao") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">
        <Tag className="h-3 w-3" />
        Promocao
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
      <Gift className="h-3 w-3" />
      Kit
    </span>
  );
}
