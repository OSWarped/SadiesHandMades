"use client";


import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
  user?: { name: string; email: string };
  guestEmail?: string;
  orderItems: { product: { name: string }; quantity: number; priceAtPurchase: number }[];
  billingAddress?: { fullName: string; address: string; city: string; state: string; zip: string };
  shippingAddress?: { fullName: string; address: string; city: string; state: string; zip: string };
}

export default function OrderDetails() {
  //const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  async function handleUpdateStatus() {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      alert("Order status updated!");
    } catch (error) {
        console.error(error);
      setErrorMessage("Failed to update order");
    }
  }

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <p>Status: {order.status}</p>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2">
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
      <button onClick={handleUpdateStatus} className="bg-blue-500 text-white p-2">Update</button>
    </div>
  );
}
