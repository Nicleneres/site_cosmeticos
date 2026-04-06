export const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  } catch (error) {
    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
  }
};

