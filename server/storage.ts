import { db } from "./db";
import {
  categories,
  menuItems,
  orders,
  orderItems,
  cateringInquiries,
  type CategoryWithItems,
  type CreateOrderRequest,
  type InsertCateringInquiry,
  type KitchenOrder,
  type OrderStatus,
  type Order,
  type CateringInquiry,
} from "@shared/schema";
import { and, eq } from "drizzle-orm";

function normalizeOrderStatus(status: string): OrderStatus {
  if (
    status === "accepted" ||
    status === "preparing" ||
    status === "ready" ||
    status === "out_for_delivery" ||
    status === "delivered"
  ) {
    return status;
  }
  return "pending";
}

function normalizeMenuName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

const MENU_CATEGORY_SEEDS = [
  { name: "Pizza", slug: "pizza", sortOrder: 1 },
  { name: "VIP Range Pizza", slug: "vip-range-pizza", sortOrder: 2 },
  { name: "Pasta", slug: "pasta", sortOrder: 3 },
  { name: "Mayas Main Meals", slug: "mayas-main-meals", sortOrder: 4 },
  { name: "SALADS", slug: "salads", sortOrder: 5 },
  { name: "Sara's Sides", slug: "saras-sides", sortOrder: 6 },
  { name: "Merwans Sweet Temptations", slug: "merwans-sweet-temptations", sortOrder: 7 },
  { name: "Daniella's Drinks", slug: "daniellas-drinks", sortOrder: 8 },
] as const;

type MenuCategorySlug = (typeof MENU_CATEGORY_SEEDS)[number]["slug"];

type MenuItemSeed = {
  categorySlug: MenuCategorySlug;
  name: string;
  description: string;
  price: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
};

function imageKeywordForCategory(categorySlug: MenuCategorySlug): string {
  if (categorySlug === "pizza" || categorySlug === "vip-range-pizza") return "pizza";
  if (categorySlug === "pasta") return "pasta";
  if (categorySlug === "mayas-main-meals") return "main meal";
  if (categorySlug === "salads") return "salad";
  if (categorySlug === "saras-sides") return "side dish";
  if (categorySlug === "merwans-sweet-temptations") return "dessert";
  return "drink";
}

function buildMenuImageUrl(itemName: string, categorySlug: MenuCategorySlug): string {
  const normalizedItemName = itemName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const hashKey = `${categorySlug}:${normalizedItemName}`;
  let hash = 0;
  for (let i = 0; i < hashKey.length; i += 1) {
    hash = (hash * 31 + hashKey.charCodeAt(i)) >>> 0;
  }
  const sig = (hash % 10000) + 1;

  const categoryHint = categorySlug.replace(/-/g, " ");
  const pizzaBoost =
    categorySlug === "pizza" || categorySlug === "vip-range-pizza"
      ? "wood fired, gourmet, close-up"
      : "";
  const query = `${normalizedItemName}, ${imageKeywordForCategory(categorySlug)}, ${categoryHint}, restaurant food, ${pizzaBoost}`;

  return `https://source.unsplash.com/900x675/?${encodeURIComponent(query)}&sig=${sig}`;
}

const MENU_ITEM_SEEDS: MenuItemSeed[] = [
  // Pizza
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

  // VIP Range Pizza
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

  // Pasta
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

  // Mayas Main Meals
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

  // SALADS
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

  // Sara's Sides
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

  // Merwans Sweet Temptations
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

  // Daniella's Drinks (as provided)
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
];

const ALLOWED_CATEGORY_SLUGS = new Set<string>(MENU_CATEGORY_SEEDS.map((seed) => seed.slug));

const ALLOWED_MENU_ITEM_NAMES_BY_SLUG = MENU_ITEM_SEEDS.reduce<Map<string, Set<string>>>((map, item) => {
  const names = map.get(item.categorySlug) ?? new Set<string>();
  names.add(normalizeMenuName(item.name));
  map.set(item.categorySlug, names);
  return map;
}, new Map<string, Set<string>>());

export interface IStorage {
  getCategoriesWithItems(): Promise<CategoryWithItems[]>;
  createOrder(order: CreateOrderRequest): Promise<Order>;
  getKitchenOrders(): Promise<KitchenOrder[]>;
  getCustomerOrders(email?: string, phone?: string): Promise<KitchenOrder[]>;
  updateOrderStatus(orderId: number, status: OrderStatus): Promise<KitchenOrder | null>;
  deleteDeliveredOrder(orderId: number): Promise<"deleted" | "not_found" | "not_delivered">;
  createCateringInquiry(inquiry: InsertCateringInquiry): Promise<CateringInquiry>;
  seedMenu(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCategoriesWithItems(): Promise<CategoryWithItems[]> {
    const allCategories = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
      with: {
        items: true,
      },
    });

