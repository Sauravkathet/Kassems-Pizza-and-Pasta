import { ITEM_IMAGE_FALLBACKS } from "@shared/site-content";

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

type ImageFallbackKey = keyof typeof ITEM_IMAGE_FALLBACKS;

function isDrinkName(name: string): boolean {
  const normalized = normalizeName(name);
  return (
    normalized.includes("pepsi") ||
    normalized.includes("cola") ||
    normalized.includes("red bull") ||
    normalized.includes("gatorade") ||
    normalized.includes("lipton") ||
    normalized.includes("water") ||
    normalized.includes("solo") ||
    normalized.includes("sunkist") ||
    normalized.includes("passsiona") ||
    normalized.includes("lemonade") ||
    normalized.includes("soft drink") ||
    normalized.includes("pop top")
  );
}

function inferImageFallbackKey(itemName: string): ImageFallbackKey {
  const normalized = normalizeName(itemName);

  if (isDrinkName(itemName)) return "drink";
  if (normalized.includes("combo")) return "combo";
  if (normalized.includes("salad")) return "salad";

  if (
    normalized.includes("pasta") ||
    normalized.includes("spaghetti") ||
    normalized.includes("penne") ||
    normalized.includes("fettuccine") ||
    normalized.includes("ravioli") ||
    normalized.includes("gnocchi") ||
    normalized.includes("lasagna")
  ) {
    return "pasta";
  }

  if (
    normalized.includes("cake") ||
    normalized.includes("cheesecake") ||
    normalized.includes("slice") ||
    normalized.includes("chocolate") ||
    normalized.includes("dessert")
  ) {
    return "dessert";
  }

  if (
    normalized.includes("chips") ||
    normalized.includes("wedges") ||
    normalized.includes("nachos") ||
    normalized.includes("garlic bread") ||
    normalized.includes("nuggets") ||
    normalized.includes("side")
  ) {
    return "sides";
  }

  if (
    normalized.includes("meal") ||
    normalized.includes("wings") ||
    normalized.includes("parmigiana")
  ) {
    return "meal";
  }

  return "pizza";
}

export function fallbackImageByName(itemName: string): string {
  const key = inferImageFallbackKey(itemName);
  const pool = ITEM_IMAGE_FALLBACKS[key];
  const index = hashString(normalizeName(itemName)) % pool.length;
  return pool[index];
}

function isLogoImageUrl(imageUrl?: string | null): boolean {
  if (!imageUrl) return true;
  const trimmed = imageUrl.trim().toLowerCase();
  if (!trimmed) return true;
  return trimmed.endsWith("/logo.png") || trimmed === "logo.png" || trimmed.includes("/logo.png?");
}

function isUnreliableRemoteUrl(imageUrl?: string | null): boolean {
  if (!imageUrl) return true;
  const trimmed = imageUrl.trim().toLowerCase();
  return (
    trimmed.includes("source.unsplash.com") ||
    trimmed.includes("loremflickr.com") ||
    trimmed.includes("placehold.co") ||
    trimmed.includes("googleusercontent.com") ||
    trimmed.includes("fbcdn.net")
  );
}

export function resolveItemImage(itemName: string, imageUrl?: string | null): string {
  if (!isLogoImageUrl(imageUrl) && !isUnreliableRemoteUrl(imageUrl)) {
    return imageUrl as string;
  }
  return fallbackImageByName(itemName);
}
