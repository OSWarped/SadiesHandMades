"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Product } from "@prisma/client";

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",  // ✅ Always provide a default string
    imageData: "", // ✅ Always provide a default string
    useImageUrl: true, // ✅ Track which method is used
  });
  
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
        setFormData({
          name: data.name,
          price: data.price,
          stock: data.stock,
          description: data.description,
          imageUrl: data.imageUrl || "",
          imageData: data.imageData || "",
          useImageUrl: !!data.imageUrl, // ✅ Default to imageUrl if it exists
        });
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        imageData: reader.result?.toString().split(",")[1] || "",
        imageUrl: "", // ✅ Clear imageUrl when using file
        useImageUrl: false, // ✅ Ensure we use uploaded file
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: formData.useImageUrl ? formData.imageUrl : null,
          imageData: formData.useImageUrl ? null : formData.imageData,
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");
      router.push("/admin");
    } catch (error) {
      setErrorMessage("Failed to update product.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <label className="block mb-2">Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="border p-2 w-full rounded mb-4"/>

        <label className="block mb-2">Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="border p-2 w-full rounded mb-4"/>

        <label className="block mb-2">Stock:</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="border p-2 w-full rounded mb-4"/>

        <label className="block mb-2">Description:</label>
        <textarea name="description" value={formData.description} onChange={handleInputChange} className="border p-2 w-full rounded mb-4"/>

        <label className="block mb-2">Product Image:</label>
        {/* Radio Buttons for Image Selection */}
<div className="flex items-center gap-4 mb-4">
  <input
    type="radio"
    id="useImageUrl"
    name="imageType"
    checked={formData.useImageUrl}
    onChange={() =>
      setFormData({
        ...formData,
        useImageUrl: true,
        imageUrl: formData.imageUrl || "", // ✅ Ensure empty string
        imageData: "", // ✅ Clear uploaded image
      })
    }
  />
  <label htmlFor="useImageUrl">Use Image URL</label>

  <input
    type="radio"
    id="uploadImage"
    name="imageType"
    checked={!formData.useImageUrl}
    onChange={() =>
      setFormData({
        ...formData,
        useImageUrl: false,
        imageUrl: "", // ✅ Clear URL field
        imageData: formData.imageData || "", // ✅ Ensure empty string
      })
    }
  />
  <label htmlFor="uploadImage">Upload Image</label>
</div>

{/* Image URL Input */}
{formData.useImageUrl && (
  <input
    type="text"
    name="imageUrl"
    value={formData.imageUrl} // ✅ Ensure it always has a string value
    onChange={handleInputChange}
    className="border p-2 w-full rounded mb-4"
    placeholder="Enter image URL"
  />
)}

{/* File Upload Input */}
{!formData.useImageUrl && (
  <input
    type="file"
    accept="image/*"
    onChange={handleFileUpload}
    className="border p-2 w-full rounded mb-4"
  />
)}


        <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          {loading ? "Updating..." : "Save Changes"}
        </button>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
}