    return allCategories
      .filter((category) => ALLOWED_CATEGORY_SLUGS.has(category.slug))
      .map((category) => {
        const allowedItemNames = ALLOWED_MENU_ITEM_NAMES_BY_SLUG.get(category.slug);
        if (!allowedItemNames) {
          return {
            ...category,
            items: [],
          };
        }

        return {
          ...category,
          items: category.items.filter((item) => allowedItemNames.has(normalizeMenuName(item.name))),
        };
      })
      .filter((category) => category.items.length > 0);
  }

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    let totalAmount = 0;
    const itemsWithPrices = [];

    for (const item of request.items) {
      const menuItem = await db.query.menuItems.findFirst({
        where: eq(menuItems.id, item.menuItemId),
      });
      if (menuItem) {
        totalAmount += Number(menuItem.price) * item.quantity;
        itemsWithPrices.push({ ...item, price: menuItem.price });
      }
    }

    const [newOrder] = await db.insert(orders).values({
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      totalAmount: totalAmount.toFixed(2),
      status: "pending",
    }).returning();

    for (const item of itemsWithPrices) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtTime: item.price,
      });
    }

    return newOrder;
  }

  async getKitchenOrders(): Promise<KitchenOrder[]> {
    const kitchenOrders = await db.query.orders.findMany({
      orderBy: (orders, { desc }) => [desc(orders.createdAt), desc(orders.id)],
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.id)],
          with: {
            menuItem: true,
          },
        },
      },
    });

    return kitchenOrders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      status: normalizeOrderStatus(order.status),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt ? order.createdAt.toISOString() : null,
      items: order.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem?.name ?? `Item #${item.menuItemId}`,
        quantity: item.quantity,
        priceAtTime: Number(item.priceAtTime),
        imageUrl: item.menuItem?.imageUrl ?? null,
      })),
    }));
  }

  async getCustomerOrders(email?: string, phone?: string): Promise<KitchenOrder[]> {
    const queryFilter = email && phone
      ? and(eq(orders.customerEmail, email), eq(orders.customerPhone, phone))
      : email
        ? eq(orders.customerEmail, email)
        : phone
          ? eq(orders.customerPhone, phone)
          : undefined;

    const customerOrders = await db.query.orders.findMany({
      where: queryFilter,
      orderBy: (orders, { desc }) => [desc(orders.createdAt), desc(orders.id)],
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.id)],
          with: {
            menuItem: true,
          },
        },
      },
    });

    return customerOrders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      status: normalizeOrderStatus(order.status),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt ? order.createdAt.toISOString() : null,
      items: order.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem?.name ?? `Item #${item.menuItemId}`,
        quantity: item.quantity,
        priceAtTime: Number(item.priceAtTime),
        imageUrl: item.menuItem?.imageUrl ?? null,
      })),
    }));
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<KitchenOrder | null> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, orderId)).returning();
    if (!updated) {
      return null;
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: {
          orderBy: (items, { asc }) => [asc(items.id)],
          with: {
            menuItem: true,
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    return {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      status: normalizeOrderStatus(order.status),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt ? order.createdAt.toISOString() : null,
      items: order.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.menuItem?.name ?? `Item #${item.menuItemId}`,
        quantity: item.quantity,
        priceAtTime: Number(item.priceAtTime),
        imageUrl: item.menuItem?.imageUrl ?? null,
      })),
    };
  }

  async deleteDeliveredOrder(orderId: number): Promise<"deleted" | "not_found" | "not_delivered"> {
    return db.transaction(async (tx) => {
      const [existingOrder] = await tx
        .select({
          id: orders.id,
          status: orders.status,
        })
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (!existingOrder) {
        return "not_found";
      }

      if (normalizeOrderStatus(existingOrder.status) !== "delivered") {
        return "not_delivered";
      }

      await tx.delete(orderItems).where(eq(orderItems.orderId, orderId));
      await tx.delete(orders).where(eq(orders.id, orderId));
      return "deleted";
    });
  }

  async createCateringInquiry(inquiry: InsertCateringInquiry): Promise<CateringInquiry> {
    const [newInquiry] = await db.insert(cateringInquiries).values(inquiry).returning();
    return newInquiry;
  }

  async seedMenu(): Promise<void> {
    const existingCategories = await db.select().from(categories);
    const categoryBySlug = new Map(existingCategories.map((category) => [category.slug, category]));

    for (const seed of MENU_CATEGORY_SEEDS) {
      const existingCategory = categoryBySlug.get(seed.slug);
      if (!existingCategory) {
        const [insertedCategory] = await db.insert(categories).values(seed).returning();
        if (insertedCategory) {
          categoryBySlug.set(seed.slug, insertedCategory);
        }
        continue;
      }

      if (existingCategory.name !== seed.name || existingCategory.sortOrder !== seed.sortOrder) {
        const [updatedCategory] = await db
          .update(categories)
          .set({
            name: seed.name,
            sortOrder: seed.sortOrder,
          })
          .where(eq(categories.id, existingCategory.id))
          .returning();

        if (updatedCategory) {
          categoryBySlug.set(seed.slug, updatedCategory);
        }
      }
    }

    const managedCategoryIds = new Set(
      MENU_CATEGORY_SEEDS
        .map((seed) => categoryBySlug.get(seed.slug)?.id)
        .filter((categoryId): categoryId is number => typeof categoryId === "number"),
    );

    const existingMenuRows = await db
      .select({
        id: menuItems.id,
        categoryId: menuItems.categoryId,
        name: menuItems.name,
      })
      .from(menuItems);

    const existingItemIdByKey = new Map<string, number>();
    for (const item of existingMenuRows) {
      if (!managedCategoryIds.has(item.categoryId)) {
        continue;
      }
      existingItemIdByKey.set(`${item.categoryId}:${normalizeMenuName(item.name)}`, item.id);
    }

    for (const { categorySlug, ...seed } of MENU_ITEM_SEEDS) {
      const category = categoryBySlug.get(categorySlug);
      if (!category) {
        continue;
      }

      const payload = {
        ...seed,
        imageUrl: buildMenuImageUrl(seed.name, categorySlug),
      };

      const key = `${category.id}:${normalizeMenuName(seed.name)}`;
      const existingItemId = existingItemIdByKey.get(key);

      if (existingItemId) {
        await db.update(menuItems).set(payload).where(eq(menuItems.id, existingItemId));
        continue;
      }

      const [insertedItem] = await db
        .insert(menuItems)
        .values({ categoryId: category.id, ...payload })
        .returning({ id: menuItems.id });

      if (insertedItem) {
        existingItemIdByKey.set(key, insertedItem.id);
      }
    }
  }
}

export const storage = new DatabaseStorage();
