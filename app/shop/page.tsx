"use client"; // ✅ Required for fetching in React Component

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

// ✅ Define Product Type with both `imageUrl` and `imageData`
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  imageData?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  imageData?: string;
}


export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        // ✅ Normalize `image` to `imageUrl` and `imageData`
        const formattedData: Product[] = data.map((product: Product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl || undefined,
          imageData: product.imageData || undefined,
        }));
        

        setProducts(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Shop Handmade Products</h2>

      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
