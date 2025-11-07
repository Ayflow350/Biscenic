"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";

// --- 1. DATA STRUCTURES ---
export interface CartProduct {
  id: string;
  name: string;
  price: string;
  image: string; // small thumbnail
  authImage?: string; // hero / primary image
  description?: string;
  images?: string[];
  quantity: number;
}

interface CartContextType {
  cart: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
}

// --- CREATE CONTEXT ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- PROVIDER ---
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("biscenicCart");
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("biscenicCart", JSON.stringify(cart));
  }, [cart]);

  // ✅ ADD TO CART
  const addToCart = (productToAdd: CartProduct) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === productToAdd.id
      );

      toast.success(`${productToAdd.name} added to your cart!`);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + productToAdd.quantity }
            : item
        );
      }

      return [...prevCart, productToAdd];
    });
  };

  // ✅ REMOVE ITEM
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((item) => item.id === productId);
      if (removedItem) {
        toast.info(`${removedItem.name} removed from cart.`);
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  // ✅ UPDATE QUANTITY
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }

      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // ✅ CLEAR
  const clearCart = () => {
    setCart([]);
    toast.warning("Cart cleared!");
  };

  // ✅ COUNTS
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ TOTAL
  const total = cart.reduce((sum, item) => {
    const priceValue = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return sum + priceValue * item.quantity;
  }, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- HOOK ---
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};
