import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params; // Get productId from URL

    // ✅ Ensure the cart item exists before trying to delete it
    const cartItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // ✅ Delete the cart item using the composite key
    await prisma.cartItem.delete({
      where: { userId_productId: { userId: user.id, productId } },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
