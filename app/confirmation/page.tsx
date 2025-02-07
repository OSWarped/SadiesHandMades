"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface Address {
  id: string;
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedBilling, setSelectedBilling] = useState<string | "new">("");
  const [selectedShipping, setSelectedShipping] = useState<string | "new">("");
  const [newAddress, setNewAddress] = useState<Address | null>(null);
  const [addingNewAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }

    // ✅ Fetch saved addresses for logged-in users
    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/addresses");
        if (!res.ok) throw new Error("Failed to fetch addresses");
        const data = await res.json();
        setUserAddresses(data);
      } catch (error) {
        console.error("Error loading addresses:", error);
      }
    };

    fetchAddresses();
  }, [cartItems, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress((prev) => ({ ...prev!, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          total: cartTotal,
          billingAddressId: selectedBilling !== "new" ? selectedBilling : null,
          shippingAddressId: selectedShipping !== "new" ? selectedShipping : null,
          newAddress: addingNewAddress ? newAddress : null,
        }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      clearCart(); // ✅ Empty cart after successful order
      router.push("/confirmation");
    } catch (error) {
      setErrorMessage("Failed to process checkout. Please try again.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex justify-between border-b py-2">
            <span>{item.product.name} × {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="text-xl font-bold mt-4">Total: ${cartTotal.toFixed(2)}</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">Billing Address</h2>
        {userAddresses.length > 0 ? (
          <select
            value={selectedBilling}
            onChange={(e) => setSelectedBilling(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select a Billing Address</option>
            {userAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.address}, {addr.city}, {addr.state} {addr.zip}
              </option>
            ))}
            <option value="new">Add New Address</option>
          </select>
        ) : (
          <p>No saved billing addresses. Please add one.</p>
        )}

        {selectedBilling === "new" && (
          <>
            <h3 className="text-xl font-semibold mt-4">New Billing Address</h3>
            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="text" name="address" placeholder="Address" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="text" name="city" placeholder="City" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="text" name="state" placeholder="State" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="text" name="zip" placeholder="ZIP Code" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
          </>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
        {userAddresses.length > 0 ? (
          <select
            value={selectedShipping}
            onChange={(e) => setSelectedShipping(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select a Shipping Address</option>
            {userAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.address}, {addr.city}, {addr.state} {addr.zip}
              </option>
            ))}
            <option value="new">Add New Address</option>
          </select>
        ) : (
          <p>No saved shipping addresses. Please add one.</p>
        )}

        {selectedShipping === "new" && (
          <>
            <h3 className="text-xl font-semibold mt-4">New Shipping Address</h3>
            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="text" name="address" placeholder="Address" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="text" name="city" placeholder="City" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="text" name="state" placeholder="State" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
            <input type="text" name="zip" placeholder="ZIP Code" required onChange={handleInputChange} className="border p-2 rounded w-full mt-2"/>
          </>
        )}
      </div>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-primary text-white px-6 py-2 rounded-lg mt-4"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
