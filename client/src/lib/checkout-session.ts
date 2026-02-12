import { z } from "zod";

const CHECKOUT_DRAFT_KEY = "checkout_draft_v1";

const checkoutDraftSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  items: z.array(
    z.object({
      menuItemId: z.number().int().positive(),
      name: z.string(),
      price: z.coerce.number().nonnegative(),
      quantity: z.number().int().positive(),
    }),
  ).min(1),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().nonnegative(),
  createdAt: z.string(),
});

export type CheckoutDraft = z.infer<typeof checkoutDraftSchema>;

export function saveCheckoutDraft(draft: CheckoutDraft) {
  sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
}

export function loadCheckoutDraft(): CheckoutDraft | null {
  const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
  if (!raw) return null;

  try {
    return checkoutDraftSchema.parse(JSON.parse(raw));
  } catch {
    sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    return null;
  }
}

export function clearCheckoutDraft() {
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
}
