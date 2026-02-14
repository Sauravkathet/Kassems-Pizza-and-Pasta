function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeSvgText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

function drinkPaletteByName(itemName: string): { from: string; to: string; tag: string } {
  const normalized = normalizeName(itemName);

  if (normalized.includes("pepsi") || normalized.includes("cola")) {
    return { from: "#1d4ed8", to: "#1e3a8a", tag: "Cola Drink" };
  }
  if (normalized.includes("red bull")) {
    return { from: "#dc2626", to: "#1f2937", tag: "Energy Drink" };
  }
  if (normalized.includes("water")) {
    return { from: "#0891b2", to: "#0e7490", tag: "Water" };
  }
  if (normalized.includes("lipton peach")) {
    return { from: "#f97316", to: "#9a3412", tag: "Iced Tea" };
  }
  if (normalized.includes("lipton")) {
    return { from: "#ca8a04", to: "#854d0e", tag: "Iced Tea" };
  }
  if (normalized.includes("gatorade")) {
    return { from: "#16a34a", to: "#14532d", tag: "Sports Drink" };
  }
  if (normalized.includes("pop top")) {
    return { from: "#ea580c", to: "#9a3412", tag: "Fruit Drink" };
  }
  if (
    normalized.includes("solo") ||
    normalized.includes("sunkist") ||
    normalized.includes("passsiona") ||
    normalized.includes("lemonade")
  ) {
    return { from: "#f59e0b", to: "#92400e", tag: "Citrus Soda" };
  }

  return { from: "#334155", to: "#1f2937", tag: "Soft Drink" };
}

export function fallbackImageByName(itemName: string): string {
  if (!isDrinkName(itemName)) {
    return "/logo.png";
  }

  const palette = drinkPaletteByName(itemName);
  const label = escapeSvgText(itemName);
  const tag = escapeSvgText(palette.tag);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${palette.from}" />
      <stop offset="100%" stop-color="${palette.to}" />
    </linearGradient>
  </defs>
  <rect width="900" height="675" fill="url(#bg)" />
  <rect x="88" y="146" width="724" height="382" rx="34" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.22)" />
  <text x="450" y="316" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="700" fill="#ffffff">${label}</text>
  <text x="450" y="372" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="500" fill="rgba(255,255,255,0.9)">${tag}</text>
</svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function isLogoImageUrl(imageUrl?: string | null): boolean {
  if (!imageUrl) return true;
  const trimmed = imageUrl.trim().toLowerCase();
  if (!trimmed) return true;
  return trimmed.endsWith("/logo.png") || trimmed === "logo.png" || trimmed.includes("/logo.png?");
}

export function resolveItemImage(itemName: string, imageUrl?: string | null): string {
  if (!isLogoImageUrl(imageUrl)) {
    return imageUrl as string;
  }
  return fallbackImageByName(itemName);
}
