import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { cookies } from "next/headers"; // ✅ Import cookie handling

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser();
    const cookieStore = await cookies();
    const { productId } = await req.json(); // ✅ Expect productId in request body

    if (user) {
      // ✅ Logged-in User: Remove specific item from database cart
      await prisma.cartItem.deleteMany({
        where: {
          userId: user.id,
          productId,
        },
      });
    } else {
      // ✅ Guest: Remove specific item from guest cart stored in cookies
      const guestCart = cookieStore.get("guest_cart")?.value;
      let cart = guestCart ? JSON.parse(guestCart) : [];

      // Remove the item from the guest cart
      cart = cart.filter((item: { id: string }) => item.id !== productId);

      // Update the guest cart cookie
      cookieStore.set({
        name: "guest_cart",
        value: JSON.stringify(cart),
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        httpOnly: false,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error removing item from cart:", error);
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}
