"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface CartItem {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [isFetching, setIsFetching] = useState<boolean>(false); // ✅ Prevent multiple fetches

  // ✅ Function to Fetch Cart (Handles Guests Too)
  const fetchCart = useCallback(async () => {
    if (isFetching) return; // ✅ Prevent duplicate calls
    setIsFetching(true);
  
    try {
      const res = await fetch("/api/cart");
  
      if (!res.ok) {
        console.warn("Failed to fetch cart, assuming guest user.");
        throw new Error("No cart data");
      }
  
      const data = await res.json();
      setCartItems(data);
  
      setCartCount(data.reduce((acc: number, item: CartItem) => acc + item.quantity, 0));
      setCartTotal(data.reduce((acc: number, item: CartItem) => acc + item.product.price * item.quantity, 0));
    } catch (error) {
      console.warn("Error loading cart. Assuming empty cart for guest users.");
      setCartItems([]); 
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setIsFetching(false); // ✅ Reset loading state
    }
  }, []); // ✅ Remove isFetching from dependencies

  // ✅ Fetch Cart on Mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ✅ Function to Add to Cart
  async function addToCart(productId: string, quantity: number = 1) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add item");
      }

      await fetchCart(); // ✅ Refresh cart after adding
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  }

  // ✅ Function to Remove from Cart
  async function removeFromCart(productId: string) {
    try {
      const res = await fetch(`/api/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }), // ✅ Send productId in body
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove item");
      }

      await fetchCart(); // ✅ Refresh cart immediately
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  }

  // ✅ Function to Clear Cart (Fix for Guests)
  async function clearCart() {
    try {
      const res = await fetch("/api/cart/clear", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear cart");

      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    } catch (error) {
      console.warn("Guest users cannot clear server-side cart. Clearing local state.");
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    }
  }

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, cartTotal, addToCart, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ✅ Custom Hook to use Cart Context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
