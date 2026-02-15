import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useMenu } from "@/hooks/use-menu";
import { useCart, type ItemCustomizations } from "@/lib/cart-context";
import { loadCheckoutDraft, saveCheckoutDraft } from "@/lib/checkout-session";
import { fallbackImageByName, resolveItemImage } from "@/lib/item-image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";

type SizeOption = {
  id: string;
  label: string;
  priceDelta: number;
};

type AddOnOption = {
  id: string;
  label: string;
  priceDelta: number;
};

type EditingState = {
  lineItemId: string;
  selectedSizeId: string;
  selectedAddOnIds: string[];
};

const TAX_RATE = 0.08;

const PIZZA_SIZE_OPTIONS: SizeOption[] = [
  { id: "size-small", label: '9" Small (Six Pieces)', priceDelta: 0 },
  { id: "size-large", label: '13" Large (Eight Pieces)', priceDelta: 7 },
  { id: "size-gluten-free", label: '11" Gluten Free Base', priceDelta: 11 },
  { id: "size-family", label: '15" Family (Twelve Pieces)', priceDelta: 12 },
];

const PIZZA_ADD_ON_OPTIONS: AddOnOption[] = [
  { id: "addon-bbq-sauce", label: "BBQ Sauce", priceDelta: 1 },
  { id: "addon-egg", label: "Egg", priceDelta: 2 },
  { id: "addon-vegan-cheese", label: "Vegan Cheese (VG)", priceDelta: 2 },
];

