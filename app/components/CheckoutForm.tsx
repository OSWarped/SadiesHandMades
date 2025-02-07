"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
    router.push("/order-confirmed");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        required
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        name="address"
        placeholder="Street Address"
        required
        value={formData.address}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      />
      <div className="flex space-x-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          required
          value={formData.city}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded mb-4"
        />
        <input
          type="text"
          name="zip"
          placeholder="ZIP Code"
          required
          value={formData.zip}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded mb-4"
        />
      </div>

      <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg">
        Complete Purchase
      </button>
    </form>
  );
}
