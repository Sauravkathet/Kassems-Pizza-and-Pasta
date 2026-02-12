import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateOrder } from "@/hooks/use-orders";
import { useCart } from "@/lib/cart-context";
import { clearCheckoutDraft, loadCheckoutDraft } from "@/lib/checkout-session";
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
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";

const paymentSchema = z.object({
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
      paymentProvider: "stripe",
      cardHolder: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const onSubmit = () => {
    if (!draft) {
      setLocation("/order");
      return;
    }

    const isConfirmed = window.confirm(
      `Confirm order for ${draft.customerName} and charge $${draft.total.toFixed(2)}?`,
    );
    if (!isConfirmed) {
      return;
    }

    createOrder(
      {
        customerName: draft.customerName,
        customerEmail: draft.customerEmail,
        customerPhone: draft.customerPhone,
        items: draft.items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          const params = new URLSearchParams({
            email: draft.customerEmail,
            phone: draft.customerPhone,
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
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-lg mx-4">
          <h2 className="font-serif text-3xl font-bold mb-4 text-foreground">No checkout session</h2>
          <p className="text-muted-foreground mb-8">
            Start from checkout to continue with payment.
          </p>
          <Link href="/order">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-lg">
              Back To Checkout
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-10 text-center">Payment</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50">
              <h2 className="font-serif text-2xl font-bold mb-5">Order Total</h2>

              <div className="space-y-2 text-sm">
                {draft.items.map((item) => (
                  <div key={`${item.menuItemId}-${item.name}`} className="flex justify-between text-muted-foreground">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
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
            </div>

            <div className="bg-white p-5 rounded-2xl border border-border/50">
              <p className="text-sm text-muted-foreground">Billing Contact</p>
              <p className="font-semibold mt-1">{draft.customerName}</p>
              <p className="text-sm text-muted-foreground">{draft.customerEmail}</p>
              <p className="text-sm text-muted-foreground">{draft.customerPhone}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/10">
              <h2 className="font-serif text-2xl font-bold mb-6">Pay Securely</h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white"
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
