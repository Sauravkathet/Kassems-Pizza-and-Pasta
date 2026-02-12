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
    return allCategories;
  }

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    // 1. Calculate total (in a real app, verify prices from DB)
    // For simplicity, we'll fetch items to get prices
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

    // 2. Create Order
    const [newOrder] = await db.insert(orders).values({
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      totalAmount: totalAmount.toFixed(2),
      status: "pending",
    }).returning();

    // 3. Create Order Items
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
    const existingCats = await db.select().from(categories);
    if (existingCats.length > 0) return;

    // Categories
    const cats = await db.insert(categories).values([
      { name: "Artisan Pizzas", slug: "pizzas", sortOrder: 1 },
      { name: "Handmade Pasta", slug: "pasta", sortOrder: 2 },
      { name: "Starters", slug: "starters", sortOrder: 3 },
      { name: "Desserts", slug: "desserts", sortOrder: 4 },
    ]).returning();

    // Items
    const pizzaCat = cats.find(c => c.slug === "pizzas")!;
    const pastaCat = cats.find(c => c.slug === "pasta")!;
    const starterCat = cats.find(c => c.slug === "starters")!;
    const dessertCat = cats.find(c => c.slug === "desserts")!;

    await db.insert(menuItems).values([
      // Pizzas
      {
        categoryId: pizzaCat.id,
        name: "Margherita di Bufala",
        description: "San Marzano tomato DOP, buffalo mozzarella, fresh basil, extra virgin olive oil.",
        price: "18.00",
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800",
        isPopular: true,
        isVegetarian: true,
      },
      {
        categoryId: pizzaCat.id,
        name: "Tartufo e Funghi",
        description: "Wild mushrooms, truffle cream, fior di latte, thyme, truffle oil.",
        price: "24.00",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
        isPopular: true,
        isVegetarian: true,
      },
      {
        categoryId: pizzaCat.id,
        name: "Diavola",
        description: "Spicy calabrian salami, tomato sauce, fior di latte, chili flakes, honey drizzle.",
        price: "22.00",
        imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800",
        isSpicy: true,
      },
      // Pasta
      {
        categoryId: pastaCat.id,
        name: "Cacio e Pepe",
        description: "Tonnarelli pasta, Pecorino Romano DOP, toasted black pepper.",
        price: "20.00",
        imageUrl: "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&q=80&w=800",
        isVegetarian: true,
      },
      {
        categoryId: pastaCat.id,
        name: "Pappardelle al Cinghiale",
        description: "Slow-cooked wild boar ragu, rosemary, parmesan reggiano.",
        price: "26.00",
        imageUrl: "https://images.unsplash.com/photo-1551183053-bf91b1dca038?auto=format&fit=crop&q=80&w=800",
        isPopular: true,
      },
      // Starters
      {
        categoryId: starterCat.id,
        name: "Burrata & Peach",
        description: "Creamy burrata, grilled peach, balsamic glaze, toasted hazelnuts.",
        price: "16.00",
        imageUrl: "https://images.unsplash.com/photo-1608651057406-38cb44f77436?auto=format&fit=crop&q=80&w=800",
        isVegetarian: true,
      },
      {
        categoryId: starterCat.id,
        name: "Arancini",
        description: "Crispy risotto balls, saffron, mozzarella, marinara dip.",
        price: "14.00",
        imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800",
        isVegetarian: true,
      },
      // Desserts
      {
        categoryId: dessertCat.id,
        name: "Classic Tiramisu",
        description: "Espresso soaked ladyfingers, mascarpone cream, cocoa dust.",
        price: "12.00",
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800",
        isPopular: true,
      },
    ]);
  }
}

export const storage = new DatabaseStorage();
