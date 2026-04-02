"use client";

import Link from "next/link";
import { Instagram, MessageCircle, MapPin, Clock3, ShieldCheck } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useStore } from "@/contexts/store-context";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";

export function SiteFooter() {
  const { storeData } = useStore();

  const whatsappUrl = generateWhatsAppLink(
    storeData.settings.whatsappNumber,
    "Ola, vim pelo site e quero saber mais sobre os produtos."
  );

  return (
    <footer className="mt-16 border-t border-blush-100 bg-[#fffaf9]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-ink">{storeData.settings.storeName}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{storeData.homeContent.aboutShort}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">Atendimento</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2">
              <Clock3 className="mt-0.5 h-4 w-4" />
              {storeData.settings.serviceHours}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4" />
              {storeData.settings.cityRegion}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">Links uteis</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <Link href={ROUTES.faq} className="transition hover:text-ink">
                FAQ
              </Link>
            </li>
            <li>
              <Link href={ROUTES.policies} className="transition hover:text-ink">
                Politicas
              </Link>
            </li>
            <li>
              <Link href={ROUTES.testimonials} className="transition hover:text-ink">
                Depoimentos
              </Link>
            </li>
            <li>
              <Link href={ROUTES.admin} className="transition hover:text-ink">
                Painel admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-ink">Contato rapido</h4>
          <div className="mt-3 space-y-2 text-sm">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-muted transition hover:text-ink"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={storeData.settings.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-muted transition hover:text-ink"
            >
              <Instagram className="h-4 w-4" />
              {storeData.settings.instagramHandle}
            </a>
            <div className="flex items-center gap-2 text-muted">
              <ShieldCheck className="h-4 w-4" />
              Consultora independente
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-blush-100 px-4 py-4 text-center text-xs text-muted">
        <p>{storeData.settings.independentNotice}</p>
      </div>
    </footer>
  );
}
