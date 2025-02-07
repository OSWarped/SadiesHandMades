import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text(); // Read raw body for signature verification
  const reqHeaders = await headers(); // ✅ Await headers in Next.js 15+
  const sig = reqHeaders.get("stripe-signature");

  if (!sig) {
    console.error("❌ Stripe signature missing.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  console.log("✅ Stripe Webhook Received:", event.type);

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    default:
      console.warn(`⚠️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

/** ✅ Handle Successful Checkout */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("📌 Processing payment for session:", session.id);

  const orderId = session.metadata?.orderId; // Retrieve order ID from metadata
  if (!orderId) {
    console.error("❌ No order ID found in session metadata");
    return;
  }

  try {
    // ✅ Mark order as paid in the database
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "paid" },
    });

    console.log("✅ Order marked as paid:", updatedOrder.id);
  } catch (error) {
    console.error("❌ Error updating order:", error);
  }
}
