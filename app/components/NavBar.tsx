"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [user, setUser] = useState<{ name: string; isAdmin: boolean } | null>(null);
  const { cartCount, fetchCart, cartItems } = useCart(); // ✅ Added cartItems to check if data exists
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [hasFetchedCart, setHasFetchedCart] = useState(false); // ✅ Track if cart is already fetched

  // ✅ Fetch User on Mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");

        if (res.status === 401) {
          setUser(null); // ✅ User not logged in
        } else if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsFetchingUser(false); // ✅ Stop fetching after first attempt
      }
    };

    fetchUser();
  }, []);

  // ✅ Fetch Cart Only When Needed
  useEffect(() => {
    const fetchCartSafely = async () => {
      if (!isFetchingUser && !hasFetchedCart) { // ✅ Only fetch if not already fetched
        try {
          await fetchCart();
          setHasFetchedCart(true); // ✅ Prevent further fetches
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      }
    };
  
    fetchCartSafely();
  }, [isFetchingUser, hasFetchedCart]); // ✅ Removed cartItems.length
  

  return (
    <nav className="bg-[#5E35B1] text-white p-4 sticky top-0 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold">Sadie’s Handmades</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          {user?.isAdmin && <Link href="/admin" className="font-bold">Admin Panel</Link>}
          <Link href="/cart">
            🛒 Cart {cartCount > 0 && <span className="ml-1 px-2 py-1 bg-red-500 text-white rounded-full">{cartCount}</span>}
          </Link>
          {user ? (
            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/"; // ✅ Redirect after logout
              }}
              className="text-red-500"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
