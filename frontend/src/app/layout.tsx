import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bella-aura-atelier.vercel.app"),
  title: {
    default: "Bella Aura Atelier | Revendedora Independente de Cosméticos",
    template: "%s | Bella Aura Atelier"
  },
  description:
    "Loja de revenda independente com perfumes, maquiagem, skincare, kits presenteaveis e pedido rapido por WhatsApp.",
  openGraph: {
    title: "Bella Aura Atelier",
    description:
      "Catalogo multimarcas com atendimento personalizado para pedidos de beleza e autocuidado.",
    type: "website",
    locale: "pt_BR"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-[#fffdfb] text-ink antialiased`}>
        <Providers>
          <SiteHeader />
          <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6">
            {children}
          </main>
          <SiteFooter />
          <FloatingWhatsApp />
        </Providers>
      </body>
    </html>
  );
}
