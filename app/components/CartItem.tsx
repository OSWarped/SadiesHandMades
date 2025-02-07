"use client"; // ✅ This tells Next.js it's a Client Component

import { useState } from "react";
import Image from "next/image";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    onUpdateQuantity?.(item.id, newQuantity);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
      <Image 
  src={item.image} 
  alt={item.name} 
  width={64} 
  height={64} 
  className="rounded-lg object-cover" 
/>
      <div className="flex-1 px-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-500">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center">
        <button
          className="px-2 py-1 bg-gray-300 rounded-md"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          ➖
        </button>
        <span className="px-3">{quantity}</span>
        <button
          className="px-2 py-1 bg-gray-300 rounded-md"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          ➕
        </button>
      </div>
      <button
        className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md"
        onClick={() => onRemove?.(item.id)}
      >
        ❌
      </button>
    </div>
  );
}
