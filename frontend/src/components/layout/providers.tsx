"use client";

import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "@/contexts/store-context";
import { ToastProvider } from "@/contexts/toast-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        <ToastProvider>{children}</ToastProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
