import { NextResponse } from "next/server";
import Stripe from "stripe";

interface Product {
    id: string;
    name: string;
    price: number;
  }
  
  interface CartItem {
    product: Product;
    quantity: number;
  }
  

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { cartItems, userId, guestEmail, shippingAddressId, billingAddressId } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ✅ Convert cart items into Stripe line items
    const lineItems = cartItems.map((item: CartItem) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.product.name },
          unit_amount: Math.round(item.product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      }));
      
    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: guestEmail || undefined, // Optional for guests
      metadata: {
        userId: userId || "guest",
        shippingAddressId,
        billingAddressId,
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });

  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 });
  }
}
