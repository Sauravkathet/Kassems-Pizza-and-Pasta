import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateOrder } from "@/hooks/use-orders";
import { useCart } from "@/lib/cart-context";
import { clearCheckoutDraft, loadCheckoutDraft, saveCheckoutDraft } from "@/lib/checkout-session";
import { fallbackImageByName, resolveItemImage } from "@/lib/item-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CreditCard, Loader2, ShieldCheck, Store, Truck } from "lucide-react";

const paymentSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  fulfillmentType: z.enum(["pickup", "delivery"]),
  deliveryAddress: z.string().optional(),
  paymentProvider: z.enum(["stripe", "square"]),
  cardHolder: z.string().min(2, "Cardholder name is required"),
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number is too long")
    .regex(/^[0-9 ]+$/, "Use digits only"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Use MM/YY format"),
  cvv: z
    .string()
    .regex(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
}).superRefine((value, ctx) => {
  if (value.fulfillmentType === "delivery" && !value.deliveryAddress?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["deliveryAddress"],
      message: "Delivery address is required",
    });
  }
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function Payment() {
  const [, setLocation] = useLocation();
  const draft = useMemo(() => loadCheckoutDraft(), []);
  const { clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customerName: draft?.customerName ?? "",
      customerEmail: draft?.customerEmail ?? "",
      customerPhone: draft?.customerPhone ?? "",
      fulfillmentType: draft?.fulfillmentType ?? "pickup",
      deliveryAddress: draft?.deliveryAddress ?? "",
      paymentProvider: "stripe",
      cardHolder: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });
  const fulfillmentType = form.watch("fulfillmentType");
  const deliveryAddress = form.watch("deliveryAddress");

  const onSubmit = (values: PaymentFormValues) => {
    if (!draft) {
      setLocation("/order");
      return;
    }

    const normalizedDeliveryAddress =
      values.fulfillmentType === "delivery" ? values.deliveryAddress?.trim() : undefined;

    saveCheckoutDraft({
      ...draft,
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      customerPhone: values.customerPhone,
      fulfillmentType: values.fulfillmentType,
      deliveryAddress: normalizedDeliveryAddress,
    });

    const isConfirmed = window.confirm(
      `Confirm ${values.fulfillmentType} order for ${values.customerName} and charge $${draft.total.toFixed(2)}?`,
    );
    if (!isConfirmed) {
      return;
    }

    createOrder(
      {
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        items: draft.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          const params = new URLSearchParams({
            email: values.customerEmail,
            phone: values.customerPhone,
          });
          clearCheckoutDraft();
          clearCart();
          window.scrollTo(0, 0);
          setLocation(`/track-order?${params.toString()}`);
        },
      },
    );
  };

  if (!draft) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
        <div className="bg-card p-8 rounded-2xl shadow-xl text-center max-w-lg mx-4 border border-border/60">
          <h2 className="font-serif text-3xl font-bold mb-4 text-foreground">No checkout session</h2>
          <p className="text-muted-foreground mb-8">
            Start from checkout to continue with payment.
          </p>
          <Link href="/order">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg">
              Back To Checkout
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/35 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-10 text-center">Payment</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/60">
              <h2 className="font-serif text-2xl font-bold mb-5">Order Total</h2>

              <div className="space-y-3">
                {draft.items.map((item, index) => {
                  const unitPrice = Number(item.price);
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={`${item.menuItemId}-${item.name}-${index}`}
                      className="rounded-xl border border-border/60 bg-background/70 p-3"
                    >
                      <div className="flex gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted">
                          <img
                            src={resolveItemImage(item.name, item.imageUrl)}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = fallbackImageByName(item.name);
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-foreground">{item.name}</p>
                              {item.customizationSummary && (
                                <p className="mt-0.5 text-xs text-muted-foreground">{item.customizationSummary}</p>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-foreground">${lineTotal.toFixed(2)}</p>
                          </div>

                          {item.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                          )}

                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Qty {item.quantity}</span>
                            <span>${unitPrice.toFixed(2)} each</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-dashed pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${draft.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>${draft.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-foreground mt-3">
                  <span>Total</span>
                  <span>${draft.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border/60 bg-background/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fulfillment</p>
                <p className="mt-1 text-sm font-medium text-foreground capitalize">
                  {fulfillmentType === "delivery" ? "Delivery" : "Pickup"}
                </p>
                {fulfillmentType === "delivery" && deliveryAddress?.trim() && (
                  <p className="mt-1 text-xs text-muted-foreground">{deliveryAddress.trim()}</p>
                )}
              </div>
            </div>

          </div>

          <div className="space-y-6">
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-primary/15">
              <h2 className="font-serif text-2xl font-bold mb-6">Pay Securely</h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fulfillmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Type</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => field.onChange("pickup")}
                              className={cn(
                                "flex h-12 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors",
                                field.value === "pickup"
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-input bg-background text-foreground hover:border-primary/40",
                              )}
                            >
                              <Store className="h-4 w-4" />
                              Pickup
                            </button>
                            <button
                              type="button"
                              onClick={() => field.onChange("delivery")}
                              className={cn(
                                "flex h-12 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors",
                                field.value === "delivery"
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-input bg-background text-foreground hover:border-primary/40",
                              )}
                            >
                              <Truck className="h-4 w-4" />
                              Delivery
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {fulfillmentType === "delivery" && (
                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full delivery address" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="paymentProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
                          >
                            <option value="stripe">Stripe</option>
                            <option value="square">Square</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardHolder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input
                            inputMode="numeric"
                            placeholder="4242 4242 4242 4242"
                            className="h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input inputMode="numeric" placeholder="123" className="h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isPending ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <CreditCard className="w-5 h-5" /> Confirm Order & Pay ${draft.total.toFixed(2)}
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground mt-4 inline-flex items-center gap-1.5 w-full justify-center">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Demo secure payment flow for MVP. Replace with Stripe/Square SDK in production.
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
