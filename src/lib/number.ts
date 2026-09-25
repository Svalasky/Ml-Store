export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
}
