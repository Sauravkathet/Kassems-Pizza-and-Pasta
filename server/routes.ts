import crypto from "crypto";
import type { Express, NextFunction, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import {
  cateringInquiries,
  categories,
  menuItems,
  notices,
  noticePrioritySchema,
  orders,
} from "@shared/schema";
import { db, pool } from "./db";
import { and, desc, eq, gte, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { WebSocket, WebSocketServer } from "ws";

const customerOrderLookupSchema = z
  .object({
    email: z.string().email("Invalid email").optional(),
    phone: z.string().min(3, "Invalid phone").optional(),
  })
  .refine((value) => Boolean(value.email || value.phone), {
    message: "Email or phone is required",
    path: ["email"],
  });

const ADMIN_COOKIE_NAME = "ph_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? "replace-this-secret-before-production";
const ADMIN_COOKIE_SECURE = process.env.NODE_ENV === "production";

const adminLoginSchema = z.object({
  username: z.string().min(2, "Username is required").max(80),
  password: z.string().min(6, "Password is required").max(256),
});

const adminMenuItemCreateSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(4).max(1200),
  price: z.coerce.number().positive().max(9999),
  imageUrl: z.string().trim().min(1).max(8_000_000).optional(),
  isPopular: z.boolean().optional().default(false),
  isVegetarian: z.boolean().optional().default(false),
  isSpicy: z.boolean().optional().default(false),
});

const adminMenuItemUpdateSchema = z
  .object({
    categoryId: z.number().int().positive().optional(),
    name: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().min(4).max(1200).optional(),
    price: z.coerce.number().positive().max(9999).optional(),
    imageUrl: z.string().trim().min(1).max(8_000_000).optional(),
    isPopular: z.boolean().optional(),
    isVegetarian: z.boolean().optional(),
    isSpicy: z.boolean().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required",
  });

const adminNoticeCreateSchema = z.object({
  title: z.string().trim().min(3).max(140),
  body: z.string().trim().min(8).max(3000),
  priority: noticePrioritySchema.default("normal"),
  isActive: z.boolean().optional().default(true),
  publishedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  actionLabel: z.string().trim().max(80).nullable().optional(),
  actionUrl: z.string().trim().url().max(2048).nullable().optional(),
});

const adminNoticeUpdateSchema = z
  .object({
    title: z.string().trim().min(3).max(140).optional(),
    body: z.string().trim().min(8).max(3000).optional(),
    priority: noticePrioritySchema.optional(),
    isActive: z.boolean().optional(),
    publishedAt: z.string().datetime().optional(),
    expiresAt: z.string().datetime().nullable().optional(),
    actionLabel: z.string().trim().max(80).nullable().optional(),
    actionUrl: z.string().trim().url().max(2048).nullable().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required",
  });

type AdminSessionPayload = {
  username: string;
  expiresAt: number;
};

function parseCookies(headerValue?: string): Record<string, string> {
  if (!headerValue) {
    return {};
  }

  return headerValue
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex <= 0) {
        return acc;
      }
      const key = decodeURIComponent(part.slice(0, separatorIndex).trim());
      const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
      acc[key] = value;
      return acc;
    }, {});
}

