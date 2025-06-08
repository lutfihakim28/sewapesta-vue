export function formatCurrency(value: number | string) {
  const formatter = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })

  return formatter.format(isNaN(Number(value)) ? 0 : Number(value))
}
