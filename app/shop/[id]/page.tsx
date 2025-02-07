"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image"

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  imageData?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}


async function fetchProduct(id: string) {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default function ProductDetails() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : undefined;

  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      const data = await fetchProduct(id);
      setProduct(data);
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (id && cartItems.some((item) => item.product.id === id)) {
      setAddedToCart(true);
    }
  }, [cartItems, id]);

  async function handleAddToCart() {
    if (!id) return;

    setLoading(true);

    try {
      await addToCart(id, 1);
      setAddedToCart(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  // ✅ Use image URL if available, otherwise decode Base64 image
  const productImage = product.imageUrl
    ? product.imageUrl
    : product.imageData
    ? `data:image/jpeg;base64,${product.imageData}`
    : "/placeholder.jpg";

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <Image
  src={productImage}
  alt={product.name}
  width={400}         // Adjust based on your layout needs
  height={400}        // Maintain aspect ratio or set dynamically
  className="w-full max-w-md mx-auto my-4 object-cover rounded-md" 
  priority            // Ensures the image is loaded quickly if it's above the fold
/>
      <p className="text-gray-500">{product.description}</p>
      <p className="text-lg font-bold mt-2">${Number(product.price).toFixed(2)}</p>

      {addedToCart ? (
        <Link href="/cart">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4">
            View Cart
          </button>
        </Link>
      ) : (
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded-lg mt-4"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      )}
    </div>
  );
}
