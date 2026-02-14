import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { createOrderRequestSchema, type MenuItem } from "@shared/schema";
import { useMenu } from "@/hooks/use-menu";
import { useCart, type ItemCustomizations } from "@/lib/cart-context";
import { saveCheckoutDraft } from "@/lib/checkout-session";
import { fallbackImageByName, resolveItemImage } from "@/lib/item-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Clock3, Loader2, Minus, Plus, Search, ShoppingBag, Sparkles, Trash2 } from "lucide-react";

const checkoutCustomerSchema = createOrderRequestSchema.omit({ items: true });
type OrderFormValues = z.infer<typeof checkoutCustomerSchema>;

type SizeOption = {
  id: string;
  label: string;
  priceDelta: number;
  rankText: string;
  isPopular?: boolean;
};

type AddOnOption = {
  id: string;
  label: string;
  priceDelta: number;
  isPopular?: boolean;
};

type ComboPizzaOption = {
  id: string;
  label: string;
  priceDelta: number;
  isPopular?: boolean;
};

type ComboSimpleOption = {
  id: string;
  label: string;
};

const TAX_RATE = 0.08;
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "AUD",
});

const PIZZA_SIZE_OPTIONS: SizeOption[] = [
  {
    id: "size-small",
    label: '9" Small (Six Pieces)',
    priceDelta: 0,
    rankText: "#2, Ordered by 10+ others",
  },
  {
    id: "size-large",
    label: '13" Large (Eight Pieces)',
    priceDelta: 7,
    rankText: "#1, Ordered by 10+ others",
    isPopular: true,
  },
  {
    id: "size-gluten-free",
    label: '11" Gluten Free Base',
    priceDelta: 11,
    rankText: "Gluten free option",
  },
  {
    id: "size-family",
    label: '15" Family (Twelve Pieces)',
    priceDelta: 12,
    rankText: "#3, Ordered by 5+ others",
  },
];

const PIZZA_ADD_ON_OPTIONS: AddOnOption[] = [
  {
    id: "addon-bbq-sauce",
    label: "BBQ Sauce",
    priceDelta: 1,
    isPopular: true,
  },
  {
    id: "addon-egg",
    label: "Egg",
    priceDelta: 2,
  },
  {
    id: "addon-vegan-cheese",
    label: "Vegan Cheese (VG)",
    priceDelta: 2,
  },
];

const CHICKEN_PARADISO_HINTS = [
  "#1, Ordered by 10+ others",
  "#2, Ordered by 10+ others",
  "#3, Ordered by 5+ others",
  "#4, Ordered by 5+ others",
];

const COMBO_THREE_PIZZA_OPTIONS: ComboPizzaOption[] = [
  { id: "pizza-all-cheese", label: "All Cheese Pizza", priceDelta: 0 },
  { id: "pizza-aussie", label: "Aussie Pizza", priceDelta: 0 },
  { id: "pizza-belmont-bomber", label: "Belmont Bomber Pizza", priceDelta: 0 },
  { id: "pizza-carlisle-cougar", label: "Carlisle Cougar Pizza", priceDelta: 0 },
  { id: "pizza-chicken-paradiso", label: "Chicken Paradiso Pizza", priceDelta: 0 },
  { id: "pizza-hawaiian", label: "Hawaiian Pizza", priceDelta: 0 },
  { id: "pizza-italian", label: "Italian Pizza", priceDelta: 0 },
  { id: "pizza-joey-pepperoni", label: "Joey Pepperoni Pizza", priceDelta: 0 },
  { id: "pizza-kassems-special", label: "Kassems Special Pizza", priceDelta: 0 },
  { id: "pizza-margherita", label: "Margherita Pizza", priceDelta: 0 },
  { id: "pizza-marinara", label: "Marinara Pizza", priceDelta: 0 },
  { id: "pizza-meat-lovers", label: "Meat Lovers Pizza", priceDelta: 0 },
  { id: "pizza-perth-demons", label: "Perth Demons Pizza", priceDelta: 0 },
  { id: "pizza-portofino", label: "Portofino Pizza", priceDelta: 0 },
  { id: "pizza-ronaldo", label: "Ronaldo Pizza", priceDelta: 0 },
  { id: "pizza-sunrise", label: "Sunrise Pizza", priceDelta: 0 },
  { id: "pizza-supreme", label: "Supreme Pizza", priceDelta: 0 },
  { id: "pizza-tropicana", label: "Tropicana Pizza", priceDelta: 0 },
  { id: "pizza-vegetarian", label: "Vegetarian Pizza (V)", priceDelta: 0 },
  { id: "pizza-celine-special", label: "Celine's Special Pizza", priceDelta: 3 },
  { id: "pizza-eagles", label: "Eagles Pizza", priceDelta: 3 },
  { id: "pizza-godfather", label: "Godfather Pizza", priceDelta: 3 },
  { id: "pizza-maharaja", label: "Maharaja Pizza", priceDelta: 3 },
  { id: "pizza-supreme-seafood", label: "Supreme Pizza with Seafood", priceDelta: 3, isPopular: true },
  { id: "pizza-punjabi-chicken", label: "Punjabi Chicken", priceDelta: 3, isPopular: true },
  { id: "pizza-vegetarian-seafood", label: "Vegetarian Pizza with Seafood (V)", priceDelta: 3 },
];

