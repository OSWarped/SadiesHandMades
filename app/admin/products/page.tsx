"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  imageData?: string;
  description: string;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <section className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Products</h1>

      {/* ✅ Add New Product Button */}
      <div className="flex justify-end mb-6">
        <Link href="/admin/products/new">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add New Product
          </button>
        </Link>
      </div>

      {/* ✅ Product List */}
      {loading ? <p>Loading products...</p> : null}
      {error ? <p className="text-center text-red-500">{error}</p> : null}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg shadow-md flex flex-col">
                <Image
  src={product.imageUrl || (product.imageData ? `data:image/png;base64,${product.imageData}` : "/placeholder.jpg")}
  alt={product.name}
  width={400}       // ✅ Define image dimensions
  height={160}      // ✅ Maintain similar aspect ratio to h-40
  className="w-full object-cover mb-3 rounded-lg"
/>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-700">${Number(product.price).toFixed(2)}</p>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>

                {/* Edit & Delete Buttons */}
                <div className="flex space-x-2 mt-3">
                  <Link href={`/admin/products/${product.id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 w-full">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 w-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
