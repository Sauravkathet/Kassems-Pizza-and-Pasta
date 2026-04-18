import type { CategoryWithItems, MenuItem } from "./schema";
import { MENU_CATEGORY_IMAGE_POOLS } from "./site-content";

export const MENU_CATEGORY_SEEDS = [
  { name: "Combos", slug: "combos", sortOrder: 1 },
  { name: "Pizza", slug: "pizza", sortOrder: 2 },
  { name: "VIP Range Pizza", slug: "vip-range-pizza", sortOrder: 3 },
  { name: "Pasta", slug: "pasta", sortOrder: 4 },
  { name: "Mayas Main Meals", slug: "mayas-main-meals", sortOrder: 5 },
  { name: "SALADS", slug: "salads", sortOrder: 6 },
  { name: "Sara's Sides", slug: "saras-sides", sortOrder: 7 },
  { name: "Merwans Sweet Temptations", slug: "merwans-sweet-temptations", sortOrder: 8 },
  { name: "Daniella's Drinks", slug: "daniellas-drinks", sortOrder: 9 },
] as const;

export type MenuCategorySlug = (typeof MENU_CATEGORY_SEEDS)[number]["slug"];

export type MenuItemSeed = {
  categorySlug: MenuCategorySlug;
  name: string;
  description: string;
  price: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
};

export function normalizeMenuName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function buildMenuImageUrl(itemName: string, categorySlug: MenuCategorySlug): string {
  const normalizedItemName = itemName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const pool = MENU_CATEGORY_IMAGE_POOLS[categorySlug];
  const hashKey = `${categorySlug}:${normalizedItemName}`;
  const index = hashString(hashKey) % pool.length;
  return pool[index];
}

