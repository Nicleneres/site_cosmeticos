export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isRequiredFilled(...values: string[]): boolean {
  return values.every((value) => value.trim().length > 0);
}
