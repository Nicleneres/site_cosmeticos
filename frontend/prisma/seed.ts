import { PrismaClient, ProductSeal } from "@prisma/client";
import { hash } from "bcryptjs";
import { defaultHomeContent, defaultStoreSettings } from "../src/lib/data/default-store";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await hash("123456", 12);

  await prisma.user.upsert({
    where: { email: "admin@bellaaura.com" },
    update: {
      name: "Camila Rocha",
      passwordHash: adminPasswordHash
    },
    create: {
      email: "admin@bellaaura.com",
      name: "Camila Rocha",
      passwordHash: adminPasswordHash
    }
  });

  const categories = [
    {
      id: "perfumes",
      name: "Perfumes",
      slug: "perfumes",
      description: "Fragrancias femininas, masculinas e unissex para todas as ocasioes."
    },
    {
      id: "maquiagem",
      name: "Maquiagem",
      slug: "maquiagem",
      description: "Itens para pele, olhos e labios com acabamento elegante."
    },
    {
      id: "skincare",
      name: "Skincare",
      slug: "skincare",
      description: "Cuidados para limpeza, hidratacao e tratamento do rosto."
    },
    {
      id: "corpo-banho",
      name: "Corpo e banho",
      slug: "corpo-e-banho",
      description: "Hidratantes, sabonetes e cuidados de autocuidado para o dia a dia."
    },
    {
      id: "cabelos",
      name: "Cabelos",
      slug: "cabelos",
      description: "Shampoos, mascaras e finalizadores para fios saudaveis."
    },
    {
      id: "kits-presenteaveis",
      name: "Kits presenteaveis",
      slug: "kits-presenteaveis",
      description: "Combinacoes prontas para presentear em datas especiais."
    },
    {
      id: "promocoes",
      name: "Promocoes",
      slug: "promocoes",
      description: "Ofertas selecionadas com excelente custo-beneficio."
    }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category
    });
  }

  const brands = [
    {
      id: "oboticario",
      name: "O Boticario",
      slug: "o-boticario",
      description: "Linha completa para perfumaria, cuidados e presentes.",
      relatedCategories: ["perfumes", "corpo-banho", "kits-presenteaveis"],
      isActive: true
    },
    {
      id: "natura",
      name: "Natura",
      slug: "natura",
      description: "Produtos de beleza e bem-estar com foco em autocuidado.",
      relatedCategories: ["perfumes", "skincare", "cabelos"],
      isActive: true
    },
    {
      id: "avon",
      name: "Avon",
      slug: "avon",
      description: "Maquiagem, cuidados e fragrancias para o dia a dia.",
      relatedCategories: ["maquiagem", "perfumes", "corpo-banho"],
      isActive: true
    },
    {
      id: "maquiagem",
      name: "Maquiagem Premium",
      slug: "maquiagem-premium",
      description: "Curadoria de itens de maquiagem para acabamento profissional.",
      relatedCategories: ["maquiagem", "skincare"],
      isActive: true
    }
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      update: brand,
      create: brand
    });
  }

  const products = [
    {
      id: "p-001",
      name: "Eau de Parfum Flor de Seda 75ml",
      slug: "eau-de-parfum-flor-de-seda-75ml",
      shortDescription: "Fragrancia floral sofisticada com toque adocicado suave.",
      fullDescription:
        "Perfume feminino elegante para quem gosta de presenca delicada. Combina notas de peonia, baunilha cremosa e madeiras claras.",
      brandId: "oboticario",
      categoryId: "perfumes",
      subcategory: "Eau de Parfum",
      price: 189.9,
      promotionalPrice: 159.9,
      images: ["/placeholders/perfume.svg", "/placeholders/perfume-2.svg"],
      stock: 12,
      seal: ProductSeal.MAIS_VENDIDO,
      isActive: true,
      featured: true,
      isLaunch: false,
      bestSeller: true,
      keywords: ["perfume feminino", "floral", "presente"],
      usageMode: "Borrife nas areas quentes do corpo, como pescoco e pulsos.",
      benefits: ["Fixacao prolongada", "Fragrancia elegante para dia e noite", "Otima opcao para presente"]
    },
    {
      id: "p-003",
      name: "Base Liquida Efeito Natural FPS 25",
      slug: "base-liquida-efeito-natural-fps-25",
      shortDescription: "Cobertura media com acabamento luminoso.",
      fullDescription:
        "Base de longa duracao com textura confortavel. Uniformiza a pele sem pesar e ajuda a proteger com FPS 25.",
      brandId: "maquiagem",
      categoryId: "maquiagem",
      subcategory: "Pele",
      price: 84.9,
      images: ["/placeholders/maquiagem.svg"],
      stock: 18,
      seal: ProductSeal.NOVO,
      isActive: true,
      featured: true,
      isLaunch: true,
      bestSeller: false,
      keywords: ["base", "maquiagem", "fps"],
      usageMode:
        "Aplique pequenas quantidades com pincel, esponja ou dedos, espalhando do centro para as extremidades.",
      benefits: ["Acabamento natural", "Duracao prolongada", "Conforto na pele"]
    },
    {
      id: "p-004",
      name: "Paleta Glow Rosé 12 Cores",
      slug: "paleta-glow-rose-12-cores",
      shortDescription: "Sombras neutras e cintilantes para looks versateis.",
      fullDescription:
        "Paleta com combinacao de tons matte e glow, perfeita para maquiagem social ou producoes marcantes.",
      brandId: "avon",
      categoryId: "maquiagem",
      subcategory: "Olhos",
      price: 79.9,
      promotionalPrice: 64.9,
      images: ["/placeholders/maquiagem.svg", "/placeholders/maquiagem-2.svg"],
      stock: 10,
      seal: ProductSeal.PROMOCAO,
      isActive: true,
      featured: false,
      isLaunch: false,
      bestSeller: true,
      keywords: ["paleta", "sombras", "maquiagem olhos"],
      usageMode:
        "Use tons claros para iluminar e tons escuros no canto externo para profundidade.",
      benefits: ["Alta pigmentacao", "Facil de esfumar", "Tons elegantes"]
    },
    {
      id: "p-005",
      name: "Serum Facial Vitamina C 30ml",
      slug: "serum-facial-vitamina-c-30ml",
      shortDescription: "Luminosidade e uniformizacao da pele.",
      fullDescription:
        "Serum antioxidante com textura leve, indicado para rotina diurna e noturna. Ajuda no viço e na aparencia de manchas.",
      brandId: "natura",
      categoryId: "skincare",
      subcategory: "Tratamento facial",
      price: 119.9,
      images: ["/placeholders/skincare.svg"],
      stock: 16,
      seal: ProductSeal.MAIS_VENDIDO,
      isActive: true,
      featured: true,
      isLaunch: false,
      bestSeller: true,
      keywords: ["serum", "vitamina c", "skincare"],
      usageMode:
        "Com a pele limpa, aplique de 3 a 4 gotas no rosto e pescoco antes do hidratante.",
      benefits: ["Auxilia na luminosidade da pele", "Textura leve de rapida absorcao", "Pode ser usado diariamente"]
    },
    {
      id: "p-006",
      name: "Creme Hidratante Facial Nutri Glow",
      slug: "creme-hidratante-facial-nutri-glow",
      shortDescription: "Hidratacao intensa sem pesar.",
      fullDescription:
        "Creme facial com acido hialuronico e niacinamida para fortalecer a barreira cutanea e manter a pele macia.",
      brandId: "maquiagem",
      categoryId: "skincare",
      subcategory: "Hidratacao",
      price: 94.9,
      promotionalPrice: 79.9,
      images: ["/placeholders/skincare.svg"],
      stock: 14,
      seal: ProductSeal.PROMOCAO,
      isActive: true,
      featured: false,
      isLaunch: false,
      bestSeller: false,
      keywords: ["hidratante facial", "niacinamida"],
      usageMode: "Aplique apos limpeza e serum, duas vezes ao dia.",
      benefits: ["Hidratacao por horas", "Toque aveludado", "Nao oleoso"]
    },
    {
      id: "p-008",
      name: "Hidratante Corporal Ambar 400ml",
      slug: "hidratante-corporal-ambar-400ml",
      shortDescription: "Hidratacao profunda com perfume elegante.",
      fullDescription:
        "Locao hidratante de rapida absorcao, ideal para pele seca. Perfuma sem ficar enjoativo e deixa brilho natural.",
      brandId: "natura",
      categoryId: "corpo-banho",
      subcategory: "Hidratante corporal",
      price: 69.9,
      promotionalPrice: 54.9,
      images: ["/placeholders/corpo.svg"],
      stock: 20,
      seal: ProductSeal.PROMOCAO,
      isActive: true,
      featured: true,
      isLaunch: false,
      bestSeller: true,
      keywords: ["hidratante", "corpo", "autocuidado"],
      usageMode: "Espalhe no corpo limpo com movimentos suaves.",
      benefits: ["Rapida absorcao", "Pele macia", "Fragrancia sofisticada"]
    },
    {
      id: "p-010",
      name: "Mascara Capilar Reconstrucao 250g",
      slug: "mascara-capilar-reconstrucao-250g",
      shortDescription: "Tratamento intensivo para fios danificados.",
      fullDescription:
        "Mascara capilar para reposicao de massa e fortalecimento dos fios. Deixa o cabelo maleavel e com menos quebra.",
      brandId: "avon",
      categoryId: "cabelos",
      subcategory: "Tratamento",
      price: 58.9,
      promotionalPrice: 46.9,
      images: ["/placeholders/cabelo.svg"],
      stock: 19,
      seal: ProductSeal.PROMOCAO,
      isActive: true,
      featured: false,
      isLaunch: true,
      bestSeller: false,
      keywords: ["mascara capilar", "reconstrucao"],
      usageMode:
        "Aplique apos o shampoo no comprimento e pontas, deixe agir por 5 minutos e enxague.",
      benefits: ["Menos quebra", "Mais maciez", "Brilho intenso"]
    },
    {
      id: "p-011",
      name: "Kit Presente Perfume + Hidratante Rosé",
      slug: "kit-presente-perfume-hidratante-rose",
      shortDescription: "Combinacao elegante para surpreender.",
      fullDescription:
        "Kit com perfume feminino 50ml e hidratante corporal 200ml em caixa presenteavel. Excelente para aniversario e datas romanticas.",
      brandId: "oboticario",
      categoryId: "kits-presenteaveis",
      subcategory: "Kit feminino",
      price: 219.9,
      promotionalPrice: 189.9,
      images: ["/placeholders/kit.svg", "/placeholders/kit-2.svg"],
      stock: 8,
      seal: ProductSeal.KIT,
      isActive: true,
      featured: true,
      isLaunch: false,
      bestSeller: true,
      keywords: ["kit presente", "perfume", "hidratante"],
      usageMode:
        "Use o hidratante apos o banho e finalize com o perfume para maior fixacao.",
      benefits: ["Presente pronto", "Excelente custo-beneficio", "Embalagem delicada"]
    },
    {
      id: "p-012",
      name: "Kit Autocuidado Spa em Casa",
      slug: "kit-autocuidado-spa-em-casa",
      shortDescription: "Sabonete, esfoliante e creme para um ritual completo.",
      fullDescription:
        "Kit com 3 itens para banho relaxante e hidratacao profunda. Um convite para pausar e cuidar de voce.",
      brandId: "natura",
      categoryId: "kits-presenteaveis",
      subcategory: "Kit autocuidado",
      price: 149.9,
      images: ["/placeholders/kit.svg"],
      stock: 11,
      seal: ProductSeal.KIT,
      isActive: true,
      featured: true,
      isLaunch: true,
      bestSeller: false,
      keywords: ["spa em casa", "kit autocuidado"],
      usageMode:
        "Use o esfoliante durante o banho e finalize com hidratante corporal.",
      benefits: ["Ritual completo", "Aroma relaxante", "Ideal para presente"]
    },
    {
      id: "p-013",
      name: "Batom Cremoso Nude Chic",
      slug: "batom-cremoso-nude-chic",
      shortDescription: "Cor elegante para uso diario.",
      fullDescription:
        "Batom de textura cremosa e alta cobertura, com sensacao confortavel nos labios.",
      brandId: "maquiagem",
      categoryId: "maquiagem",
      subcategory: "Labios",
      price: 39.9,
      images: ["/placeholders/maquiagem.svg"],
      stock: 35,
      seal: ProductSeal.MAIS_VENDIDO,
      isActive: true,
      featured: false,
      isLaunch: false,
      bestSeller: true,
      keywords: ["batom nude", "maquiagem labios"],
      usageMode: "Aplique diretamente nos labios, iniciando pelo centro.",
      benefits: ["Conforto prolongado", "Cor sofisticada", "Boa durabilidade"]
    },
    {
      id: "p-017",
      name: "Colonia Masculina Urban 100ml",
      slug: "colonia-masculina-urban-100ml",
      shortDescription: "Fragrancia amadeirada fresca para rotina e eventos.",
      fullDescription:
        "Colonia masculina com equilibrio entre notas citricas e amadeiradas. Excelente opcao para presente.",
      brandId: "oboticario",
      categoryId: "perfumes",
      subcategory: "Colonia masculina",
      price: 139.9,
      images: ["/placeholders/perfume-2.svg"],
      stock: 13,
      seal: ProductSeal.NOVO,
      isActive: true,
      featured: false,
      isLaunch: true,
      bestSeller: false,
      keywords: ["colonia masculina", "presente masculino"],
      usageMode: "Borrife no pescoco e pulsos, evitando esfregar.",
      benefits: ["Fragrancia moderna", "Boa projecao", "Versatil"]
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product
    });
  }

  const promotions = [
    {
      id: "promo-1",
      title: "Semana da Pele Iluminada",
      description: "Ate 20% OFF em itens de skincare selecionados.",
      discountLabel: "Ate 20% OFF",
      productIds: ["p-005", "p-006"],
      isActive: true,
      expiresAt: new Date("2026-12-31")
    },
    {
      id: "promo-2",
      title: "Especial Kits para Presente",
      description: "Kits com preco especial para surpreender em qualquer data.",
      discountLabel: "Economize ate R$ 30",
      productIds: ["p-011", "p-012"],
      isActive: true,
      expiresAt: new Date("2026-12-31")
    }
  ];

  for (const promotion of promotions) {
    await prisma.promotion.upsert({
      where: { id: promotion.id },
      update: promotion,
      create: promotion
    });
  }

  const testimonials = [
    {
      id: "t-001",
      name: "Mariana Souza",
      city: "Sao Paulo - SP",
      rating: 5,
      message:
        "Atendimento impecavel. Recebi ajuda para escolher um kit e chegou tudo lindo e bem embalado."
    },
    {
      id: "t-002",
      name: "Patricia Lima",
      city: "Campinas - SP",
      rating: 5,
      message:
        "Compro sempre meus perfumes aqui. Atendimento rapido no WhatsApp e entrega super pontual."
    },
    {
      id: "t-003",
      name: "Fernanda Alves",
      city: "Sorocaba - SP",
      rating: 5,
      message:
        "A consultora entende exatamente o que eu preciso. Os produtos sao originais e o atendimento e muito humano."
    }
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      update: testimonial,
      create: testimonial
    });
  }

  await prisma.setting.upsert({
    where: { key: "store_settings" },
    update: { value: defaultStoreSettings },
    create: { key: "store_settings", value: defaultStoreSettings }
  });

  await prisma.setting.upsert({
    where: { key: "home_content" },
    update: { value: defaultHomeContent },
    create: { key: "home_content", value: defaultHomeContent }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
