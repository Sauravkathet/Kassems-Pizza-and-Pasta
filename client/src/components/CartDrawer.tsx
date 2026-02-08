import { useCart } from "@/lib/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setIsOpen(false);
    setLocation("/order");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md bg-background flex flex-col h-full border-l-border/50">
        <SheetHeader className="space-y-4 pb-4 border-b border-border/40">
          <SheetTitle className="font-serif text-2xl text-primary">Your Basket</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your basket is empty." : `${items.length} items selected`}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-4">
              <ShoppingBagIcon className="w-12 h-12 opacity-20" />
              <p>Looks like you haven't added anything yet.</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Continue Browsing</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(({ menuItem, quantity }) => (
                <div key={menuItem.id} className="flex gap-4">
                  <div className="h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <img 
                      src={menuItem.imageUrl} 
                      alt={menuItem.name} 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{menuItem.name}</h4>
                      <p className="text-sm text-primary font-semibold">${menuItem.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-muted/30 rounded-full px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                          className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-background transition-colors text-foreground/70"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                        <button 
                          onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                          className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-background transition-colors text-foreground/70"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(menuItem.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="pt-6 border-t border-border/40 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax (8%)</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-serif text-lg font-bold text-foreground">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-medium shadow-lg shadow-primary/20"
              onClick={handleCheckout}
            >
              Checkout Now
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ShoppingBagIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      {...props}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
