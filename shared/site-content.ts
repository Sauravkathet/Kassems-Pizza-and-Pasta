const buildUnsplashUrl = (photoId: string, width = 1200, height = 900) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=${width}&h=${height}`;

// ============= IMAGE URLS (EDIT HERE) =============
export const BRAND_IMAGES = {
  logo: "/logo.png",
  logoFallback: "/favicon.png",
} as const;

export const SITE_NAME = "Pizzaa Flame & Grill";
export const SITE_SHORT_NAME = "Pizzaa Flame & Grill";
export const SITE_TAGLINE = "Perth's Flame-Fired Pizza & Pasta Spot";
export const SITE_DESCRIPTION =
  "Flame-fired pizza, pasta, and crowd-pleasing catering across Perth with a fully mobile setup.";
export const SITE_SUPPORT_EMAIL = "shehzadraffikpizza@gmail.com";
export const SITE_SUPPORT_PHONE = "+61 415 743 566";
export const SITE_INSTAGRAM_URL = "https://instagram.com/s.r.pizza";
export const SITE_INSTAGRAM_HANDLE = "@s.r.pizza";
export const SITE_ADDRESS_LINE_ONE = "74 Lake Street";
export const SITE_ADDRESS_LINE_TWO = "Northbridge WA 6003";
export const SITE_LOCATION_NOTE =
  "Mobile set-up available for homes, offices, and private events across Perth.";
export const SITE_MAP_QUERY = "74 Lake Street, Northbridge WA 6003";

export const HOME_FEATURED_PIZZAS = [
  {
    title: "Chicken Paradiso",
    desc: "Tomato sauce, cheese, capsicum, crispy turkey, tomato, marinated chicken and garlic.",
    price: "A$19.00",
    imageUrl: buildUnsplashUrl("1513104890138-7c749659a591", 800, 800),
  },
  {
    title: "Meat Lovers",
    desc: "Tomato or BBQ sauce, cheese, beef, pepperoni and crispy turkey.",
    price: "A$19.00",
    imageUrl: buildUnsplashUrl("1593560708920-61dd98c46a4e", 800, 800),
  },
  {
    title: "Supreme",
    desc: "Tomato sauce, cheese, beef, onion, mushroom, pepperoni, crispy turkey, capsicum, tomatoes, pineapple and olives.",
    price: "A$17.00",
    imageUrl: buildUnsplashUrl("1534308983496-4fabb1a015ee", 800, 800),
  },
] as const;

export const HOME_HERO_MEDIA = {
  // Replace with a video URL (or leave blank to use the default local video)
  videoUrl: "",
  // Optional poster image for the hero video
  posterUrl: "",
} as const;

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
  // Paste exact image URLs here
  homeIntro: buildUnsplashUrl("1473093295043-cdd812d0e601", 1200, 900),
  homeFeatured: [
    buildUnsplashUrl("1513104890138-7c749659a591", 900, 700),
    buildUnsplashUrl("1593560708920-61dd98c46a4e", 900, 700),
    buildUnsplashUrl("1534308983496-4fabb1a015ee", 900, 700),
  ],
  aboutBeginning: buildUnsplashUrl("1513104890138-7c749659a591", 1200, 900),
  aboutPromise: buildUnsplashUrl("1473093295043-cdd812d0e601", 1200, 900),
  cateringHero:
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=1600",
  cateringSpread:
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq2_eS4VTfR7gVlrL7ka5GySWT00aTo00UO1YUuUN2bxgAG-zYysLubybLVc2J_kIsdIv0OemJukctknHmNOIrxFhGm5RAbCtC9bRezw4Rq9N2FA0_Cpe79OZVPGe5kvWX-oKmd=w344-h448-p-k-no",
  cateringDrinks:
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/472526612_122130086060540071_3548427378608157660_n.jpg?stp=c0.118.1440.1440a_dst-jpg_s552x414_tt6&_nc_cat=102&ccb=1-7&_nc_sid=a934a8&_nc_ohc=oFqfvDGMGqwQ7kNvwEAyGkM&_nc_oc=AdoyYFvmSg_JqaL-JgmALwlI-RuuRs4wZDTso4yGhbosFJZZf_2bT98vWfjDLXXbIwI&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=frlq769dwxm6T0CficdsuA&_nc_ss=7a3a8&oh=00_Af3joVRdGp7Hk_2YDSLcRgx8zh0dCu8LUWDQpA3mZ45eGw&oe=69D9B5D3",
  gallery: [
    buildUnsplashUrl("1513104890138-7c749659a591", 900, 900),
    buildUnsplashUrl("1593560708920-61dd98c46a4e", 900, 900),
    buildUnsplashUrl("1534308983496-4fabb1a015ee", 900, 900),
    buildUnsplashUrl("1473093295043-cdd812d0e601", 900, 900),
    buildUnsplashUrl("1621996346565-e3dbc646d9a9", 900, 900),
    buildUnsplashUrl("1512621776951-a57141f2eefd", 900, 900),
    buildUnsplashUrl("1546069901-ba9599a7e63c", 900, 900),
    buildUnsplashUrl("1488477181946-6428a0291777", 900, 900),
    buildUnsplashUrl("1551024601-bec78aea704b", 900, 900),
    buildUnsplashUrl("1551183053-bf91a1d81141", 900, 900),
    buildUnsplashUrl("1513104890138-7c749659a591", 900, 900),
    buildUnsplashUrl("1593560708920-61dd98c46a4e", 900, 900),
  ],
} as const;
