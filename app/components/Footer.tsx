import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#E8EAF6] text-[#222831] p-6">
      <div className="container mx-auto text-center">
        {/* Newsletter Section */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold">🌟 Handmade with Love</h3>
          <p className="text-sm">Join our newsletter for exclusive discounts!</p>
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border rounded mt-2"
          />
          <button className="bg-[#5E35B1] text-white px-4 py-2 rounded ml-2">
            Subscribe
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-6 my-4">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/shipping">Shipping Info</Link>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-4 text-xl">
          <a href="https://instagram.com" target="_blank">📸 IG</a>
          <a href="https://tiktok.com" target="_blank">🎥 TikTok</a>
          <a href="https://facebook.com" target="_blank">📘 Facebook</a>
        </div>

        {/* Copyright */}
        <p className="text-sm mt-4">© 2024 Sadie’s Handmades | Powered by Next.js</p>
      </div>
    </footer>
  );
}
