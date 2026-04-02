"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastVariant = "success" | "error" | "info";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function toastIcon(variant: ToastVariant) {
  if (variant === "success") return <CheckCircle2 className="h-4 w-4" />;
  if (variant === "error") return <AlertTriangle className="h-4 w-4" />;
  return <Info className="h-4 w-4" />;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nextToast: ToastItem = { id, ...toast };
    setToasts((current) => [...current, nextToast]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-4 z-[80] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto rounded-2xl border px-4 py-3 shadow-soft backdrop-blur-sm",
              toast.variant === "success" && "border-emerald-200 bg-emerald-50/95 text-emerald-900",
              toast.variant === "error" && "border-red-200 bg-red-50/95 text-red-900",
              toast.variant === "info" && "border-blush-200 bg-white/95 text-ink"
            )}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{toastIcon(toast.variant)}</span>
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{toast.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
