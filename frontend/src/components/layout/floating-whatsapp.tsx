"use client";

import { MessageCircle } from "lucide-react";
import { useStore } from "@/contexts/store-context";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";

export function FloatingWhatsApp() {
  const { storeData } = useStore();

  const url = generateWhatsAppLink(
    storeData.settings.whatsappNumber,
    "Ola, vim pelo site e quero ajuda para escolher meus produtos."
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#1fb95a]"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp
    </a>
  );
}
