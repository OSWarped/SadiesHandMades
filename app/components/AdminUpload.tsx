"use client";
import Image from "next/image";
import { useState } from "react";


export default function AdminUpload({ onImageUpload }: { onImageUpload: (data: { base64?: string; url?: string }) => void }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const resizedBase64 = await resizeAndConvertToBase64(file);
    setImagePreview(resizedBase64);
    onImageUpload({ base64: resizedBase64 }); // Send Base64 data
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value);
    onImageUpload({ url: event.target.value }); // Send URL data
    setImagePreview(event.target.value); // Preview URL image
  };

  return (
    <div className="mt-4">
      <p className="text-lg font-semibold">Upload Image or Use a URL:</p>
      <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
      <p className="text-center">OR</p>
      <input
        type="text"
        placeholder="Enter Image URL"
        value={imageUrl}
        onChange={handleUrlChange}
        className="border p-2 rounded w-full"
      />
      {imagePreview && <Image
    src={imagePreview}
    alt="Preview"
    width={128} // Equivalent to w-32 (32 * 4 = 128px)
    height={128} // Equivalent to h-32 (32 * 4 = 128px)
    className="object-cover border rounded-lg mt-2"
  />}
    </div>
  );
}

/** 🔥 Resize Image & Convert to Base64 */
async function resizeAndConvertToBase64(file: File, maxWidth = 300, maxHeight = 300) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height *= maxWidth / width;
            width = maxWidth;
          } else {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.8)); // Convert to Base64
      };
    };
    reader.onerror = (error) => reject(error);
  });
}
