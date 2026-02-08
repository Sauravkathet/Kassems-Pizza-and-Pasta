import { z } from 'zod';
import { 
  insertCateringInquirySchema, 
  createOrderRequestSchema, 
  menuItems, 
  categories,
  orders,
  cateringInquiries
} from './schema';

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
