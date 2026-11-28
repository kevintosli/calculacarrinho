// One shared formatter: creating Intl formatters (or calling
// toLocaleString with options) on every render is comparatively slow.
const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function format_brl(value) {
  return BRL.format(Number(value));
}

// Amount without the currency symbol, e.g. "24,50" (the symbol is shown apart)
const AMOUNT = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function format_amount(value) {
  return AMOUNT.format(Number(value));
}
