import { z } from 'zod';
import { 
  insertCateringInquirySchema, 
  createOrderRequestSchema, 
  kitchenOrderSchema,
  orderStatusSchema,
  menuItems, 
  categories,
  orders,
  cateringInquiries
} from './schema';

export type { CreateOrderRequest, InsertCateringInquiry } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  menu: {
    list: {
      method: 'GET' as const,
      path: '/api/menu' as const,
      responses: {
        200: z.array(z.custom<typeof categories.$inferSelect & { items: typeof menuItems.$inferSelect[] }>()),
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: createOrderRequestSchema,
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    kitchenList: {
      method: 'GET' as const,
      path: '/api/orders/kitchen' as const,
      responses: {
        200: z.array(kitchenOrderSchema),
      },
    },
    customerList: {
      method: 'GET' as const,
      path: '/api/orders/customer' as const,
      responses: {
        200: z.array(kitchenOrderSchema),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/orders/:id/status' as const,
      input: z.object({
        status: orderStatusSchema,
      }),
      responses: {
        200: kitchenOrderSchema,
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    deleteDelivered: {
      method: "DELETE" as const,
      path: "/api/orders/:id" as const,
      responses: {
        204: z.undefined(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  catering: {
    create: {
      method: 'POST' as const,
      path: '/api/catering' as const,
      input: insertCateringInquirySchema,
      responses: {
        201: z.custom<typeof cateringInquiries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function orderStatusPath(orderId: number) {
  return `/api/orders/${orderId}/status` as const;
}

export function orderPath(orderId: number) {
  return `/api/orders/${orderId}` as const;
}

export function customerOrdersPath(email?: string, phone?: string) {
  const params = new URLSearchParams();
  if (email) {
    params.set("email", email);
  }
  if (phone) {
    params.set("phone", phone);
  }
  const query = params.toString();
  return query ? (`/api/orders/customer?${query}` as const) : ("/api/orders/customer" as const);
}