function parsePrice(value: string | number): number {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCustomizationSummary(customizations?: ItemCustomizations) {
  if (!customizations) return null;

  const parts: string[] = [];
  if (customizations.size) parts.push(customizations.size);
  if (customizations.toppings && customizations.toppings.length > 0) {
    parts.push(customizations.toppings.join(", "));
  }

  return parts.length > 0 ? parts.join(" | ") : null;
}

function isPizzaCategory(categoryName: string): boolean {
  return /pizza/i.test(categoryName);
}

function getSizeDelta(sizeLabel?: string): number {
  if (!sizeLabel) return 0;
  return PIZZA_SIZE_OPTIONS.find((option) => option.label === sizeLabel)?.priceDelta ?? 0;
}

function getAddOnDelta(addOns?: string[]): number {
  if (!addOns || addOns.length === 0) return 0;
  return addOns.reduce((sum, addOnLabel) => {
    const match = PIZZA_ADD_ON_OPTIONS.find((option) => option.label === addOnLabel);
    return sum + (match?.priceDelta ?? 0);
  }, 0);
}

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, customizeCartItem, cartTotal } = useCart();
  const { data: categories } = useMenu();
  const [, setLocation] = useLocation();

  const [editing, setEditing] = useState<EditingState | null>(null);

  const pizzaItemIds = useMemo(() => {
    if (!categories) return new Set<number>();

    return new Set(
      categories
        .filter((category) => isPizzaCategory(category.name))
        .flatMap((category) => category.items.map((item) => item.id)),
    );
  }, [categories]);

  const subtotal = Number(cartTotal.toFixed(2));
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const editingItem = useMemo(
    () => (editing ? items.find((item) => item.lineItemId === editing.lineItemId) : null),
    [editing, items],
  );

  const previewUnitPrice = useMemo(() => {
    if (!editing || !editingItem) return null;

    const selectedSize = PIZZA_SIZE_OPTIONS.find((option) => option.id === editing.selectedSizeId);
    if (!selectedSize) return null;

    const selectedAddOns = PIZZA_ADD_ON_OPTIONS.filter((option) =>
      editing.selectedAddOnIds.includes(option.id),
    );

    const currentUnitPrice = parsePrice(editingItem.menuItem.price);
    const existingSizeDelta = getSizeDelta(editingItem.customizations?.size);
    const existingAddOnDelta = getAddOnDelta(editingItem.customizations?.toppings);
    const basePrice = currentUnitPrice - existingSizeDelta - existingAddOnDelta;
    const nextPrice =
      basePrice + selectedSize.priceDelta + selectedAddOns.reduce((sum, option) => sum + option.priceDelta, 0);

    return Number(Math.max(0, nextPrice).toFixed(2));
  }, [editing, editingItem]);

  useEffect(() => {
    if (!editing) return;
    const stillExists = items.some((item) => item.lineItemId === editing.lineItemId);
    if (!stillExists) setEditing(null);
  }, [editing, items]);

  const openCustomize = (lineItemId: string, customizations?: ItemCustomizations) => {
    const selectedSizeId =
      PIZZA_SIZE_OPTIONS.find((option) => option.label === customizations?.size)?.id ?? "size-small";
    const selectedAddOnIds = PIZZA_ADD_ON_OPTIONS.filter((option) =>
      (customizations?.toppings ?? []).includes(option.label),
    ).map((option) => option.id);

    setEditing({ lineItemId, selectedSizeId, selectedAddOnIds });
  };

  const handleToggleAddOn = (addOnId: string) => {
    setEditing((current) => {
      if (!current) return current;

      const alreadySelected = current.selectedAddOnIds.includes(addOnId);
      if (alreadySelected) {
        return {
          ...current,
          selectedAddOnIds: current.selectedAddOnIds.filter((id) => id !== addOnId),
        };
      }

      if (current.selectedAddOnIds.length >= 3) {
        return current;
      }

      return {
        ...current,
        selectedAddOnIds: [...current.selectedAddOnIds, addOnId],
      };
    });
  };

  const applyCustomization = () => {
    if (!editing || !editingItem) return;

    const selectedSize = PIZZA_SIZE_OPTIONS.find((option) => option.id === editing.selectedSizeId);
    if (!selectedSize) return;

    const selectedAddOns = PIZZA_ADD_ON_OPTIONS.filter((option) =>
      editing.selectedAddOnIds.includes(option.id),
    );

    const nextCustomizations: ItemCustomizations = {
      ...editingItem.customizations,
      size: selectedSize.label,
      toppings: selectedAddOns.length > 0 ? selectedAddOns.map((option) => option.label) : undefined,
    };

    const currentUnitPrice = parsePrice(editingItem.menuItem.price);
    const existingSizeDelta = getSizeDelta(editingItem.customizations?.size);
    const existingAddOnDelta = getAddOnDelta(editingItem.customizations?.toppings);
    const basePrice = currentUnitPrice - existingSizeDelta - existingAddOnDelta;
    const nextUnitPrice =
      basePrice + selectedSize.priceDelta + selectedAddOns.reduce((sum, option) => sum + option.priceDelta, 0);

    customizeCartItem(
      editingItem.lineItemId,
      {
        ...editingItem.menuItem,
        price: Math.max(0, nextUnitPrice).toFixed(2),
      },
      nextCustomizations,
    );

    setEditing(null);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }

    const previousDraft = loadCheckoutDraft();

    saveCheckoutDraft({
      customerName: previousDraft?.customerName,
      customerEmail: previousDraft?.customerEmail,
      customerPhone: previousDraft?.customerPhone,
      fulfillmentType: previousDraft?.fulfillmentType ?? "pickup",
      deliveryAddress: previousDraft?.deliveryAddress,
      items: items.map((item) => {
        const customizationSummary = formatCustomizationSummary(item.customizations);

        return {
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          description: item.menuItem.description,
          imageUrl: item.menuItem.imageUrl,
          customizationSummary: customizationSummary ?? undefined,
          price: parsePrice(item.menuItem.price),
          quantity: item.quantity,
        };
      }),
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    });

    setIsOpen(false);
    setLocation("/payment");
  };

  const handleBackToMenu = () => {
    setIsOpen(false);
    setLocation("/menu");
  };

  const handleAddMore = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex h-full w-full flex-col border-l-border/50 bg-background sm:max-w-md">
          <SheetHeader className="space-y-4 border-b border-border/40 pb-4">
            <SheetTitle className="font-serif text-2xl text-primary">Your Basket</SheetTitle>
            <SheetDescription>
              {items.length === 0 ? "Your basket is empty." : `${items.length} items selected`}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="-mx-6 flex-1 px-6 py-4">
            {items.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center space-y-4 text-muted-foreground">
                <ShoppingBagIcon className="h-12 w-12 opacity-20" />
                <p>Looks like you haven&apos;t added anything yet.</p>
                <div className="flex w-full max-w-xs flex-col gap-2">
                  <Button variant="outline" onClick={handleAddMore}>Add More</Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleBackToMenu}>
                    Back to Menu
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map(({ lineItemId, menuItem, quantity, customizations }) => {
                  const customizationSummary = formatCustomizationSummary(customizations);
                  const isPizzaItem = pizzaItemIds.has(menuItem.id);

                  return (
                    <div key={lineItemId} className="rounded-xl border border-border/60 bg-card/80 p-3">
                      <div className="flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={resolveItemImage(menuItem.name, menuItem.imageUrl)}
                            alt={menuItem.name}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = fallbackImageByName(menuItem.name);
                            }}
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="font-medium text-foreground">{menuItem.name}</h4>
                            {customizationSummary && (
                              <p className="mt-0.5 text-xs text-muted-foreground">{customizationSummary}</p>
                            )}
                            <p className="text-sm font-semibold text-primary">${menuItem.price}</p>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-full bg-muted/30 px-2 py-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(lineItemId, quantity - 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-background"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-4 text-center text-sm font-medium">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(lineItemId, quantity + 1)}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-background"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(lineItemId)}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {isPizzaItem && (
                            <div className="mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => openCustomize(lineItemId, customizations)}
                              >
                                Customize
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </ScrollArea>

          {items.length > 0 && (
            <div className="space-y-4 border-t border-border/40 pt-6">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="order-2 h-11 sm:order-1"
                  onClick={handleAddMore}
                >
                  Add More
                </Button>
                <Button
                  type="button"
                  className="order-1 h-11 bg-secondary text-secondary-foreground hover:bg-secondary/90 sm:order-2"
                  onClick={handleBackToMenu}
                >
                  Back to Menu
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-serif text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="h-12 w-full bg-primary text-lg font-medium text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Checkout Now
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(editing && editingItem)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[92svh] w-[calc(100vw-1rem)] overflow-y-auto overflow-x-hidden border-border/60 bg-background p-0 sm:w-full sm:max-w-lg">
          {editing && editingItem && (
            <div className="flex flex-col">
              <div className="h-36 overflow-hidden border-b border-border/60 bg-muted sm:h-44">
                <img
                  src={resolveItemImage(editingItem.menuItem.name, editingItem.menuItem.imageUrl)}
                  alt={editingItem.menuItem.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImageByName(editingItem.menuItem.name);
                  }}
                />
              </div>

              <div className="space-y-4 p-4 sm:p-6">
                <DialogHeader className="space-y-2 text-left">
                  <DialogTitle className="pr-8 text-xl font-semibold leading-tight text-foreground">
                    Customize {editingItem.menuItem.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Update preparation and add-ons, then continue to checkout.
                  </DialogDescription>
                  <p className="text-sm font-semibold text-primary">
                    Unit Price: {previewUnitPrice !== null ? `$${previewUnitPrice.toFixed(2)}` : `$${editingItem.menuItem.price}`}
                  </p>
                </DialogHeader>

                <div className="space-y-3 rounded-lg border border-border/60 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Choice of Preparation</p>
                  <div className="grid gap-2">
                    {PIZZA_SIZE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setEditing((current) =>
                            current ? { ...current, selectedSizeId: option.id } : current,
                          )
                        }
                        className={`flex items-start justify-between gap-3 rounded-md border px-2.5 py-2 text-left text-sm transition-colors ${
                          editing.selectedSizeId === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border/70 hover:border-primary/40"
                        }`}
                      >
                        <span className="min-w-0 flex-1 leading-snug text-foreground">{option.label}</span>
                        <span className="shrink-0 font-semibold text-foreground">
                          {option.priceDelta > 0 ? `+$${option.priceDelta.toFixed(2)}` : "$0.00"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-border/60 p-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Choice of Add Ons</p>
                    <p className="text-[11px] text-muted-foreground">Choose up to 3</p>
                  </div>
                  <div className="grid gap-2">
                    {PIZZA_ADD_ON_OPTIONS.map((option) => {
                      const isSelected = editing.selectedAddOnIds.includes(option.id);
                      const limitReached = editing.selectedAddOnIds.length >= 3;
                      const isDisabled = !isSelected && limitReached;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleToggleAddOn(option.id)}
                          disabled={isDisabled}
                          className={`flex items-start justify-between gap-3 rounded-md border px-2.5 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border/70 hover:border-primary/40"
                          } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <span className="min-w-0 flex-1 leading-snug text-foreground">{option.label}</span>
                          <span className="shrink-0 font-semibold text-foreground">+${option.priceDelta.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border/60 p-4 sm:flex-row">
                <Button type="button" variant="outline" className="w-full sm:flex-1" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="button" className="w-full sm:flex-1" onClick={applyCustomization}>
                  Apply Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ShoppingBagIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
