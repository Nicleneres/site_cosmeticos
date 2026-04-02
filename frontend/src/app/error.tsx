"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-card">
      <h2 className="text-2xl font-semibold text-ink">Algo deu errado</h2>
      <p className="mt-3 text-sm text-muted">
        Ocorreu um erro inesperado. Tente novamente para recarregar a pagina.
      </p>
      <Button className="mt-5" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
