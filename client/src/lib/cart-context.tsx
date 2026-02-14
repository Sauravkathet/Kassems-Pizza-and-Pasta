import React, { createContext, useContext, useState, useEffect } from "react";
import type { MenuItem } from "@shared/schema";

export type ItemCustomizations = {
  size?: string;
  crust?: string;
  toppings?: string[];
  specialInstructions?: string;
  comboPizzas?: string[];
  comboSide?: string;
  comboDrink?: string;
};

type CartItem = {
  lineItemId: string;
  menuItem: MenuItem;
  quantity: number;
  customizations?: ItemCustomizations;
};

function buildCustomizationKey(customizations?: ItemCustomizations): string {
  if (!customizations) return "default";

  const normalized = {
    size: customizations.size?.trim() ?? "",
    crust: customizations.crust?.trim() ?? "",
    toppings: [...(customizations.toppings ?? [])].sort(),
    specialInstructions: customizations.specialInstructions?.trim() ?? "",
    comboPizzas: [...(customizations.comboPizzas ?? [])].sort(),
    comboSide: customizations.comboSide?.trim() ?? "",
    comboDrink: customizations.comboDrink?.trim() ?? "",
  };

  return JSON.stringify(normalized);
}

function buildLineItemId(menuItemId: number, customizations?: ItemCustomizations): string {
  return `${menuItemId}:${buildCustomizationKey(customizations)}`;
}

type CartContextType = {
  items: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity: number,
    customizations?: ItemCustomizations
  ) => void;
  customizeCartItem: (
    lineItemId: string,
    item: MenuItem,
    customizations?: ItemCustomizations
  ) => void;
  removeFromCart: (lineItemId: string | number) => void;
  updateQuantity: (lineItemId: string | number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as unknown;
        if (!Array.isArray(parsed)) {
          setItems([]);
          return;
        }

        const normalizedItems = parsed as Array<{
          lineItemId?: string;
          menuItem: MenuItem;
          quantity: number;
          customizations?: ItemCustomizations;
        }>;

        const normalized = normalizedItems
          .filter((item) => item?.menuItem && typeof item.quantity === "number" && item.quantity > 0)
          .map((item) => ({
            ...item,
            lineItemId: item.lineItemId ?? buildLineItemId(item.menuItem.id, item.customizations),
          }));

        setItems(normalized);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (
    menuItem: MenuItem,
    quantity: number,
    customizations?: ItemCustomizations
  ) => {
    const lineItemId = buildLineItemId(menuItem.id, customizations);

    setItems((prev) => {
      const existing = prev.find((item) => item.lineItemId === lineItemId);
      if (existing) {
        return prev.map((item) =>
          item.lineItemId === lineItemId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                customizations: customizations ?? item.customizations,
              }
            : item
        );
      }
      return [...prev, { lineItemId, menuItem, quantity, customizations }];
    });
    setIsOpen(true);
  };

  const customizeCartItem = (
    lineItemId: string,
    menuItem: MenuItem,
    customizations?: ItemCustomizations
  ) => {
    const nextLineItemId = buildLineItemId(menuItem.id, customizations);

    setItems((prev) => {
      const sourceItem = prev.find((item) => item.lineItemId === lineItemId);
      if (!sourceItem) return prev;

      if (nextLineItemId === lineItemId) {
        return prev.map((item) =>
          item.lineItemId === lineItemId
            ? {
                ...item,
                menuItem,
                customizations,
              }
            : item
        );
      }

      const targetItem = prev.find((item) => item.lineItemId === nextLineItemId);

      if (targetItem) {
        return prev
          .filter((item) => item.lineItemId !== lineItemId)
          .map((item) =>
            item.lineItemId === nextLineItemId
              ? {
                  ...item,
                  quantity: item.quantity + sourceItem.quantity,
                  menuItem,
                  customizations,
                }
              : item
          );
      }

      return prev.map((item) =>
        item.lineItemId === lineItemId
          ? {
              ...item,
              lineItemId: nextLineItemId,
              menuItem,
              customizations,
            }
          : item
      );
    });
  };

  const removeFromCart = (lineItemId: string | number) => {
    if (typeof lineItemId === "string") {
      setItems((prev) => prev.filter((item) => item.lineItemId !== lineItemId));
      return;
    }

    setItems((prev) => prev.filter((item) => item.menuItem.id !== lineItemId));
  };

  const updateQuantity = (lineItemId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(lineItemId);
      return;
    }

    if (typeof lineItemId === "string") {
      setItems((prev) =>
        prev.map((item) =>
          item.lineItemId === lineItemId ? { ...item, quantity } : item
        )
      );
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === lineItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce(
    (sum, item) => sum + Number(item.menuItem.price) * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        customizeCartItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
