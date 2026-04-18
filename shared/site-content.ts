const buildUnsplashUrl = (photoId: string, width = 1200, height = 900) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=${width}&h=${height}`;

// ============= IMAGE URLS (EDIT HERE) =============
export const BRAND_IMAGES = {
  logo: "/logo.png",
  logoFallback: "/favicon.png",
} as const;

export const SITE_NAME = "SR Pizza & Bakery";
export const SITE_SHORT_NAME = "SR Pizza & Bakery";
export const SITE_TAGLINE = "Melbourne's Halal Stone-Fired Pizza Experience";
export const SITE_DESCRIPTION =
  "Stone-fired halal pizza for live stations, weddings, and events across Melbourne with a fully mobile setup.";
export const SITE_SUPPORT_EMAIL = "shehzadraffikpizza@gmail.com";

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
  homeIntro:
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/482119532_1361121605238135_3174829072401754596_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_ohc=UPUW_zcplJwQ7kNvwE_wDEs&_nc_oc=AdqcVQMK_rdvYP9uxJiKtX1m87Kxyqq4iUIVbyhQcD2V7rnmdF-Pk6h6SXeW0YacxeU&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=GJdoZ6fgRPGHI1JoZZfSoA&_nc_ss=7a3a8&oh=00_Af2BJFgwq2CNDcViYxzpZd3bcQ0GynAfsKSZxql7izSYJw&oe=69D99A6E",
  homeFeatured: [
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/491822038_122150285576540071_3328766332386325043_n.jpg?stp=dst-jpg_s552x414_tt6&_nc_cat=104&ccb=1-7&_nc_sid=a934a8&_nc_ohc=4XxNUhAPAA8Q7kNvwGuIvkB&_nc_oc=AdqXqvOZTiwpCu7jDDsW5wvigeCpUGH4kBeyHYfqmlQvn2Wh1ikyxKdnD93Z0cuKEhE&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=XkjrShRkxX6XL0GxeqLxnA&_nc_ss=7a3a8&oh=00_Af0q7HGbBH91w8h-okxic9ZVYZKnCOQKtbyiNwjtlzuYZQ&oe=69D9AD0A",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/473069425_122131140176540071_6297027505593340517_n.jpg?stp=dst-jpg_s552x414_tt6&_nc_cat=100&ccb=1-7&_nc_sid=a934a8&_nc_ohc=tQhk8XHHi4wQ7kNvwGON_m8&_nc_oc=AdqKzs55we0mZ4TN7ocDl9L8TMsxjHctAvVymVHD87JizOib2jy5BrvvtETfBD4fles&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=4wNpCCnNOO3RJqa_hGGHrQ&_nc_ss=7a3a8&oh=00_Af0KXi8WixVV6ZjgPnhNpRiW5qtSctRcn-4Z3yZ09aJ-iQ&oe=69D98E8D",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/473061376_122131245386540071_7982874662607114152_n.jpg?stp=dst-jpg_s552x414_tt6&_nc_cat=105&ccb=1-7&_nc_sid=a934a8&_nc_ohc=sRrjN3e9u6AQ7kNvwHqWOSr&_nc_oc=Adq275TIacMPsMp5E5-nX6T-oVr6VzVOehoqA5nGazdkJzpqTrolHRA2OrIP0NaoQp0&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=zQcmcnjWmhMlcpIuZk9fjw&_nc_ss=7a3a8&oh=00_Af2MjH-3EGiHl3T4VGN0Rq8CmuGfpGu2P7R_UI0KE8Z8Bg&oe=69D99D4F",
  ],
    aboutBeginning:
      "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/473184524_122131340756540071_1369174657134032481_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=13d280&_nc_ohc=7nOaVZI5Up4Q7kNvwG_t0vo&_nc_oc=AdpZfF23G3aJpKIeiTdsdN9z1B05ufzW_Hu5PQrrWCkB3PoOWnWspjuekL8sle0CW6k&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=m_3q8ogeTL0WH2P3Bgwakg&_nc_ss=7a3a8&oh=00_Af184vnM4xTNE31fGOWpTkpc5x8RDyiqvkA_qemjdUiO9A&oe=69D9D07D",
  aboutPromise:
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/472391057_122130084194540071_4938546918082662319_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=53a332&_nc_ohc=4AqHZB_STY4Q7kNvwH1KAt4&_nc_oc=Adp0QScgLIdx0zHwMJtx8S8QbTjfK_sL2MRfWJHBCEVRrrj_aXMkGBCuYtkYXAjC0Ho&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=B4QPYK2-YYxgyG_tp9BDuw&_nc_ss=7a3a8&oh=00_Af1TsB9vi_AS4kv48GiqoU1IXRuAPicc7bVOToixDomHzg&oe=69D9B9DE",
  cateringHero:
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=1600",
  cateringSpread:
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAweq2_eS4VTfR7gVlrL7ka5GySWT00aTo00UO1YUuUN2bxgAG-zYysLubybLVc2J_kIsdIv0OemJukctknHmNOIrxFhGm5RAbCtC9bRezw4Rq9N2FA0_Cpe79OZVPGe5kvWX-oKmd=w344-h448-p-k-no",
  cateringDrinks:
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/472526612_122130086060540071_3548427378608157660_n.jpg?stp=c0.118.1440.1440a_dst-jpg_s552x414_tt6&_nc_cat=102&ccb=1-7&_nc_sid=a934a8&_nc_ohc=oFqfvDGMGqwQ7kNvwEAyGkM&_nc_oc=AdoyYFvmSg_JqaL-JgmALwlI-RuuRs4wZDTso4yGhbosFJZZf_2bT98vWfjDLXXbIwI&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=frlq769dwxm6T0CficdsuA&_nc_ss=7a3a8&oh=00_Af3joVRdGp7Hk_2YDSLcRgx8zh0dCu8LUWDQpA3mZ45eGw&oe=69D9B5D3",
  gallery: [
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/490324346_122150285618540071_4302102092000206630_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=8NaKSd0CS9kQ7kNvwHYYuYt&_nc_oc=Adqs98S4SfYFlXDwFLLazMJ4cGtM6vixlf0YrA2wKE_L0q4OQhfk9qMKMA-SWGi_s9s&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=72uagNmvV2Nb1qedNc8jHQ&_nc_ss=7a3a8&oh=00_Af1xVtbT-7Vk6p90BS7KPI4vjkN2KdNfWJuCkXpeMVi5FA&oe=69D9C34F",
    "https://lh3.googleusercontent.com/gps-cs-s/AHVAwepn1ng5kylsPEk3CWPSbXlYPufayDnA-5qu1ByC70OkBCTWBMbuJl1ko1y6zS0x829YrWF7fmMVCZ0mtL1vJGsotjcCF_gj7QNq8ijq0QAOMZuLkGkitAmnc7A56wjoWZJZAePT=w224-h224-p-k-no",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/473011729_122131356884540071_3529817799502949221_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=13d280&_nc_ohc=V_LK8SItwwEQ7kNvwGvvQAL&_nc_oc=Adq43Ig-lXGogDQrwiu3-NfpazxBeRvNpoTFUHXeimfjlgCPMeUCd2sNf-_kmndI2G0&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=1QgGW6QrPshlUUOFRhuxhQ&_nc_ss=7a3a8&oh=00_Af0O8JD_etEU8yEFTz-M4MceCiWxqjaQzYoGO0iWaWY1Mw&oe=69D99C08",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t51.75761-15/466003942_18265122310247794_9025514707728271764_n.jpg?stp=c0.119.1440.1440a_dst-jpg_s552x414_tt6&_nc_cat=107&ccb=1-7&_nc_sid=a934a8&_nc_ohc=tbLCJNeWnjsQ7kNvwFp1coO&_nc_oc=AdrI0C4eO456UtZknFdN5lAtZC8_iuqTKa7NrB9_riAofLCRxDQAVdVcrN1whwef4rg&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=zQcmcnjWmhMlcpIuZk9fjw&_nc_ss=7a3a8&oh=00_Af0gmbw-zO-0jJjjuSnIegX2MM9gGxAVNSc9-uSHXSJS6w&oe=69D9B99C",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/472627878_122130121484540071_3812242272906742600_n.jpg?stp=c0.54.1277.1277a_dst-jpg_s552x414_tt6&_nc_cat=108&ccb=1-7&_nc_sid=a934a8&_nc_ohc=1iUs3UaICYkQ7kNvwECMJYa&_nc_oc=AdoO_hdwJh0a8OzPXaHAnJmtbCCl6n35bjVosHjrT5SYryngCU5_n07ocZ1RRh-3_Lg&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=4wNpCCnNOO3RJqa_hGGHrQ&_nc_ss=7a3a8&oh=00_Af2jlK0bT2adk7qXzWnjqp_uZrkR_s6YrHgPKcRAFuXEUg&oe=69D99976",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/536282468_122169358520540071_3894604259954752380_n.jpg?stp=dst-jpg_s552x414_tt6&_nc_cat=100&ccb=1-7&_nc_sid=a934a8&_nc_ohc=uAtqDCocVKsQ7kNvwHQhfO6&_nc_oc=AdqvlsfXXHCyOLrkqocw_vSU5Y7EfvBgzloc-NQvBKOCsv3zFc3LMx54XEMcVfEmUbA&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=1l2RXE3vJs3ugLo0PTxmZA&_nc_ss=7a3a8&oh=00_Af1HJL71Dzm0oBghUMrWA-RWzxw7XNPNoTkPt72w7Z7g6w&oe=69D9A84C",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/493553680_122152750730540071_4733833368486924537_n.jpg?stp=c0.169.1536.1536a_cp6_dst-jpg_s552x414_tt6&_nc_cat=109&ccb=1-7&_nc_sid=4fc511&_nc_ohc=t3HNPLb5x0YQ7kNvwGfqgJh&_nc_oc=Adqdw8WijSNC4Z2IYMTpeahdvA0A_iW1Wx8o7NP__7mr45NBPcfGRKLF3db_9JYkrPw&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=pWW1kEOjssWmNk95ofoLuA&_nc_ss=7a3a8&oh=00_Af2xeqP7X7y2HudBXulw80QY_yTQWCZemcSzA3TpiOcYFw&oe=69D99B4F",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t51.75761-15/465979794_18265122292247794_6469378419744215037_n.jpg?stp=c0.119.1440.1440a_dst-jpg_s552x414_tt6&_nc_cat=109&ccb=1-7&_nc_sid=a934a8&_nc_ohc=lkfTAnwY0EgQ7kNvwE3HFvo&_nc_oc=AdrnwPpDC_SKAjL77OqX8LOVr95o_72w1uZ2Ya6l6cOpBMpXGw0YJfR6ZeHQPwc79ZI&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=zQcmcnjWmhMlcpIuZk9fjw&_nc_ss=7a3a8&oh=00_Af1ysSVaPjPLeYjxd62HFz2MStmjU81BWAfi469YLhBX-g&oe=69D99EE0",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/469778666_122125559294540071_8077884769010822987_n.jpg?stp=dst-jpg_s552x414_tt6&_nc_cat=104&ccb=1-7&_nc_sid=a934a8&_nc_ohc=JaYk6cUXYwoQ7kNvwFWc6FE&_nc_oc=AdohnB-f3TGam0hT1mkQXKOodgsYd9VAoMXqwzx_t1x6j3YhA6SEC9W6rx6fSW1TPU0&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=8KhB1mAIGb-n5fgpX0IN1g&_nc_ss=7a3a8&oh=00_Af2ExM4XzJvhahJWl7cvfc1Y94z6jjfQ2QNZwri1poYN7Q&oe=69D9A617",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/469973505_122125568240540071_2522009774400120746_n.jpg?stp=dst-jpg_s552x414_tt6&_nc_cat=105&ccb=1-7&_nc_sid=a934a8&_nc_ohc=Y0MB2Fl2hm8Q7kNvwEVea8r&_nc_oc=AdrpAkf4OySW9nU6SSU8yaBg6i58nOJxCwtgVHGdQH4t6SoRKCl_9CeX7AJ_tDfGXTo&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=8KhB1mAIGb-n5fgpX0IN1g&_nc_ss=7a3a8&oh=00_Af3TXHvsJ0u1d7I8ZejHgFSHvz3OXXsAp0Q99oiyvBTExA&oe=69D99185",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/469973505_122125568240540071_2522009774400120746_n.jpg?stp=dst-jpg_s552x414_tt6&_nc_cat=105&ccb=1-7&_nc_sid=a934a8&_nc_ohc=Y0MB2Fl2hm8Q7kNvwEVea8r&_nc_oc=AdrpAkf4OySW9nU6SSU8yaBg6i58nOJxCwtgVHGdQH4t6SoRKCl_9CeX7AJ_tDfGXTo&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=8KhB1mAIGb-n5fgpX0IN1g&_nc_ss=7a3a8&oh=00_Af3TXHvsJ0u1d7I8ZejHgFSHvz3OXXsAp0Q99oiyvBTExA&oe=69D99185",
    "https://scontent.fbir7-1.fna.fbcdn.net/v/t39.30808-6/482119532_1361121605238135_3174829072401754596_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_ohc=UPUW_zcplJwQ7kNvwE_wDEs&_nc_oc=AdqcVQMK_rdvYP9uxJiKtX1m87Kxyqq4iUIVbyhQcD2V7rnmdF-Pk6h6SXeW0YacxeU&_nc_zt=23&_nc_ht=scontent.fbir7-1.fna&_nc_gid=GJdoZ6fgRPGHI1JoZZfSoA&_nc_ss=7a3a8&oh=00_Af2BJFgwq2CNDcViYxzpZd3bcQ0GynAfsKSZxql7izSYJw&oe=69D99A6E",
  ],
} as const;
