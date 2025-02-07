"use client";

import { useEffect, useState } from "react";
//import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface Address {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  //const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedBilling] = useState<string | null>(null);
  const [useSameAddress, setUseSameAddress] = useState(true);

  const [newShippingAddress, setNewShippingAddress] = useState<Address>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [newBillingAddress, setNewBillingAddress] = useState<Address>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Fetch User Data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    }
    fetchUser();
  }, []);

  // ✅ Fetch Addresses (Only if User is Logged In)
  useEffect(() => {
    if (!user) return;

    async function fetchAddresses() {
      try {
        const res = await fetch("/api/addresses");
        if (!res.ok) throw new Error("Failed to fetch addresses");
        const data = await res.json();
        setAddresses(data);
        if (data.length > 0) setSelectedShipping(data[0].id);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }
    fetchAddresses();
  }, [user]);

  // ✅ Input Handlers
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewShippingAddress({ ...newShippingAddress, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBillingAddress({ ...newBillingAddress, [e.target.name]: e.target.value });
  };

  // ✅ Checkout Function (Handles Stripe Redirect)
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
          userId: user?.id || null,
          guestEmail: user ? null : newShippingAddress.email,
          shippingAddressId: user ? selectedShipping : null,
          billingAddressId: useSameAddress ? (user ? selectedShipping : null) : selectedBilling,
          newShippingAddress: user ? null : newShippingAddress,
          newBillingAddress: useSameAddress ? null : (user ? null : newBillingAddress),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Checkout failed");
      }

      console.log("✅ Redirecting to Stripe:", data.checkoutUrl);

      // ✅ Redirect to Stripe Checkout Page
      window.location.href = data.checkoutUrl;

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

      {/* ✅ Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex justify-between border-b py-2">
            <span>{item.product.name} × {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="text-xl font-bold mt-4">Total: ${cartTotal.toFixed(2)}</div>
      </div>

      {/* ✅ Shipping & Billing Addresses */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>

        {/* ✅ Logged-in Users Select Address */}
        {user && addresses.length > 0 ? (
          <>
            <label className="block mb-2">Select Shipping Address:</label>
            <select
              value={selectedShipping || ""}
              onChange={(e) => setSelectedShipping(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              {addresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.fullName}, {address.address}, {address.city}, {address.state}, {address.zip}
                </option>
              ))}
            </select>
          </>
        ) : (
          <>
            {/* ✅ Guest: Add New Shipping Address */}
            <h3 className="text-lg font-bold mb-2">Add Shipping Address</h3>
            {Object.keys(newShippingAddress).map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                onChange={handleShippingChange}
                className="border p-2 rounded w-full mb-2"
              />
            ))}
          </>
        )}

        {/* ✅ Checkbox: Use Same Address for Billing */}
        <label className="block mb-4">
          <input type="checkbox" checked={useSameAddress} onChange={(e) => setUseSameAddress(e.target.checked)} className="mr-2" />
          Use this address for billing as well
        </label>

        {/* ✅ Billing Address Fields (Only if different) */}
        {!useSameAddress && (
          <>
            <h3 className="text-lg font-bold mb-2">Billing Address</h3>
            {Object.keys(newBillingAddress).map((field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                onChange={handleBillingChange}
                className="border p-2 rounded w-full mb-2"
              />
            ))}
          </>
        )}
      </div>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      <button onClick={handleCheckout} disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg mt-4">
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}