const COMBO_THREE_SIDE_OPTIONS: ComboSimpleOption[] = [{ id: "side-garlic-bread", label: "Garlic Bread" }];

const COMBO_THREE_DRINK_OPTIONS: ComboSimpleOption[] = [
  { id: "drink-pepsi", label: "Pepsi" },
  { id: "drink-pepsi-max", label: "Pepsi Max" },
  { id: "drink-pepsi-max-vanilla", label: "Pepsi Max Vanilla" },
  { id: "drink-sunkist", label: "Sunkist" },
  { id: "drink-solo", label: "Solo" },
  { id: "drink-mountain-dew", label: "Mountain Dew" },
];

const COMBO_THREE_HINTS = ["#1, Ordered by 5+ others"];

function isPizzaCategory(categoryName: string): boolean {
  return /pizza/i.test(categoryName);
}

function normalizeMenuName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isComboThreeName(itemName: string): boolean {
  return normalizeMenuName(itemName) === "combo three";
}

function formatCustomizationSummary(customizations?: ItemCustomizations): string | null {
  if (!customizations) return null;

  const parts: string[] = [];
  if (customizations.comboPizzas && customizations.comboPizzas.length > 0) {
    parts.push(`Pizzas: ${customizations.comboPizzas.join(", ")}`);
  }
  if (customizations.comboSide) {
    parts.push(`Side: ${customizations.comboSide}`);
  }
  if (customizations.comboDrink) {
    parts.push(`Drink: ${customizations.comboDrink}`);
  }
  if (customizations.size) {
    parts.push(customizations.size);
  }
  if (customizations.toppings && customizations.toppings.length > 0) {
    parts.push(customizations.toppings.join(", "));
  }

  if (parts.length === 0) return null;
  return parts.join(" | ");
}

