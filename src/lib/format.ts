export function formatPrice(cents: number, currency = "PLN"): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
