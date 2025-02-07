import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { cookies } from "next/headers"; 

// ✅ Type Definitions
interface GuestCartItem {
  id: string;
  quantity: number;
}

interface PopulatedCartItem extends GuestCartItem {
  product: {
    id: string;
    name: string;
    price: number;
  } | null;
}

// ✅ Fetch guest cart (handles invalid JSON)
async function getGuestCart(): Promise<GuestCartItem[]> {
  try {
    const cookieStore = await cookies();
    const guestCart = cookieStore.get("guest_cart")?.value;
    return guestCart ? JSON.parse(guestCart) : [];
  } catch (error) {
    console.error("❌ Error parsing guest cart JSON:", error);
    return [];
  }
}

// ✅ Save guest cart (limit size)
async function saveGuestCart(cart: GuestCartItem[]) {
  const cookieStore = await cookies();
  if (cart.length > 10) {
    console.warn("⚠️ Guest cart size exceeded limit, trimming...");
    cart = cart.slice(0, 10);
  }
  await cookieStore.set({
    name: "guest_cart",
    value: JSON.stringify(cart),
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: false,
  });
}

// ✅ GET: Fetch cart items
export async function GET() {
  try {
    const user = await getSessionUser();

    if (user) {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true },
      });

      return NextResponse.json(
        cartItems.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
          product: {
            ...item.product,
            price: Number(item.product.price),
          },
        })),
        { status: 200 }
      );
    }

    const guestCart = await getGuestCart();

    const populatedCart: PopulatedCartItem[] = await Promise.all(
      guestCart.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.id },
        });
        return {
          id: item.id,
          quantity: item.quantity,
          product: product
            ? { ...product, price: Number(product.price) }
            : null,
        };
      })
    );

    return NextResponse.json(populatedCart, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// ✅ POST: Add item to cart
export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json();
    const user = await getSessionUser();
    
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (user) {
      const cartItem = await prisma.cartItem.upsert({
        where: { userId_productId: { userId: user.id, productId } },
        update: { quantity: { increment: quantity } },
        create: { userId: user.id, productId, quantity },
      });
      return NextResponse.json(cartItem, { status: 201 });
    }

    const guestCart = await getGuestCart();
    const existingItem = guestCart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      guestCart.push({ id: productId, quantity });
    }

    await saveGuestCart(guestCart);
    return NextResponse.json({ message: "Added to cart" }, { status: 201 });

  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

// ✅ DELETE: Remove item from cart
export async function DELETE(req: Request) {
  try {
    const { productId } = await req.json();
    const user = await getSessionUser();

    if (user) {
      await prisma.cartItem.delete({
        where: { userId_productId: { userId: user.id, productId } },
      });
      return NextResponse.json({ message: "Item removed" }, { status: 200 });
    }

    let guestCart = await getGuestCart();
    guestCart = guestCart.filter((item) => item.id !== productId);
    await saveGuestCart(guestCart);

    return NextResponse.json({ message: "Item removed" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error removing item:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
