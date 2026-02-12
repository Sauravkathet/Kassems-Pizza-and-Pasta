import { useCart } from "@/lib/cart-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createOrderRequestSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { saveCheckoutDraft } from "@/lib/checkout-session";

const checkoutCustomerSchema = createOrderRequestSchema.omit({ items: true });
type OrderFormValues = z.infer<typeof checkoutCustomerSchema>;

export default function Order() {
  const { items, cartTotal, updateQuantity, removeFromCart } = useCart();
  const [, setLocation] = useLocation();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(checkoutCustomerSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });

  const onSubmit = (data: OrderFormValues) => {
    if (items.length === 0) return;

    saveCheckoutDraft({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      items: items.map(item => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: Number(item.menuItem.price),
        quantity: item.quantity,
      })),
      subtotal: Number(cartTotal.toFixed(2)),
      tax: Number((cartTotal * 0.08).toFixed(2)),
      total: Number((cartTotal * 1.08).toFixed(2)),
      createdAt: new Date().toISOString(),
    });
    setLocation("/payment");
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-10 text-center">Checkout</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-border/50 max-w-2xl mx-auto">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/menu">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full">Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50">
                <h2 className="font-serif text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-6">
                  {items.map(({ menuItem, quantity }) => (
                    <div key={menuItem.id} className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={menuItem.imageUrl} alt={menuItem.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-bold text-foreground">{menuItem.name}</h4>
                          <span className="font-bold">${(Number(menuItem.price) * quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{menuItem.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-input rounded-md">
                            <button 
                              onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                              className="px-2 py-1 hover:bg-muted text-foreground/70"
                            >
                              -
                            </button>
                            <span className="px-2 text-sm font-medium">{quantity}</span>
                            <button 
                              onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                              className="px-2 py-1 hover:bg-muted text-foreground/70"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(menuItem.id)}
                            className="text-xs text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground mt-4 pt-4 border-t border-dashed">
                    <span>Total</span>
                    <span>${(cartTotal * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary/10">
                <h2 className="font-serif text-2xl font-bold mb-6">Contact Details</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    
                    <div className="grid md:grid-cols-2 gap-6">
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
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit"
                        className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                      >
                        {`Continue To Payment — $${(cartTotal * 1.08).toFixed(2)}`}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4">
                        Next step: choose payment method and complete payment securely.
                      </p>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
