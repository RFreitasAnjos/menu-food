"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { CartItem, FoodItem, Extra } from "@/app/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (
    food: FoodItem,
    quantity: number,
    extras: Extra[],
    observation: string
  ) => void;
  editItem: (
    uid: string,
    quantity: number,
    extras: Extra[],
    observation: string
  ) => void;
  removeItem: (uid: string) => void;
  updateQuantity: (uid: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => {},
  editItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

const STORAGE_KEY = "menu-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved) as CartItem[]);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (food: FoodItem, quantity: number, extras: Extra[], observation: string) => {
      setItems((prev) => [
        ...prev,
        {
          uid: `${food.id}-${Date.now()}`,
          food,
          quantity,
          extras,
          observation,
        },
      ]);
    },
    []
  );

  const removeItem = useCallback((uid: string) => {
    setItems((prev) => prev.filter((item) => item.uid !== uid));
  }, []);

  const editItem = useCallback(
    (uid: string, quantity: number, extras: Extra[], observation: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.uid === uid
            ? { ...item, quantity: Math.max(1, quantity), extras, observation }
            : item
        )
      );
    },
    []
  );

  const updateQuantity = useCallback((uid: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.uid === uid ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = items.reduce((sum, item) => {
    const foodPrice = item.food.value;
    const extrasTotal = item.extras.reduce((s, e) => s + e.price, 0);
    return sum + (foodPrice + extrasTotal) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        editItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
