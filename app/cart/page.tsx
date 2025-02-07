"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { cartItems, cartCount, cartTotal, removeFromCart, fetchCart } = useCart();
  const router = useRouter(); // ✅ For navigating to checkout

  useEffect(() => {
    fetchCart(); // ✅ Fetch cart on page load
  }, [fetchCart]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-lg">Your cart is empty.</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <ul className="divide-y divide-gray-300">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-4">
                <div>
                  <p className="text-lg font-semibold">{item.product.name}</p>
                  <p className="text-gray-600">
                    {item.quantity} × ${Number(item.product.price).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await removeFromCart(item.product.id);
                    await fetchCart(); // ✅ Immediately update UI
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* ✅ Cart Totals */}
          <div className="mt-6 text-lg">
            <p className="font-bold">Total Items: {cartCount}</p>
            <p className="font-bold text-xl">Total Cost: ${cartTotal.toFixed(2)}</p>
          </div>

          {/* ✅ Checkout Button */}
          <button
            onClick={() => router.push("/checkout")}
            className="bg-green-600 text-white text-lg font-bold px-6 py-3 rounded-lg mt-6 w-full hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
