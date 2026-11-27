// One shared formatter: creating Intl formatters (or calling
// toLocaleString with options) on every render is comparatively slow.
const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function format_brl(value) {
  return BRL.format(Number(value));
}
