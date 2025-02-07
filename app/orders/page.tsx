"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  userId: string | null;
  guestEmail?: string;
  total: number;
  status: "pending" | "completed" | "cancelled"; // Adjust statuses as needed
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  orderItems: OrderItem[];
}


export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded-lg shadow-md">
              <b>Order ID:</b> {order.id} - <b>Total:</b> ${Number(order.total).toFixed(2)}
              <br />
              <small>{new Date(order.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
