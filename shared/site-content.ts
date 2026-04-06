const buildUnsplashUrl = (photoId: string, width = 1200, height = 900) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=${width}&h=${height}`;

export const SITE_NAME = "Pizza Hub & Grill";
export const SITE_SHORT_NAME = "Pizza Hub & Grill";
export const SITE_TAGLINE = "Fire-Kissed Pizza & House-Made Pasta";
export const SITE_DESCRIPTION =
  "A polished pizza-and-pasta demo with bold branding, vibrant food photography, and a smooth ordering flow.";
export const SITE_SUPPORT_EMAIL = "support@pizzahubgrill.com";

export const ITEM_IMAGE_FALLBACKS = {
  combo: [
    buildUnsplashUrl("1513104890138-7c749659a591"),
    buildUnsplashUrl("1593560708920-61dd98c46a4e"),
  ],
  pizza: [
    buildUnsplashUrl("1513104890138-7c749659a591"),
    buildUnsplashUrl("1593560708920-61dd98c46a4e"),
    buildUnsplashUrl("1534308983496-4fabb1a015ee"),
  ],
  pasta: [
    buildUnsplashUrl("1473093295043-cdd812d0e601"),
    buildUnsplashUrl("1621996346565-e3dbc646d9a9"),
  ],
  salad: [
    buildUnsplashUrl("1512621776951-a57141f2eefd"),
    buildUnsplashUrl("1546069901-ba9599a7e63c"),
  ],
  sides: [
    buildUnsplashUrl("1546069901-ba9599a7e63c"),
    buildUnsplashUrl("1473093295043-cdd812d0e601"),
  ],
  dessert: [
    buildUnsplashUrl("1488477181946-6428a0291777"),
    buildUnsplashUrl("1551024601-bec78aea704b"),
  ],
  drink: [
    buildUnsplashUrl("1551183053-bf91a1d81141"),
    buildUnsplashUrl("1546069901-ba9599a7e63c"),
  ],
  meal: [
    buildUnsplashUrl("1546069901-ba9599a7e63c"),
    buildUnsplashUrl("1473093295043-cdd812d0e601"),
  ],
} as const;

export const MENU_CATEGORY_IMAGE_POOLS = {
  combos: ITEM_IMAGE_FALLBACKS.combo,
  pizza: ITEM_IMAGE_FALLBACKS.pizza,
  "vip-range-pizza": ITEM_IMAGE_FALLBACKS.pizza,
  pasta: ITEM_IMAGE_FALLBACKS.pasta,
  "mayas-main-meals": ITEM_IMAGE_FALLBACKS.meal,
  salads: ITEM_IMAGE_FALLBACKS.salad,
  "saras-sides": ITEM_IMAGE_FALLBACKS.sides,
  "merwans-sweet-temptations": ITEM_IMAGE_FALLBACKS.dessert,
  "daniellas-drinks": ITEM_IMAGE_FALLBACKS.drink,
} as const;

export const MARKETING_IMAGES = {
  homeIntro: buildUnsplashUrl("1473093295043-cdd812d0e601", 1400, 1000),
  aboutBeginning: buildUnsplashUrl("1513104890138-7c749659a591", 1200, 900),
  aboutPromise: buildUnsplashUrl("1534308983496-4fabb1a015ee", 1200, 900),
  cateringHero: buildUnsplashUrl("1593560708920-61dd98c46a4e", 1600, 1000),
  cateringSpread: buildUnsplashUrl("1546069901-ba9599a7e63c", 900, 900),
  cateringDrinks: buildUnsplashUrl("1551183053-bf91a1d81141", 900, 900),
  gallery: [
    buildUnsplashUrl("1513104890138-7c749659a591", 1000, 1000),
    buildUnsplashUrl("1593560708920-61dd98c46a4e", 1000, 1000),
    buildUnsplashUrl("1534308983496-4fabb1a015ee", 1000, 1000),
    buildUnsplashUrl("1473093295043-cdd812d0e601", 1000, 1000),
    buildUnsplashUrl("1621996346565-e3dbc646d9a9", 1000, 1000),
    buildUnsplashUrl("1512621776951-a57141f2eefd", 1000, 1000),
    buildUnsplashUrl("1546069901-ba9599a7e63c", 1000, 1000),
    buildUnsplashUrl("1488477181946-6428a0291777", 1000, 1000),
    buildUnsplashUrl("1551024601-bec78aea704b", 1000, 1000),
  ],
} as const;
