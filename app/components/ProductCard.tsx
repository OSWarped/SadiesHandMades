"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext"; // ✅ Import Cart Context
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    imageData?: string; // ✅ New field for Base64-encoded image
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart(); // ✅ Use CartContext
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddToCart(event: React.MouseEvent) {
    event.preventDefault(); // Prevent navigation if clicking the button

    setLoading(true);
    setMessage("");

    try {
      await addToCart(product.id, 1); // ✅ Use context function
      setMessage("Added to cart!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to add to cart.");
    }

    setLoading(false);
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Link href={`/shop/${product.id}`}>
      <Image
  src={
    product.imageUrl
      ? product.imageUrl
      : product.imageData
      ? `data:image/jpeg;base64,${product.imageData}`
      : "/placeholder.jpg"
  }
  alt={product.name}
  width={400}       // ✅ Define the width
  height={192}      // ✅ Corresponds to h-48 (192px)
  className="w-full object-cover rounded-lg"
/>

      </Link>
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-gray-500">${Number(product.price).toFixed(2)}</p>

      <div className="mt-4 text-center">
        <Link href={`/shop/${product.id}`} className="mr-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg">View Details</button>
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
