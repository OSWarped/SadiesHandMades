import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { cookies } from "next/headers"; // ✅ Import cookie handling

export async function DELETE() {
  try {
    const user = await getSessionUser();
    const cookieStore = await cookies(); // ✅ Get cookies

    if (user) {
      // ✅ Logged-in User: Clear database cart
      await prisma.cartItem.deleteMany({
        where: { userId: user.id },
      });
    } else {
      // ✅ Guest: Clear guest cart stored in cookies
      cookieStore.set({
        name: "guest_cart",
        value: "", // Empty cart data
        path: "/",
        maxAge: 0, // Expire immediately
        httpOnly: false, // Allow client-side access
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
