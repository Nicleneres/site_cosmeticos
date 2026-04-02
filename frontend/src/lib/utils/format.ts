export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

export function phoneMaskBR(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function stripPhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function uniqueId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}
