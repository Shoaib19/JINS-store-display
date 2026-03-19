/**
 * 価格の変換
 * @param price -価格
 * @returns $ 価格
 */
export const convertPrice = (price?: number | null): string | null => {
  if (price == null || price == undefined) return null
  return "$ " + price
}