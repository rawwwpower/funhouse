export type ClothingItem = {
  id: string;
  name: string;
  brand: string;
  category: "tops" | "bottoms" | "shoes" | "outerwear" | "accessories" | "dresses";
  color: string;
  size: string;
  price: number;
  purchaseDate: string;
  image: string; // emoji placeholder
  wornCount: number;
  lastWorn: string | null;
};

export type Outfit = {
  id: string;
  name: string;
  items: string[]; // item ids
  date?: string;
};

export const ITEMS: ClothingItem[] = [
  { id: "1", name: "Linen Blazer", brand: "ZARA", category: "outerwear", color: "Beige", size: "M", price: 45990, purchaseDate: "2026-03-15", image: "🧥", wornCount: 8, lastWorn: "2026-04-01" },
  { id: "2", name: "Cotton T-Shirt", brand: "H&M", category: "tops", color: "Blanco", size: "S", price: 12990, purchaseDate: "2026-03-20", image: "👕", wornCount: 15, lastWorn: "2026-04-04" },
  { id: "3", name: "Wide Leg Pants", brand: "ASOS", category: "bottoms", color: "Negro", size: "38", price: 38500, purchaseDate: "2026-02-10", image: "👖", wornCount: 12, lastWorn: "2026-04-03" },
  { id: "4", name: "Midi Dress", brand: "MANGO", category: "dresses", color: "Floral", size: "M", price: 52000, purchaseDate: "2026-01-28", image: "👗", wornCount: 3, lastWorn: "2026-03-01" },
  { id: "5", name: "Silk Scarf", brand: "ZARA", category: "accessories", color: "Beige", size: "U", price: 18990, purchaseDate: "2026-02-14", image: "🧣", wornCount: 2, lastWorn: "2026-02-20" },
  { id: "6", name: "White Sneakers", brand: "NIKE", category: "shoes", color: "Blanco", size: "38", price: 65000, purchaseDate: "2025-11-20", image: "👟", wornCount: 30, lastWorn: "2026-04-04" },
  { id: "7", name: "Denim Jacket", brand: "LEVIS", category: "outerwear", color: "Azul", size: "M", price: 72000, purchaseDate: "2025-10-05", image: "🧥", wornCount: 20, lastWorn: "2026-03-28" },
  { id: "8", name: "Polo Shirt", brand: "LACOSTE", category: "tops", color: "Verde", size: "S", price: 48000, purchaseDate: "2026-01-10", image: "👕", wornCount: 6, lastWorn: "2026-03-15" },
  { id: "9", name: "Slim Jeans", brand: "ZARA", category: "bottoms", color: "Azul", size: "38", price: 32990, purchaseDate: "2025-12-01", image: "👖", wornCount: 25, lastWorn: "2026-04-02" },
  { id: "10", name: "Ankle Boots", brand: "ALDO", category: "shoes", color: "Negro", size: "38", price: 85000, purchaseDate: "2025-09-15", image: "👢", wornCount: 18, lastWorn: "2026-03-20" },
  { id: "11", name: "Knit Sweater", brand: "COS", category: "tops", color: "Crema", size: "M", price: 42000, purchaseDate: "2026-03-01", image: "🧶", wornCount: 10, lastWorn: "2026-03-30" },
  { id: "12", name: "Pleated Skirt", brand: "H&M", category: "bottoms", color: "Negro", size: "M", price: 22990, purchaseDate: "2026-02-20", image: "👗", wornCount: 7, lastWorn: "2026-03-25" },
  { id: "13", name: "Canvas Tote", brand: "MUJI", category: "accessories", color: "Natural", size: "U", price: 15000, purchaseDate: "2026-01-05", image: "👜", wornCount: 40, lastWorn: "2026-04-04" },
  { id: "14", name: "Striped Shirt", brand: "UNIQLO", category: "tops", color: "Azul/Blanco", size: "S", price: 19990, purchaseDate: "2026-03-10", image: "👔", wornCount: 4, lastWorn: "2026-03-22" },
  { id: "15", name: "Cardigan", brand: "COS", category: "outerwear", color: "Gris", size: "M", price: 55000, purchaseDate: "2025-08-01", image: "🧥", wornCount: 5, lastWorn: "2026-02-25" },
  { id: "16", name: "Loafers", brand: "MASSIMO DUTTI", category: "shoes", color: "Marrón", size: "38", price: 78000, purchaseDate: "2026-02-28", image: "👞", wornCount: 9, lastWorn: "2026-04-01" },
  { id: "17", name: "Tank Top", brand: "ZARA", category: "tops", color: "Negro", size: "S", price: 9990, purchaseDate: "2026-03-25", image: "👕", wornCount: 11, lastWorn: "2026-04-03" },
  { id: "18", name: "Linen Shorts", brand: "MANGO", category: "bottoms", color: "Beige", size: "M", price: 28990, purchaseDate: "2026-03-28", image: "🩳", wornCount: 2, lastWorn: "2026-04-02" },
];

export const PENDING_IMPORTS: (ClothingItem & { status: "pending" | "approved" | "skipped" })[] = [
  { id: "p1", name: "Oversized Blazer", brand: "ZARA", category: "outerwear", color: "Negro", size: "M", price: 52990, purchaseDate: "2026-04-03", image: "🧥", wornCount: 0, lastWorn: null, status: "pending" },
  { id: "p2", name: "Crop Top", brand: "BERSHKA", category: "tops", color: "Blanco", size: "S", price: 8990, purchaseDate: "2026-04-03", image: "👕", wornCount: 0, lastWorn: null, status: "pending" },
  { id: "p3", name: "Cargo Pants", brand: "PULL&BEAR", category: "bottoms", color: "Verde", size: "38", price: 24990, purchaseDate: "2026-04-02", image: "👖", wornCount: 0, lastWorn: null, status: "pending" },
  { id: "p4", name: "Platform Sandals", brand: "STRADIVARIUS", category: "shoes", color: "Negro", size: "38", price: 32990, purchaseDate: "2026-04-01", image: "👡", wornCount: 0, lastWorn: null, status: "approved" },
  { id: "p5", name: "Mini Bag", brand: "MANGO", category: "accessories", color: "Marrón", size: "U", price: 28990, purchaseDate: "2026-04-01", image: "👜", wornCount: 0, lastWorn: null, status: "approved" },
];

export const OUTFITS: Outfit[] = [
  { id: "o1", name: "Casual Friday", items: ["1", "3", "6"], date: "2026-04-04" },
  { id: "o2", name: "Brunch look", items: ["4", "10", "13"], date: "2026-04-06" },
  { id: "o3", name: "Office minimal", items: ["14", "12", "16"] },
  { id: "o4", name: "Weekend chill", items: ["11", "9", "6"] },
];

export const CATEGORIES = [
  { key: "all", label: "Todo" },
  { key: "tops", label: "Tops" },
  { key: "bottoms", label: "Bottoms" },
  { key: "shoes", label: "Zapatos" },
  { key: "outerwear", label: "Abrigos" },
  { key: "dresses", label: "Vestidos" },
  { key: "accessories", label: "Accesorios" },
] as const;

export function formatPrice(price: number) {
  return `$${price.toLocaleString("es-AR")}`;
}

export function daysSince(date: string | null): number | null {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
