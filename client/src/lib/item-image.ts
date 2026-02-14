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

const IMAGE_FALLBACKS = {
  combo: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=900",
  ],
  pizza: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=900",
  ],
  pasta: [
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=900",
  ],
  salad: [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=900",
  ],
  sides: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=900",
  ],
  dessert: [
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=900",
  ],
  drink: [
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=900",
  ],
  meal: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=900",
  ],
} as const;

type ImageFallbackKey = keyof typeof IMAGE_FALLBACKS;

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
  const pool = IMAGE_FALLBACKS[key];
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
    trimmed.includes("placehold.co")
  );
}

export function resolveItemImage(itemName: string, imageUrl?: string | null): string {
  if (!isLogoImageUrl(imageUrl) && !isUnreliableRemoteUrl(imageUrl)) {
    return imageUrl as string;
  }
  return fallbackImageByName(itemName);
}
