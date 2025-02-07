"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        if (!data.isAdmin) {
          router.push("/");
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        router.push("/");
      }
    };

    checkAdmin();
  }, [router]);

  if (isAdmin === null) return <p>Loading...</p>;

  return (
    <section className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* ✅ Admin Navigation Buttons */}
      <div className="flex justify-center gap-4">
        <Link href="/admin/orders">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            View Orders
          </button>
        </Link>

        <Link href="/admin/products">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Manage Products
          </button>
        </Link>
      </div>
    </section>
  );
}
