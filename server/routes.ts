import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
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
