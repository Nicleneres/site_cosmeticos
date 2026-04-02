import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-blush-100 bg-white p-8 text-center shadow-card">
      <h2 className="text-2xl font-semibold text-ink">Pagina nao encontrada</h2>
      <p className="mt-3 text-sm text-muted">
        O conteudo que voce tentou acessar nao existe ou foi movido.
      </p>
      <div className="mt-5">
        <Link href="/">
          <Button variant="secondary">Voltar para a home</Button>
        </Link>
      </div>
    </div>
  );
}
