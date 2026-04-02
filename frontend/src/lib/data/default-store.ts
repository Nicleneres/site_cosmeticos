import { HomeContent, StoreData, StoreSettings } from "@/types/store";

export const defaultStoreSettings: StoreSettings = {
  storeName: "Bella Aura Atelier",
  consultantName: "Camila Rocha",
  whatsappNumber: "5511996543210",
  instagramHandle: "@bellaaura.atelier",
  instagramUrl: "https://instagram.com/bellaaura.atelier",
  cityRegion: "Sao Paulo e regiao metropolitana",
  supportEmail: "contato@bellaaura.com.br",
  serviceHours: "Segunda a sabado, das 9h as 19h",
  orderMessageTemplate:
    "Ola, vim pelo site e gostaria de fazer um pedido:\n{{itens}}\nTotal: {{total}}\nNome: {{nome}}\nTelefone: {{telefone}}\nObservacoes: {{observacoes}}",
  privacyText:
    "Seus dados sao usados apenas para atendimento, confirmacao de pedidos e comunicacoes da loja.",
  exchangePolicyText:
    "Trocas sao avaliadas conforme condicoes do produto e prazo informado no atendimento.",
  attendancePolicyText:
    "Pedidos e duvidas sao respondidos em horario comercial, com retorno prioritario via WhatsApp.",
  independentNotice:
    "Loja de revenda independente. As marcas citadas pertencem a seus respectivos proprietarios."
};

export const defaultHomeContent: HomeContent = {
  heroBadge: "Curadoria premium para sua beleza",
  heroTitle: "Cosmeticos e maquiagem escolhidos para realcar sua melhor versao",
  heroSubtitle:
    "Na Bella Aura Atelier voce encontra fragrancias, skincare, maquiagem e kits presenteaveis com atendimento personalizado e pedido rapido pelo WhatsApp.",
  heroCtaPrimary: "Explorar catalogo",
  heroCtaSecondary: "Pedir no WhatsApp",
  bannerText:
    "Atendimento individual, sugestoes personalizadas e encomendas sob medida para sua rotina.",
  aboutShort:
    "Sou consultora de beleza independente e seleciono produtos de diferentes marcas para atender cada cliente com carinho, seguranca e praticidade.",
  benefits: [
    {
      id: "b-1",
      title: "Atendimento personalizado",
      description: "Indicacoes pensadas para seu estilo, pele e objetivo."
    },
    {
      id: "b-2",
      title: "Pedido rapido por WhatsApp",
      description: "Finalizacao simples, com mensagem automatica e suporte humano."
    },
    {
      id: "b-3",
      title: "Revendedora de confianca",
      description: "Produtos selecionados e acompanhamento ate a entrega."
    },
    {
      id: "b-4",
      title: "Novidades frequentes",
      description: "Lancamentos e kits especiais para voce aproveitar primeiro."
    }
  ]
};

export const defaultStoreData: StoreData = {
  products: [],
  brands: [],
  categories: [],
  promotions: [],
  testimonials: [],
  homeContent: defaultHomeContent,
  settings: defaultStoreSettings,
  newsletterLeads: [],
  contactMessages: [],
  orders: []
};
