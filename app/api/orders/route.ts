import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET: Fetch all orders (Admin only)
export async function GET() {
  try {
    const userId = "guest"; // Replace with actual user authentication from cookies/session
    const orders = await prisma.order.findMany({
      where: { userId },
      select: { id: true, total: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}

// ✅ POST: Create a new order
export async function POST(req: Request) {
  try {
    const { items, total, guestEmail } = await req.json();

    if (!items || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        total,
        guestEmail,
        orderItems: {
          create: items.map((item: { productId: string; quantity: number; priceAtPurchase: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