function constantTimeEquals(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signAdminSession(payloadEncoded: string): string {
  return crypto
    .createHmac("sha256", ADMIN_SESSION_SECRET)
    .update(payloadEncoded)
    .digest("base64url");
}

function createAdminSessionToken(username: string): string {
  const payload: AdminSessionPayload = {
    username,
    expiresAt: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  };
  const payloadEncoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = signAdminSession(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

function verifyAdminSessionToken(token: string | undefined): AdminSessionPayload | null {
  if (!token) {
    return null;
  }

  const [payloadEncoded, signature] = token.split(".");
  if (!payloadEncoded || !signature) {
    return null;
  }

  const expectedSignature = signAdminSession(payloadEncoded);
  if (!constantTimeEquals(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadEncoded, "base64url").toString("utf8")) as AdminSessionPayload;
    if (
      typeof payload.username !== "string" ||
      payload.username.length === 0 ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function setAdminSessionCookie(res: Response, token: string): void {
  const attributes = [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${ADMIN_SESSION_TTL_SECONDS}`,
  ];

  if (ADMIN_COOKIE_SECURE) {
    attributes.push("Secure");
  }

  res.setHeader("Set-Cookie", attributes.join("; "));
}

function clearAdminSessionCookie(res: Response): void {
  const attributes = [
    `${ADMIN_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];

  if (ADMIN_COOKIE_SECURE) {
    attributes.push("Secure");
  }

  res.setHeader("Set-Cookie", attributes.join("; "));
}

function getAdminSessionFromRequest(req: Request): AdminSessionPayload | null {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[ADMIN_COOKIE_NAME];
  return verifyAdminSessionToken(token);
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const session = getAdminSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
}

function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function ensureAdminTables(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notices (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      published_at TIMESTAMP NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMP NULL,
      action_label TEXT NULL,
      action_url TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

async function buildDashboardSummary() {
  const [
    [menuItemCountResult],
    [categoryCountResult],
    [orderCountResult],
    [activeNoticeCountResult],
    [cateringCountResult],
    recentOrders,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(menuItems),
    db.select({ count: sql<number>`count(*)::int` }).from(categories),
    db.select({ count: sql<number>`count(*)::int` }).from(orders),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(notices)
      .where(and(eq(notices.isActive, true), or(isNull(notices.expiresAt), gte(notices.expiresAt, new Date())))),
    db.select({ count: sql<number>`count(*)::int` }).from(cateringInquiries),
    storage.getKitchenOrders(),
  ]);

  return {
    counts: {
      menuItems: menuItemCountResult?.count ?? 0,
      categories: categoryCountResult?.count ?? 0,
      orders: orderCountResult?.count ?? 0,
      activeNotices: activeNoticeCountResult?.count ?? 0,
      cateringInquiries: cateringCountResult?.count ?? 0,
    },
    recentOrders: recentOrders.slice(0, 8),
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const kitchenSocketServer = new WebSocketServer({
    noServer: true,
  });

  httpServer.on("upgrade", (request, socket, head) => {
    let pathname = "";
    try {
      pathname = new URL(request.url ?? "", "http://localhost").pathname;
    } catch {
      socket.destroy();
      return;
    }

    if (pathname !== "/ws/kitchen") {
      return;
    }

    kitchenSocketServer.handleUpgrade(request, socket, head, (ws) => {
      kitchenSocketServer.emit("connection", ws, request);
    });
  });

  const publishKitchenOrders = async (socket?: WebSocket) => {
    const kitchenOrders = await storage.getKitchenOrders();
    const payload = JSON.stringify({
      type: "kitchen:orders",
      data: kitchenOrders,
    });

    if (socket) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
      }
      return;
    }

    kitchenSocketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  };

  kitchenSocketServer.on("connection", (socket) => {
    void publishKitchenOrders(socket).catch((error) => {
      console.error("Failed to publish kitchen orders to socket:", error);
    });
  });

  // Initialize seed data
  await storage.seedMenu();
  await ensureAdminTables();

  // Public Notice Routes
  app.get("/api/notices", async (_req, res) => {
    const activeNotices = await db
      .select()
      .from(notices)
      .where(and(eq(notices.isActive, true), or(isNull(notices.expiresAt), gte(notices.expiresAt, new Date()))))
      .orderBy(
        sql`CASE ${notices.priority}
              WHEN 'high' THEN 3
              WHEN 'normal' THEN 2
              ELSE 1
            END DESC`,
        desc(notices.publishedAt),
        desc(notices.id),
      );

    res.status(200).json(activeNotices);
  });

  // Admin Auth
  app.post("/api/admin/login", async (req, res) => {
    try {
      const input = adminLoginSchema.parse(req.body);
      const usernameMatches = constantTimeEquals(input.username, ADMIN_USERNAME);
      const passwordMatches = constantTimeEquals(input.password, ADMIN_PASSWORD);

      if (!usernameMatches || !passwordMatches) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }

      const token = createAdminSessionToken(input.username);
      setAdminSessionCookie(res, token);

      return res.status(200).json({
        username: input.username,
        expiresInSeconds: ADMIN_SESSION_TTL_SECONDS,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.post("/api/admin/logout", (_req, res) => {
    clearAdminSessionCookie(res);
    res.status(204).send();
  });

  app.get("/api/admin/session", (req, res) => {
    const session = getAdminSessionFromRequest(req);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      username: session.username,
      expiresAt: new Date(session.expiresAt).toISOString(),
    });
  });

  // Admin Routes
  app.get("/api/admin/dashboard", requireAdminAuth, async (_req, res) => {
    const summary = await buildDashboardSummary();
    res.status(200).json(summary);
  });

  app.get("/api/admin/menu", requireAdminAuth, async (_req, res) => {
    const menu = await storage.getCategoriesWithItems();
    res.status(200).json(menu);
  });

  app.get("/api/admin/categories", requireAdminAuth, async (_req, res) => {
    const categoryRows = await db
      .select()
      .from(categories)
      .orderBy(categories.sortOrder, categories.id);
    res.status(200).json(categoryRows);
  });

  app.post("/api/admin/menu-items", requireAdminAuth, async (req, res) => {
    try {
      const input = adminMenuItemCreateSchema.parse(req.body);
      const category = await db.query.categories.findFirst({
        where: eq(categories.id, input.categoryId),
      });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const [createdItem] = await db
        .insert(menuItems)
        .values({
          categoryId: input.categoryId,
          name: input.name,
          description: input.description,
          price: input.price.toFixed(2),
          imageUrl: normalizeOptionalText(input.imageUrl) ?? "logo.png",
          isPopular: input.isPopular ?? false,
          isVegetarian: input.isVegetarian ?? false,
          isSpicy: input.isSpicy ?? false,
        })
        .returning();

      return res.status(201).json(createdItem);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.patch("/api/admin/menu-items/:id", requireAdminAuth, async (req, res) => {
    try {
      const menuItemId = Number(req.params.id);
      if (!Number.isInteger(menuItemId) || menuItemId <= 0) {
        return res.status(400).json({ message: "Invalid menu item id", field: "id" });
      }

      const input = adminMenuItemUpdateSchema.parse(req.body);
      if (typeof input.categoryId === "number") {
        const category = await db.query.categories.findFirst({
          where: eq(categories.id, input.categoryId),
        });
        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }
      }

      const payload: Record<string, unknown> = {};
      if (typeof input.categoryId === "number") payload.categoryId = input.categoryId;
      if (typeof input.name === "string") payload.name = input.name;
      if (typeof input.description === "string") payload.description = input.description;
      if (typeof input.price === "number") payload.price = input.price.toFixed(2);
      if (typeof input.imageUrl === "string") payload.imageUrl = normalizeOptionalText(input.imageUrl) ?? "logo.png";
      if (typeof input.isPopular === "boolean") payload.isPopular = input.isPopular;
      if (typeof input.isVegetarian === "boolean") payload.isVegetarian = input.isVegetarian;
      if (typeof input.isSpicy === "boolean") payload.isSpicy = input.isSpicy;

      const [updatedItem] = await db
        .update(menuItems)
        .set(payload)
        .where(eq(menuItems.id, menuItemId))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      return res.status(200).json(updatedItem);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.get("/api/admin/notices", requireAdminAuth, async (_req, res) => {
    const rows = await db.select().from(notices).orderBy(desc(notices.createdAt), desc(notices.id));
    res.status(200).json(rows);
  });

  app.post("/api/admin/notices", requireAdminAuth, async (req, res) => {
    try {
      const input = adminNoticeCreateSchema.parse(req.body);

      const [createdNotice] = await db
        .insert(notices)
        .values({
          title: input.title,
          body: input.body,
          priority: input.priority,
          isActive: input.isActive ?? true,
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
          actionLabel: normalizeOptionalText(input.actionLabel),
          actionUrl: normalizeOptionalText(input.actionUrl),
          updatedAt: new Date(),
        })
        .returning();

      return res.status(201).json(createdNotice);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.patch("/api/admin/notices/:id", requireAdminAuth, async (req, res) => {
    try {
      const noticeId = Number(req.params.id);
      if (!Number.isInteger(noticeId) || noticeId <= 0) {
        return res.status(400).json({ message: "Invalid notice id", field: "id" });
      }

      const input = adminNoticeUpdateSchema.parse(req.body);
      const payload: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (typeof input.title === "string") payload.title = input.title;
      if (typeof input.body === "string") payload.body = input.body;
      if (typeof input.priority === "string") payload.priority = input.priority;
      if (typeof input.isActive === "boolean") payload.isActive = input.isActive;
      if (typeof input.publishedAt === "string") payload.publishedAt = new Date(input.publishedAt);
      if (input.expiresAt !== undefined) payload.expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
      if (input.actionLabel !== undefined) payload.actionLabel = normalizeOptionalText(input.actionLabel);
      if (input.actionUrl !== undefined) payload.actionUrl = normalizeOptionalText(input.actionUrl);

      const [updatedNotice] = await db
        .update(notices)
        .set(payload)
        .where(eq(notices.id, noticeId))
        .returning();

      if (!updatedNotice) {
        return res.status(404).json({ message: "Notice not found" });
      }

      return res.status(200).json(updatedNotice);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.delete("/api/admin/notices/:id", requireAdminAuth, async (req, res) => {
    const noticeId = Number(req.params.id);
    if (!Number.isInteger(noticeId) || noticeId <= 0) {
      return res.status(400).json({ message: "Invalid notice id", field: "id" });
    }

    const [deletedNotice] = await db
      .delete(notices)
      .where(eq(notices.id, noticeId))
      .returning({ id: notices.id });

    if (!deletedNotice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(204).send();
  });

  app.get("/api/admin/orders", requireAdminAuth, async (_req, res) => {
    const kitchenOrders = await storage.getKitchenOrders();
    res.status(200).json(kitchenOrders);
  });

  app.patch("/api/admin/orders/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ message: "Invalid order id", field: "id" });
      }

      const input = api.orders.updateStatus.input.parse(req.body);
      const updatedOrder = await storage.updateOrderStatus(orderId, input.status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(updatedOrder);
      void publishKitchenOrders().catch((error) => {
        console.error("Failed to publish kitchen orders after admin status update:", error);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.delete("/api/admin/orders/:id", requireAdminAuth, async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ message: "Invalid order id", field: "id" });
      }

      const deletionResult = await storage.deleteDeliveredOrder(orderId);
      if (deletionResult === "not_found") {
        return res.status(404).json({ message: "Order not found" });
      }

      if (deletionResult === "not_delivered") {
        return res.status(400).json({
          message: "Only delivered orders can be deleted",
          field: "status",
        });
      }

      res.status(204).send();
      void publishKitchenOrders().catch((error) => {
        console.error("Failed to publish kitchen orders after admin delete:", error);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.get("/api/admin/catering", requireAdminAuth, async (_req, res) => {
    const rows = await db
      .select()
      .from(cateringInquiries)
      .orderBy(desc(cateringInquiries.createdAt), desc(cateringInquiries.id))
      .limit(50);

    res.status(200).json(rows);
  });

  // Menu Routes
  app.get(api.menu.list.path, async (_req, res) => {
    const menu = await storage.getCategoriesWithItems();
    res.json(menu);
  });

  // Order Routes
  app.post(api.orders.create.path, async (req, res) => {
    try {
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(input);
      res.status(201).json(order);
      void publishKitchenOrders().catch((error) => {
        console.error("Failed to publish kitchen orders after create:", error);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.orders.kitchenList.path, async (_req, res) => {
    const kitchenOrders = await storage.getKitchenOrders();
    res.json(kitchenOrders);
  });

  app.get(api.orders.customerList.path, async (req, res) => {
    try {
      const emailQuery = Array.isArray(req.query.email) ? req.query.email[0] : req.query.email;
      const phoneQuery = Array.isArray(req.query.phone) ? req.query.phone[0] : req.query.phone;

      const lookup = customerOrderLookupSchema.parse({
        email: typeof emailQuery === "string" && emailQuery.trim().length > 0 ? emailQuery.trim() : undefined,
        phone: typeof phoneQuery === "string" && phoneQuery.trim().length > 0 ? phoneQuery.trim() : undefined,
      });

      const customerOrders = await storage.getCustomerOrders(lookup.email, lookup.phone);
      res.status(200).json(customerOrders);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ message: "Invalid order id", field: "id" });
      }

      const input = api.orders.updateStatus.input.parse(req.body);
      const updatedOrder = await storage.updateOrderStatus(orderId, input.status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json(updatedOrder);
      void publishKitchenOrders().catch((error) => {
        console.error("Failed to publish kitchen orders after status update:", error);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.delete(api.orders.deleteDelivered.path, async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      if (!Number.isInteger(orderId) || orderId <= 0) {
        return res.status(400).json({ message: "Invalid order id", field: "id" });
      }

      const deletionResult = await storage.deleteDeliveredOrder(orderId);
      if (deletionResult === "not_found") {
        return res.status(404).json({ message: "Order not found" });
      }

      if (deletionResult === "not_delivered") {
        return res.status(400).json({
          message: "Only delivered orders can be deleted",
          field: "status",
        });
      }

      res.status(204).send();
      void publishKitchenOrders().catch((error) => {
        console.error("Failed to publish kitchen orders after delete:", error);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // Catering Routes
  app.post(api.catering.create.path, async (req, res) => {
    try {
      const input = api.catering.create.input.parse({
        ...req.body,
        eventDate: req.body.eventDate ? new Date(req.body.eventDate) : undefined,
      });
      const inquiry = await storage.createCateringInquiry(input);
      res.status(201).json(inquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
