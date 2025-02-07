"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

interface Order {
  id: string;
  total: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login"); // Redirect if not logged in
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchUserData();
    fetchOrders();
  }, [router]);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h2>

        {/* Order History */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Your Recent Orders</h3>
          {orders.length > 0 ? (
            <ul className="border rounded-lg p-4 space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="border-b pb-2 last:border-none">
                  <span className="font-medium">Order #{order.id}</span> - ${order.total.toFixed(2)} -{" "}
                  <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No orders yet.</p>
          )}
        </section>

        {/* Cart & Shop Links */}
        <div className="flex space-x-4">
         
          <Link href="/cart" passHref>
  <div className="bg-[#5E35B1] text-white px-4 py-2 rounded hover:bg-[#4527A0]">
  View Cart
  </div>
</Link>
          <Link href="/shop" passHref>
  <div className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
    Shop More
  </div>
</Link>
        </div>

        {/* Admin Section (Visible only if user is admin) */}
        {user.isAdmin && (
          <div className="mt-8 p-4 border-t">
            <h3 className="text-xl font-semibold mb-2">Admin Panel</h3>
           
            <Link href="/admin" passHref>
  <div className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
  Manage Store
  </div>
</Link>
          </div>
        )}
      </div>
    </div>
  );
}
