import React, { createContext, useContext, useState, useEffect } from "react";
import type { MenuItem } from "@shared/schema";

export type ItemCustomizations = {
  size?: string;
  crust?: string;
  toppings?: string[];
  specialInstructions?: string;
};

type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  customizations?: ItemCustomizations;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity: number,
    customizations?: ItemCustomizations
  ) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
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
        setItems(JSON.parse(saved));
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
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                customizations: customizations ?? i.customizations,
              }
            : i
        );
      }
      return [...prev, { menuItem, quantity, customizations }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (itemId: number) => {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.menuItem.id === itemId ? { ...i, quantity } : i
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
