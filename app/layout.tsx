import type { Metadata } from "next";
import "./globals.css"; // ✅ Global styles
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { CartProvider } from "@/context/CartContext"; // ✅ Import CartProvider

export const metadata: Metadata = {
  title: "Sadie’s Handmades",
  description: "Handmade Slime & Crafts – Shop Unique Creations!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#E8EAF6] text-[#222831]">
        <CartProvider> {/* ✅ Wrap everything inside CartProvider */}
          <Navbar />
          <main className="min-h-screen mx-auto max-w-7xl p-6">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