export const MENU_ITEM_SEEDS: MenuItemSeed[] = [
  {
    categorySlug: "combos",
    name: "Combo Three",
    description: "Two large pizza standard range with a footlong garlic bread and choice of 1.25L drink.",
    price: "58.00",
    isPopular: true,
  },
  {
    categorySlug: "combos",
    name: "Combo Four",
    description: "Two family pizza standard range with a footlong garlic bread and choice of 1.25L drink.",
    price: "68.00",
    isPopular: true,
  },
  {
    categorySlug: "combos",
    name: "Combo Two",
    description: "One family pizza standard range with a footlong garlic bread and choice of 1.25L drink.",
    price: "45.00",
  },
  {
    categorySlug: "combos",
    name: "Combo One",
    description: "One large pizza standard range with a footlong garlic bread and choice of 1.25L drink.",
    price: "40.00",
  },
  {
    categorySlug: "combos",
    name: "Combo Six",
    description: "Three family pizza standard range with a footlong garlic bread and choice of 1.25L drink.",
    price: "88.00",
  },
  {
    categorySlug: "combos",
    name: "Combo Five",
    description: "Three large pizza standard range with a footlong garlic bread and choice of 1.25L coca cola.",
    price: "78.00",
  },
  {
    categorySlug: "pizza",
    name: "Chicken Paradiso",
    description: "Tomato sauce, cheese, capsicum, crispy turkey, tomato, marinated chicken and garlic.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Hawaiian Pizza",
    description: "Tomato sauce, cheese, beef and pineapple.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "PEPPERONI",
    description: "Tomato sauce, cheese and loads of pepperoni.",
    price: "19.00",
    isPopular: true,
  },
  {
    categorySlug: "pizza",
    name: "Kassems Special",
    description: "BBQ sauce, cheese base, mushrooms, pepperoni, pineapple, olives and marinated chicken.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Marinara Pizza",
    description: "Tomato sauce, cheese, prawns, smoked mussels, crab, tomatoes and herbs.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Meat Lovers",
    description: "Tomato or BBQ sauce, cheese, beef, pepperoni and crispy turkey.",
    price: "19.00",
    isPopular: true,
  },
  {
    categorySlug: "pizza",
    name: "Portofino",
    description: "Tomato sauce, cheese, crispy turkey, mushroom and prawns.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Supreme",
    description: "Tomato sauce, cheese, beef, onion, mushroom, pepperoni, crispy turkey, capsicum, tomatoes, pineapple and olives.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "The CEDAR",
    description: "Lebanese style pizza with tomato sauce and cheese, fresh tomatoes, green capsicum, onions and marinated beef mince.",
    price: "28.00",
  },
  {
    categorySlug: "pizza",
    name: "All Cheese",
    description: "Parmesan, cheddar, mozzarella, bocconcini and fetta.",
    price: "19.00",
    isVegetarian: true,
  },
  {
    categorySlug: "pizza",
    name: "Vegetarian Pizza",
    description: "Tomato sauce, cheese, onion, mushroom, capsicum, tomato, pineapple, olives and herbs.",
    price: "19.00",
    isVegetarian: true,
  },
  {
    categorySlug: "pizza",
    name: "Aussie Pizza",
    description: "Tomato sauce, cheese, turkey bacon, and tomatoes.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Belmont Bomber",
    description: "Tomato sauce, cheese, crispy turkey, pepperoni, onion, mushroom, tomato and garlic.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Carlisle Cougar",
    description: "Tomato sauce, cheese, crispy turkey, pepperoni, tomato and olives.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Italian Pizza",
    description: "Tomato sauce, cheese, crispy turkey, tomatoes, olives, anchovies and garlic.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Margherita",
    description: "Tomato sauce, cheese, tomatoes and herbs.",
    price: "19.00",
    isVegetarian: true,
  },
  {
    categorySlug: "pizza",
    name: "Perth Demons",
    description: "Tomato sauce, cheese, beef onion, pepperoni, capsicum, tomato and jalapenos.",
    price: "19.00",
    isSpicy: true,
  },
  {
    categorySlug: "pizza",
    name: "Ronaldo",
    description: "Tomato sauce, cheese, mushroom, pepperoni, olives, and anchovies.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Sunrise",
    description: "BBQ sauce, cheese, mushroom, crispy turkey and egg.",
    price: "19.00",
  },
  {
    categorySlug: "pizza",
    name: "Tropicana",
    description: "Tomato sauce, cheese, pineapple and marinated chicken.",
    price: "19.00",
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Maharaja Pizza",
    description: "Tomato sauce, cheese, onion, mushroom, capsicum, tomatoes, olives and green chillies.",
    price: "19.00",
    isVegetarian: true,
    isSpicy: true,
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Supreme Pizza with Seafood",
    description: "Tomato sauce, cheese, beef, mushroom, onion, capsicum, crispy turkey, pepperoni, pineapple, tomato, olives, anchovies, smoked mussels, prawn and crab.",
    price: "19.00",
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Punjabi Pizza",
    description: "Mushroom, tomato, onion, capsicum, pineapple, olives, jalapenos and chicken.",
    price: "19.00",
    isSpicy: true,
  },
  {
    categorySlug: "vip-range-pizza",
    name: "The CEDAR",
    description: "Lebanese style pizza with tomato sauce and cheese, fresh tomatoes, green capsicum, onions and marinated beef mince.",
    price: "28.00",
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Zane's Zaatar (MANOUCH)",
    description: "Lebanese pizza pie filled with cheese and covered with zaatar (thyme).",
    price: "28.00",
    isVegetarian: true,
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Celine's Special Pizza",
    description: "Cherry tomatoes, bocconcini and basil.",
    price: "19.00",
    isVegetarian: true,
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Eagles Pizza",
    description: "Tomato sauce, cheese, marinated chicken, olives, sun dried tomatoes, roasted capsicum and artichokes.",
    price: "19.00",
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Godfather Pizza",
    description: "Tomato sauce, cheese, salami, roasted red capsicum, tomato, artichokes and olives.",
    price: "19.00",
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Vegetarian Pizza with Seafood (V)",
    description: "Tomato sauce, cheese, mushrooms, onions, tomatoes, capsicum, pineapple, olives, prawns, crab and mussels.",
    price: "19.00",
  },
  {
    categorySlug: "vip-range-pizza",
    name: "Vegemite pizza",
    description: "Vegemite and cheese pizza for a unique Australian twist, available in large size only.",
    price: "28.00",
    isVegetarian: true,
  },
  {
    categorySlug: "pasta",
    name: "Spaghetti Bolognese",
    description: "Cooked in beef and rich napolitana sauce.",
    price: "27.00",
  },
  {
    categorySlug: "pasta",
    name: "Penne Pollo",
    description: "Cream sauce with chicken and mushrooms.",
    price: "27.00",
  },
  {
    categorySlug: "pasta",
    name: "Beef Lasagna",
    description: "Home style beef lasagna.",
    price: "27.00",
  },
  {
    categorySlug: "pasta",
    name: "Vegetarian Lasagna",
    description: "Comes with complimentary side of garlic bread.",
    price: "25.00",
    isVegetarian: true,
  },
  {
    categorySlug: "pasta",
    name: "Ravioli Meat",
    description: "Beef mince in a Napoli sauce.",
    price: "27.00",
  },
  {
    categorySlug: "pasta",
    name: "Vegetarian Ravioli",
    description: "Filled with spinach and ricotta cheese in a Napoli sauce.",
    price: "27.00",
    isVegetarian: true,
  },
  {
    categorySlug: "pasta",
    name: "Gnocchi Napolitana",
    description: "Potato balls cooked in a Napoli sauce. Comes with complimentary side of garlic bread.",
    price: "25.00",
    isVegetarian: true,
  },
  {
    categorySlug: "pasta",
    name: "Spaghetti Carbonara",
    description: "Cream sauce with shredded turkey bacon and mushrooms.",
    price: "27.00",
  },
  {
    categorySlug: "pasta",
    name: "Spaghetti Marinara",
    description: "Seafood mix in a rich Napoli sauce.",
    price: "27.00",
  },
  {
    categorySlug: "pasta",
    name: "Penne Punjabi",
    description: "Cream sauce with mixed vegetables.",
    price: "27.00",
    isVegetarian: true,
  },
  {
    categorySlug: "pasta",
    name: "Fettuccine Carbonara",
    description: "Cream sauce with turkey bacon and mushrooms.",
    price: "27.00",
  },
  {
    categorySlug: "mayas-main-meals",
    name: "Parmigiana",
    description: "Crumbed chicken topped with napoli sauce and mozzarella cheese. Comes with choice of one side.",
    price: "28.00",
  },
  {
    categorySlug: "mayas-main-meals",
    name: "Gabriel's Wings",
    description: "Chicken wings with your choice of honey or hot and spicy. Comes with choice of one side.",
    price: "25.00",
  },
  {
    categorySlug: "salads",
    name: "Greek Salad",
    description: "Fresh mixed greens with cucumber, onions, capsicum, cherry tomatoes, feta cheese and Kalamata olives.",
    price: "18.00",
    isVegetarian: true,
  },
  {
    categorySlug: "salads",
    name: "Garden Salad",
    description: "Fresh mixed greens, a delightful and healthy option.",
    price: "15.00",
    isVegetarian: true,
  },
  {
    categorySlug: "salads",
    name: "Mediterranean Chicken Salad",
    description: "Grilled chicken mixed with Mediterranean flavours and fresh greens.",
    price: "18.00",
  },
  {
    categorySlug: "saras-sides",
    name: "Zane's Nachos",
    description: "Comes with sour cream.",
    price: "18.00",
    isVegetarian: true,
  },
  {
    categorySlug: "saras-sides",
    name: "Chips",
    description: "Healthy oven baked chips.",
    price: "8.00",
    isVegetarian: true,
  },
  {
    categorySlug: "saras-sides",
    name: "Wedges",
    description: "Crispy potato wedges served hot.",
    price: "12.00",
    isVegetarian: true,
  },
  {
    categorySlug: "saras-sides",
    name: "Rock's Cheesy Garlic Bread",
    description: "Footlong.",
    price: "8.50",
    isVegetarian: true,
  },
  {
    categorySlug: "saras-sides",
    name: "Garlic Bread",
    description: "Footlong.",
    price: "7.50",
    isVegetarian: true,
  },
  {
    categorySlug: "saras-sides",
    name: "Lilli's Nuggets",
    description: "Ten chicken nuggets oven baked.",
    price: "12.00",
  },
  {
    categorySlug: "merwans-sweet-temptations",
    name: "Chocolate Mud Cake Slice",
    description: "Rich, decadent chocolate cake slice.",
    price: "10.00",
    isVegetarian: true,
  },
  {
    categorySlug: "merwans-sweet-temptations",
    name: "Apple Slice",
    description: "Thinly sliced apple.",
    price: "10.00",
    isVegetarian: true,
  },
  {
    categorySlug: "merwans-sweet-temptations",
    name: "Cheesecake Slice",
    description: "Rich and creamy dessert with a velvety texture.",
    price: "10.00",
    isVegetarian: true,
  },
  {
    categorySlug: "merwans-sweet-temptations",
    name: "Chocolate Bars",
    description: "Variety of chocolate bars, subject to availability.",
    price: "3.50",
    isVegetarian: true,
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Pepsi",
    description: "600ml Pepsi Regular.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Pepsi Max",
    description: "600ml Pepsi Max.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Pepsi Max Vanilla",
    description: "600ml Pepsi Max Soda Shop Vanilla.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Solo",
    description: "600ml Solo Original.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Sunkist",
    description: "600ml Sunkist.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Lemonade",
    description: "600ml Schweppes Lemonade.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Passsiona",
    description: "600ml Passsiona.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "375ml Soft Drink",
    description: "375ml Soft Drinks.",
    price: "4.50",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "250ml Red Bull",
    description: "250 mL.",
    price: "5.80",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "355ml Red Bull",
    description: "355ml.",
    price: "6.80",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "1.25L Soft Drink Flavours",
    description: "1.25 L Soft Drink.",
    price: "7.00",
    isPopular: true,
  },
  {
    categorySlug: "daniellas-drinks",
    name: "1.1L Lemonade",
    description: "1.1 L.",
    price: "7.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "250ml Pop Top Apple",
    description: "250 mL.",
    price: "3.40",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "250ml Pop Top Orange",
    description: "250 mL.",
    price: "3.40",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "250ml Pop Top Apple Black Currant",
    description: "250 mL.",
    price: "3.40",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "500ml Lipton Mango",
    description: "500 mL.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "500ml Lipton Peach",
    description: "500 mL.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "500ml Lipton Lemon",
    description: "500 mL.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Gatorade Blue Bolt",
    description: "600 mL.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "600ml Gatorade Fierce Grape",
    description: "600 mL.",
    price: "6.00",
  },
  {
    categorySlug: "daniellas-drinks",
    name: "500ml Water",
    description: "500 mL bottled water.",
    price: "3.00",
  },
];

export function buildFallbackMenuCategories(): CategoryWithItems[] {
  const categories = MENU_CATEGORY_SEEDS.map((category, index) => ({
    id: index + 1,
    name: category.name,
    slug: category.slug,
    sortOrder: category.sortOrder,
    items: [] as MenuItem[],
  }));

  const categoryIdBySlug = new Map(categories.map((category) => [category.slug, category.id]));

  let nextItemId = 1;
  for (const item of MENU_ITEM_SEEDS) {
    const categoryId = categoryIdBySlug.get(item.categorySlug);
    const category = categories.find((entry) => entry.slug === item.categorySlug);
    if (!categoryId || !category) {
      continue;
    }

    category.items.push({
      id: nextItemId,
      categoryId,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: buildMenuImageUrl(item.name, item.categorySlug),
      isPopular: item.isPopular ?? false,
      isVegetarian: item.isVegetarian ?? false,
      isSpicy: item.isSpicy ?? false,
    });

    nextItemId += 1;
  }

  return categories.filter((category) => category.items.length > 0);
}
