/** Shared display formatting. */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** DRF sends decimals as strings; accept either that or a number. */
export function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? currency.format(amount) : "—";
}

export function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
