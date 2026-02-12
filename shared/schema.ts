import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // stored as string
  imageUrl: text("image_url").notNull(),
  isPopular: boolean("is_popular").default(false),
  isVegetarian: boolean("is_vegetarian").default(false),
  isSpicy: boolean("is_spicy").default(false),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, preparing, ready, out_for_delivery, delivered
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  menuItemId: integer("menu_item_id").references(() => menuItems.id).notNull(),
  quantity: integer("quantity").notNull(),
  priceAtTime: decimal("price_at_time", { precision: 10, scale: 2 }).notNull(),
});

export const cateringInquiries = pgTable("catering_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  eventDate: timestamp("event_date").notNull(),
  guestCount: integer("guest_count").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true, totalAmount: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertCateringInquirySchema = createInsertSchema(cateringInquiries).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Category = typeof categories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type CateringInquiry = typeof cateringInquiries.$inferSelect;

export type InsertCateringInquiry = z.infer<typeof insertCateringInquirySchema>;

export const orderStatusSchema = z.enum([
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const kitchenOrderItemSchema = z.object({
  id: z.number(),
  menuItemId: z.number(),
  name: z.string(),
  quantity: z.number(),
  priceAtTime: z.coerce.number().nonnegative(),
  imageUrl: z.string().nullable().optional().default(null),
});

export const kitchenOrderSchema = z.object({
  id: z.number(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  status: orderStatusSchema,
  totalAmount: z.string(),
  createdAt: z.string().nullable(),
  items: z.array(kitchenOrderItemSchema),
});

export type KitchenOrder = z.infer<typeof kitchenOrderSchema>;
export type KitchenOrderItem = z.infer<typeof kitchenOrderItemSchema>;

// Request types
export const createOrderRequestSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  items: z.array(z.object({
    menuItemId: z.number(),
    quantity: z.number().min(1),
  })).min(1, "Order must have at least one item"),
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

// Response types
export type CategoryWithItems = Category & { items: MenuItem[] };
