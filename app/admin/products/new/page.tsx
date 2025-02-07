"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    imageData: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageData: reader.result?.toString().split(",")[1] || "" });
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          stock: formData.stock,
          description: formData.description,
          imageUrl: imageMode === "url" ? formData.imageUrl : null,
          imageData: imageMode === "upload" ? formData.imageData : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create product");

      router.push("/admin/products");
    } catch (error) {
      setErrorMessage("Failed to create product.");
      console.error("Create error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Add New Product</h1>

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
        <div className="flex space-x-4 mb-4">
          <button 
            type="button" 
            onClick={() => setImageMode("url")} 
            className={`px-4 py-2 rounded-lg ${imageMode === "url" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            Use Image URL
          </button>
          <button 
            type="button" 
            onClick={() => setImageMode("upload")} 
            className={`px-4 py-2 rounded-lg ${imageMode === "upload" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          >
            Upload Image
          </button>
        </div>

        {imageMode === "url" ? (
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="border p-2 w-full rounded mb-4"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="border p-2 w-full rounded mb-4"
          />
        )}

{formData.imageUrl && imageMode === "url" && (
  <Image 
    src={formData.imageUrl} 
    alt="Product Image" 
    width={400}     // ✅ Define image dimensions
    height={300} 
    className="w-full max-w-xs rounded-lg mb-4" 
  />
)}

{formData.imageData && imageMode === "upload" && (
  <Image 
    src={`data:image/png;base64,${formData.imageData}`} 
    alt="Uploaded Image" 
    width={400}     // ✅ Define image dimensions
    height={300} 
    className="w-full max-w-xs rounded-lg mb-4" 
  />
)}

        <button onClick={handleCreateProduct} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          {loading ? "Creating..." : "Add Product"}
        </button>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
}
