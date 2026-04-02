"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";
import { useStore } from "@/contexts/store-context";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.catalog, label: "Catalogo" },
  { href: ROUTES.brands, label: "Marcas" },
  { href: ROUTES.kits, label: "Kits" },
  { href: ROUTES.promotions, label: "Promocoes" },
  { href: ROUTES.about, label: "Sobre" },
  { href: ROUTES.contact, label: "Contato" }
];

function HeaderLink({ href, label, active }: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-semibold transition",
        active ? "text-ink" : "text-muted hover:text-ink"
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, storeData } = useStore();

  const isActive = useMemo(
    () => (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-blush-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blush-200 to-nude-300 text-sm font-bold text-ink">
            BA
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">{storeData.settings.storeName}</p>
            <p className="text-[11px] text-muted">Revendedora independente</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <HeaderLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.cart}
            className="relative rounded-xl border border-blush-200 p-2.5 text-ink transition hover:bg-blush-50"
            aria-label="Abrir sacola"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="rounded-xl border border-blush-200 p-2.5 text-ink md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-blush-100 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-blush-100 text-ink"
                    : "text-muted hover:bg-blush-50 hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ROUTES.admin}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-blush-50 hover:text-ink"
            >
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
