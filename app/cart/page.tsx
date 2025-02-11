"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { cartItems, cartCount, cartTotal, removeFromCart, addToCart, fetchCart } = useCart();
  const router = useRouter();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const handleUpdate = async (productId: string) => {
    const newQuantity = quantities[productId];
    if (newQuantity === 0) {
      await removeFromCart(productId);
    } else {
      //await addToCart(productId, newQuantity - cartItems.find(item => item.id === productId)?.quantity!);
      const currentItem = cartItems.find(item => item.id === productId);
      const currentQuantity = currentItem ? currentItem.quantity : 0;
      const quantityDifference = newQuantity - currentQuantity;

      if (quantityDifference !== 0) {
        await addToCart(productId, quantityDifference);
      }
    }
    await fetchCart();
  };

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
                    ${Number(item.product.price).toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={quantities[item.id] || 0}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    className="w-16 text-center border rounded-md p-1"
                  />

                  <button
                    onClick={() => handleUpdate(item.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    Update
                  </button>

                  <button
                    onClick={async () => {
                      await removeFromCart(item.product.id);
                      await fetchCart();
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-lg">
            <p className="font-bold">Total Items: {cartCount}</p>
            <p className="font-bold text-xl">Total Cost: ${cartTotal.toFixed(2)}</p>
          </div>

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
