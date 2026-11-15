export const PRODUCT_CATEGORIES = [
  "earrings",
  "necklace",
  "bracelet",
  "ring",
  "other",
  "home goods",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export function formatCategoryName(category: string) {
  return category.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