export default function Order() {
  const { data: categories, isLoading: isMenuLoading, error: menuError } = useMenu();
  const { items, cartTotal, itemCount, updateQuantity, removeFromCart, addToCart } = useCart();
  const [, setLocation] = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [selectedItemContext, setSelectedItemContext] = useState<{
    item: MenuItem;
    categoryName: string;
  } | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string>("size-large");
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [selectedComboPizzaIds, setSelectedComboPizzaIds] = useState<string[]>([
    "pizza-hawaiian",
    "pizza-meat-lovers",
  ]);
  const [selectedComboSideId, setSelectedComboSideId] = useState<string | null>(null);
  const [selectedComboDrinkId, setSelectedComboDrinkId] = useState<string>(COMBO_THREE_DRINK_OPTIONS[0].id);
  const [selectedItemQuantity, setSelectedItemQuantity] = useState<number>(1);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(checkoutCustomerSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
    },
  });

  const subtotal = Number(cartTotal.toFixed(2));
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const sortedCategories = useMemo(() => {
    if (!categories) return [];
    return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedCategories
      .map((category) => {
        const categoryMatches = activeCategory === "all" || category.id === activeCategory;
        if (!categoryMatches) return { ...category, items: [] };

        const filteredItems = category.items.filter((item) => {
          if (!query) return true;
          const haystack = `${item.name} ${item.description}`.toLowerCase();
          return haystack.includes(query);
        });

        return { ...category, items: filteredItems };
      })
      .filter((category) => category.items.length > 0);
  }, [activeCategory, searchQuery, sortedCategories]);

  const selectedIsPizza = selectedItemContext
    ? isPizzaCategory(selectedItemContext.categoryName)
    : false;
  const selectedIsComboThree = selectedItemContext
    ? isComboThreeName(selectedItemContext.item.name)
    : false;

  const selectedIsChickenParadiso =
    selectedItemContext && normalizeMenuName(selectedItemContext.item.name) === "chicken paradiso";

  const selectedSizeOption = useMemo(
    () => PIZZA_SIZE_OPTIONS.find((option) => option.id === selectedSizeId) ?? PIZZA_SIZE_OPTIONS[1],
    [selectedSizeId],
  );

  const selectedAddOnOptions = useMemo(
    () => PIZZA_ADD_ON_OPTIONS.filter((option) => selectedAddOnIds.includes(option.id)),
    [selectedAddOnIds],
  );

  const selectedComboPizzaOptions = useMemo(
    () => COMBO_THREE_PIZZA_OPTIONS.filter((option) => selectedComboPizzaIds.includes(option.id)),
    [selectedComboPizzaIds],
  );
  const selectedComboSideOption = useMemo(
    () => COMBO_THREE_SIDE_OPTIONS.find((option) => option.id === selectedComboSideId),
    [selectedComboSideId],
  );
  const selectedComboDrinkOption = useMemo(
    () => COMBO_THREE_DRINK_OPTIONS.find((option) => option.id === selectedComboDrinkId),
    [selectedComboDrinkId],
  );

  const selectedUnitPrice = useMemo(() => {
    if (!selectedItemContext) return 0;

    const basePrice = Number(selectedItemContext.item.price);
    if (selectedIsComboThree) {
      const comboPizzaDelta = selectedComboPizzaOptions.reduce((sum, option) => sum + option.priceDelta, 0);
      return basePrice + comboPizzaDelta;
    }
    if (!selectedIsPizza) return basePrice;

    const sizeDelta = selectedSizeOption?.priceDelta ?? 0;
    const addOnDelta = selectedAddOnOptions.reduce((sum, option) => sum + option.priceDelta, 0);
    return basePrice + sizeDelta + addOnDelta;
  }, [selectedAddOnOptions, selectedComboPizzaOptions, selectedIsComboThree, selectedIsPizza, selectedItemContext, selectedSizeOption]);

  const selectedComboIsValid = !selectedIsComboThree || (selectedComboPizzaIds.length === 2 && Boolean(selectedComboDrinkOption));

  const onSubmit = (data: OrderFormValues) => {
    if (items.length === 0) return;

    saveCheckoutDraft({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      fulfillmentType: "pickup",
      deliveryAddress: undefined,
      items: items.map((item) => {
        const customizationSummary = formatCustomizationSummary(item.customizations);

        return {
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          description: item.menuItem.description,
          imageUrl: item.menuItem.imageUrl,
          customizationSummary: customizationSummary ?? undefined,
          price: Number(item.menuItem.price),
          quantity: item.quantity,
        };
      }),
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    });
    setLocation("/payment");
  };

  const openItemDetails = (item: MenuItem, categoryName: string) => {
    setSelectedItemContext({ item, categoryName });
    setSelectedSizeId("size-large");
    setSelectedAddOnIds([]);
    setSelectedComboPizzaIds(["pizza-hawaiian", "pizza-meat-lovers"]);
    setSelectedComboSideId(null);
    setSelectedComboDrinkId(COMBO_THREE_DRINK_OPTIONS[0].id);
    setSelectedItemQuantity(1);
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedItemContext(null);
    }
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOnIds((previous) => {
      if (previous.includes(addOnId)) {
        return previous.filter((id) => id !== addOnId);
      }

      if (previous.length >= 3) {
        return previous;
      }

      return [...previous, addOnId];
    });
  };

  const handleComboPizzaToggle = (pizzaId: string) => {
    setSelectedComboPizzaIds((previous) => {
      if (previous.includes(pizzaId)) {
        return previous.filter((id) => id !== pizzaId);
      }

      if (previous.length >= 2) {
        return previous;
      }

      return [...previous, pizzaId];
    });
  };

  const handleAddSelectedItemToCart = () => {
    if (!selectedItemContext) return;
    if (selectedIsComboThree && !selectedComboIsValid) return;

    let customizations: ItemCustomizations | undefined;
    if (selectedIsComboThree) {
      customizations = {
        comboPizzas: selectedComboPizzaOptions.map((option) => option.label),
        comboSide: selectedComboSideOption?.label,
        comboDrink: selectedComboDrinkOption?.label,
      };
    } else if (selectedIsPizza) {
      const selectedSize = selectedSizeOption?.label;
      const selectedAddOns = selectedAddOnOptions.map((option) => option.label);
      customizations = {
        size: selectedSize,
        toppings: selectedAddOns.length > 0 ? selectedAddOns : undefined,
      };
    }

    const menuItemToAdd: MenuItem = {
      ...selectedItemContext.item,
      price: selectedUnitPrice.toFixed(2),
    };

    addToCart(menuItemToAdd, selectedItemQuantity, customizations);
    setSelectedItemContext(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f3] via-background to-[#fff5ec] pb-20 pt-24">
      <div className="container mx-auto px-4">
        <section className="mx-auto mb-8 max-w-7xl rounded-3xl border border-black/10 bg-white/95 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-8">
          <div className="grid gap-5 md:grid-cols-[1.25fr_0.75fr] md:items-center">
            <div>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                Order Online
              </Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                Fresh pizza, one smooth checkout flow
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
                Pick your favorites, adjust quantities, and continue to secure payment in minutes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Items in Cart</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{itemCount}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current Total</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{currency.format(total)}</p>
              </div>
              <div className="col-span-2 flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                <span>Estimated prep and delivery time: 25-35 minutes.</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto mb-6 max-w-7xl">
          <div className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm sm:p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search combos, pizza, pasta, salads, drinks..."
                className="h-11 border-border bg-background pl-9"
              />
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              <Button
                type="button"
                size="sm"
                variant={activeCategory === "all" ? "default" : "outline"}
                onClick={() => setActiveCategory("all")}
                className="h-9 rounded-full"
              >
                All Categories
              </Button>
              {sortedCategories.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  size="sm"
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  className="h-9 rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card/95 p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Choose Your Dishes</h2>
              </div>

              {isMenuLoading ? (
                <div className="flex min-h-[240px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : menuError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {(menuError as Error).message || "Unable to load menu."}
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No items match your current filters. Try another search or category.
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredCategories.map((category) => (
                    <div key={category.id}>
                      <div className="mb-4 flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {category.items.map((item) => (
                          <article
                            key={item.id}
                            className="flex gap-3 rounded-xl border border-border/60 bg-background/70 p-3 shadow-sm transition-colors hover:border-primary/30"
                          >
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
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
                              <div className="flex items-start justify-between gap-2">
                                <p className="line-clamp-1 font-semibold text-foreground">{item.name}</p>
                                <p className="font-semibold text-primary">{currency.format(Number(item.price))}</p>
                              </div>
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {item.description}
                              </p>

                              <div className="mt-2 flex items-center justify-between gap-2">
                                <div className="flex flex-wrap gap-1.5">
                                  {item.isPopular && (
                                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] text-primary">
                                      Popular
                                    </Badge>
                                  )}
                                  {item.isVegetarian && (
                                    <Badge variant="outline" className="border-green-300 bg-green-100 text-[10px] text-green-700">
                                      Veg
                                    </Badge>
                                  )}
                                  {item.isSpicy && (
                                    <Badge variant="outline" className="border-orange-300 bg-orange-100 text-[10px] text-orange-700">
                                      Spicy
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openItemDetails(item, category.name)}
                                  className="h-8 rounded-full px-3 text-xs"
                                >
                                  {isPizzaCategory(category.name) ? "Customize" : "View Details"}
                                </Button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Your Cart</h2>
              </div>

              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
                  <p className="text-sm text-muted-foreground">Add dishes from the left to start your order.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(({ lineItemId, menuItem, quantity, customizations }) => {
                    const customizationSummary = formatCustomizationSummary(customizations);
                    return (
                      <div key={lineItemId} className="flex gap-3 rounded-lg border border-border/60 bg-background/70 p-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                          <img
                            src={resolveItemImage(menuItem.name, menuItem.imageUrl)}
                            alt={menuItem.name}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.src = fallbackImageByName(menuItem.name);
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="line-clamp-1 text-sm font-semibold text-foreground">{menuItem.name}</p>
                              {customizationSummary && (
                                <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                                  {customizationSummary}
                                </p>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              {currency.format(Number(menuItem.price) * quantity)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-input bg-background">
                              <button
                                type="button"
                                onClick={() => updateQuantity(lineItemId, quantity - 1)}
                                className="rounded-l-full px-2 py-1 text-foreground/70 hover:bg-muted"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="px-2 text-xs font-medium">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(lineItemId, quantity + 1)}
                                className="rounded-r-full px-2 py-1 text-foreground/70 hover:bg-muted"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(lineItemId)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Separator className="my-5" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{currency.format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>{currency.format(tax)}</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-dashed pt-3 text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>{currency.format(total)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-card p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-semibold text-foreground">Contact Details</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="h-11" {...field} />
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
                          <Input type="email" placeholder="john@example.com" className="h-11" {...field} />
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
                          <Input placeholder="(555) 123-4567" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={items.length === 0}
                      className="h-12 w-full text-base font-semibold"
                    >
                      {items.length === 0
                        ? "Add Items To Continue"
                        : `Continue To Payment - ${currency.format(total)}`}
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Secure checkout in the next step. You can review payment details before confirming.
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </aside>
        </div>
      </div>

      <Sheet open={Boolean(selectedItemContext)} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="h-[100svh] w-full overflow-y-auto border-l-border/60 bg-background p-0 sm:h-full sm:max-w-xl">
          {selectedItemContext && (
            <div className="flex min-h-full flex-col">
              <div className="relative h-48 w-full overflow-hidden border-b bg-muted sm:h-56">
                <img
                  src={resolveItemImage(selectedItemContext.item.name, selectedItemContext.item.imageUrl)}
                  alt={selectedItemContext.item.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImageByName(selectedItemContext.item.name);
                  }}
                />
              </div>

              <div className="space-y-5 p-4 sm:p-6">
                <SheetHeader className="space-y-3 text-left">
                  <SheetTitle className="text-2xl font-semibold text-foreground">
                    {selectedItemContext.item.name}
                  </SheetTitle>
                  <p className="text-xl font-semibold text-primary">{currency.format(selectedUnitPrice)}</p>
                  <SheetDescription className="text-sm leading-relaxed text-muted-foreground">
                    {selectedItemContext.item.description}
                  </SheetDescription>
                </SheetHeader>

                {selectedIsChickenParadiso && (
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">89% (19)</span>
                      <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                        Most popular
                      </Badge>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {CHICKEN_PARADISO_HINTS.map((hint) => (
                        <li key={hint}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedIsComboThree && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">92% (113)</span>
                        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                          Most popular
                        </Badge>
                      </div>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {COMBO_THREE_HINTS.map((hint) => (
                          <li key={hint}>{hint}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-border/70 p-4">
                      <div className="mb-3 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-foreground">Choice of Pizza</p>
                        <p className="text-xs text-muted-foreground">Choose 2 | Required</p>
                      </div>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Selected {selectedComboPizzaIds.length}/2
                      </p>

                      <div className="space-y-2">
                        {COMBO_THREE_PIZZA_OPTIONS.map((option) => {
                          const isSelected = selectedComboPizzaIds.includes(option.id);
                          const limitReached = selectedComboPizzaIds.length >= 2;
                          const isDisabled = !isSelected && limitReached;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleComboPizzaToggle(option.id)}
                              disabled={isDisabled}
                              className={`flex w-full items-start justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border/70 hover:border-primary/40"
                              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                            >
                              <div className="flex min-w-0 flex-1 items-start gap-2">
                                <span
                                  className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border text-transparent"
                                  }`}
                                >
                                  ✓
                                </span>
                                <span className="min-w-0 break-words text-sm leading-snug text-foreground">{option.label}</span>
                              </div>
                              <div className="shrink-0 text-right">
                                {option.priceDelta > 0 && (
                                  <p className="text-sm font-semibold text-foreground">+{currency.format(option.priceDelta)}</p>
                                )}
                                {option.isPopular && (
                                  <p className="text-[11px] font-medium text-primary">Popular</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 p-4">
                      <div className="mb-3 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-foreground">Choice of Side</p>
                        <p className="text-xs text-muted-foreground">Choose up to 1</p>
                      </div>

                      <div className="space-y-2">
                        {COMBO_THREE_SIDE_OPTIONS.map((option) => {
                          const isSelected = selectedComboSideId === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                setSelectedComboSideId((current) => (current === option.id ? null : option.id))
                              }
                              className={`flex w-full items-start justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border/70 hover:border-primary/40"
                              }`}
                            >
                              <span className="min-w-0 flex-1 break-words text-sm leading-snug text-foreground">{option.label}</span>
                              <span
                                className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border text-transparent"
                                }`}
                              >
                                ✓
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 p-4">
                      <div className="mb-3 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-foreground">Choice of Drink</p>
                        <p className="text-xs text-muted-foreground">Choose 1 | Required</p>
                      </div>

                      <div className="space-y-2">
                        {COMBO_THREE_DRINK_OPTIONS.map((option) => {
                          const isSelected = selectedComboDrinkId === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setSelectedComboDrinkId(option.id)}
                              className={`flex w-full items-start justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border/70 hover:border-primary/40"
                              }`}
                            >
                              <span className="min-w-0 flex-1 break-words text-sm leading-snug text-foreground">{option.label}</span>
                              <span
                                className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                  isSelected ? "border-primary bg-primary" : "border-border"
                                }`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {selectedIsPizza && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border/70 p-4">
                      <div className="mb-3 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-foreground">Choice of Preparation</p>
                        <p className="text-xs text-muted-foreground">Choose 1 | Required</p>
                      </div>

                      <div className="space-y-2">
                        {PIZZA_SIZE_OPTIONS.map((option) => {
                          const isSelected = selectedSizeId === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setSelectedSizeId(option.id)}
                              className={`flex w-full items-start justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border/70 hover:border-primary/40"
                              }`}
                            >
                              <div className="min-w-0 flex-1 pr-2">
                                <p className="break-words text-sm font-medium leading-snug text-foreground">{option.label}</p>
                                <p className="break-words text-xs text-muted-foreground">{option.rankText}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-sm font-semibold text-foreground">
                                  {option.priceDelta > 0 ? `+${currency.format(option.priceDelta)}` : currency.format(0)}
                                </p>
                                {option.isPopular && (
                                  <p className="text-[11px] font-medium text-primary">Popular</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/70 p-4">
                      <div className="mb-3 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-foreground">Choice of Add Ons</p>
                        <p className="text-xs text-muted-foreground">Choose up to 3</p>
                      </div>

                      <div className="space-y-2">
                        {PIZZA_ADD_ON_OPTIONS.map((option) => {
                          const isSelected = selectedAddOnIds.includes(option.id);
                          const limitReached = selectedAddOnIds.length >= 3;
                          const isDisabled = !isSelected && limitReached;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleAddOnToggle(option.id)}
                              disabled={isDisabled}
                              className={`flex w-full items-start justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-border/70 hover:border-primary/40"
                              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                            >
                              <div className="flex min-w-0 flex-1 items-start gap-2">
                                <span
                                  className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border text-transparent"
                                  }`}
                                >
                                  ✓
                                </span>
                                <span className="min-w-0 break-words text-sm leading-snug text-foreground">{option.label}</span>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-sm font-semibold text-foreground">+{currency.format(option.priceDelta)}</p>
                                {option.isPopular && (
                                  <p className="text-[11px] font-medium text-primary">Popular</p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-border/70 p-4">
                  <p className="mb-3 text-sm font-semibold text-foreground">Quantity</p>
                  <div className="inline-flex items-center rounded-full border border-input bg-background">
                    <button
                      type="button"
                      onClick={() => setSelectedItemQuantity((current) => Math.max(1, current - 1))}
                      className="rounded-l-full px-3 py-1 text-foreground/70 hover:bg-muted"
                      aria-label="Decrease item quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 text-sm font-medium">{selectedItemQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedItemQuantity((current) => current + 1)}
                      className="rounded-r-full px-3 py-1 text-foreground/70 hover:bg-muted"
                      aria-label="Increase item quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-border p-4">
                  <p className="text-sm font-medium text-foreground">Enter address for availability</p>
                  <p className="mt-1 text-xs text-muted-foreground">See details</p>
                </div>
              </div>

              <div className="mt-auto border-t border-border/70 p-4 sm:p-6">
                <Button
                  onClick={handleAddSelectedItemToCart}
                  disabled={!selectedComboIsValid}
                  className="h-11 w-full text-sm font-semibold"
                >
                  {selectedComboIsValid
                    ? `Add To Cart | ${currency.format(selectedUnitPrice * selectedItemQuantity)}`
                    : "Select required options"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
