import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import Stripe from "stripe";
import { Address } from "@prisma/client";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: Request) {
//   try {
//     const {
//       cartItems,
//       total,
//       userId,
//       guestEmail,
//       billingAddressId,
//       shippingAddressId,
//       newShippingAddress,
//       newBillingAddress,
//       useSameAddress = true,
//     } = await req.json();

//     let finalBillingAddressId = billingAddressId;
//     let finalShippingAddressId = shippingAddressId;

//     console.log("📌 Checkout Payload:", { cartItems, total, userId, guestEmail });

//     // ✅ Get the user session
//     const user = await getSessionUser();
//     const isGuest = !user || !userId;

//     /** 🛑 Validate Address Data */
//     if (!newShippingAddress && !finalShippingAddressId) {
//       return NextResponse.json({ error: "Shipping address is required." }, { status: 400 });
//     }

//     /** ✅ Guest Checkout: Save Guest Address */
//     if (isGuest && newShippingAddress) {
//       const guestShipping = await prisma.address.create({
//         data: {
//           fullName: newShippingAddress.fullName,
//           email: guestEmail ?? "",
//           phone: newShippingAddress.phone,
//           address: newShippingAddress.address,
//           city: newShippingAddress.city,
//           state: newShippingAddress.state,
//           zip: newShippingAddress.zip,
//         },
//       });

//       finalShippingAddressId = guestShipping.id;

//       if (useSameAddress) {
//         finalBillingAddressId = guestShipping.id;
//       } else if (newBillingAddress) {
//         const guestBilling = await prisma.address.create({
//           data: {
//             fullName: newBillingAddress.fullName,
//             email: guestEmail ?? "",
//             phone: newBillingAddress.phone,
//             address: newBillingAddress.address,
//             city: newBillingAddress.city,
//             state: newBillingAddress.state,
//             zip: newBillingAddress.zip,
//           },
//         });

//         finalBillingAddressId = guestBilling.id;
//       }
//     }

//     /** ✅ Logged-in User: Save New Addresses if Needed */
//     if (!isGuest) {
//       if (!shippingAddressId && newShippingAddress) {
//         const createdShipping = await prisma.address.create({
//           data: {
//             fullName: newShippingAddress.fullName,
//             email: user?.email ?? "",
//             phone: newShippingAddress.phone,
//             address: newShippingAddress.address,
//             city: newShippingAddress.city,
//             state: newShippingAddress.state,
//             zip: newShippingAddress.zip,
//             userId: user.id,
//           },
//         });
//         finalShippingAddressId = createdShipping.id;
//       }

//       if (!billingAddressId && !useSameAddress && newBillingAddress) {
//         const createdBilling = await prisma.address.create({
//           data: {
//             fullName: newBillingAddress.fullName,
//             email: user?.email ?? "",
//             phone: newBillingAddress.phone,
//             address: newBillingAddress.address,
//             city: newBillingAddress.city,
//             state: newBillingAddress.state,
//             zip: newBillingAddress.zip,
//             userId: user.id,
//           },
//         });
//         finalBillingAddressId = createdBilling.id;
//       }
//     }

//     // ✅ Ensure Billing Address is assigned if missing
//     if (useSameAddress && !finalBillingAddressId) {
//       finalBillingAddressId = finalShippingAddressId;
//     }

//     /** 🛑 Final Validation Before Order Creation */
//     if (!finalBillingAddressId || !finalShippingAddressId) {
//       console.error("🚨 Missing Address", { finalBillingAddressId, finalShippingAddressId });
//       return NextResponse.json({ error: "Missing billing or shipping address." }, { status: 400 });
//     }

//     /** ✅ Verify Cart Total Before Creating Order */
//     const verifiedTotal = cartItems.reduce(
//       (acc: number, item: any) => acc + item.product.price * item.quantity,
//       0
//     );

//     if (verifiedTotal !== total) {
//       console.error("🚨 Mismatch in cart total!", { verifiedTotal, total });
//       return NextResponse.json({ error: "Cart total mismatch. Please try again." }, { status: 400 });
//     }

//     console.log("✅ Final Checkout Data:", {
//       userId: user?.id || "Guest",
//       guestEmail,
//       total: verifiedTotal,
//       shipping: finalShippingAddressId,
//       billing: finalBillingAddressId,
//       cartItems: cartItems.length,
//     });

//     /** ✅ Create Order in Database */
//     const order = await prisma.order.create({
//       data: {
//         userId: user?.id || null,
//         guestEmail: isGuest ? guestEmail : null,
//         total,
//         status: "pending",
//         billingAddressId: finalBillingAddressId,
//         shippingAddressId: finalShippingAddressId,
//         orderItems: {
//           create: cartItems.map((item: any) => ({
//             productId: item.product.id,
//             quantity: item.quantity,
//             priceAtPurchase: item.product.price,
//           })),
//         },
//       },
//     });

//     console.log("✅ Order Created:", order.id);

//     /** ✅ Create Stripe Checkout Session */
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       customer_email: guestEmail || user?.email,
//       success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?orderId=${order.id}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
//       line_items: cartItems.map((item: any) => ({
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item.product.name,
//           },
//           unit_amount: Math.round(item.product.price * 100), // Convert to cents
//         },
//         quantity: item.quantity,
//       })),
//       metadata: {
//         orderId: order.id, // ✅ Store Order ID in Stripe Metadata
//       },
//     });

//     console.log("✅ Stripe Session Created:", session.id);

//     return NextResponse.json({ success: true, sessionId: session.id, checkoutUrl: session.url }, { status: 201 });

//   } catch (error) {
//     console.error("❌ Checkout Error:", error);
//     return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
//   }
// }


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const {
      cartItems,
      total,
      userId,
      guestEmail,
      billingAddressId,
      shippingAddressId,
      newShippingAddress,
      newBillingAddress,
      useSameAddress = true,
    }: {
      cartItems: CartItem[];
      total: number;
      userId?: string;
      guestEmail?: string;
      billingAddressId?: string;
      shippingAddressId?: string;
      newShippingAddress?: Address;
      newBillingAddress?: Address;
      useSameAddress?: boolean;
    } = await req.json();

    let finalBillingAddressId = billingAddressId;
    let finalShippingAddressId = shippingAddressId;

    const user = await getSessionUser();
    const isGuest = !user || !userId;

    if (!newShippingAddress && !finalShippingAddressId) {
      return NextResponse.json({ error: "Shipping address is required." }, { status: 400 });
    }

    /** ✅ Guest Checkout: Save Guest Address */
    if (isGuest && newShippingAddress) {
      const guestShipping = await prisma.address.create({
        data: {
          fullName: newShippingAddress.fullName,
          email: guestEmail ?? "",
          phone: newShippingAddress.phone,
          address: newShippingAddress.address,
          city: newShippingAddress.city,
          state: newShippingAddress.state,
          zip: newShippingAddress.zip,
        },
      });

      finalShippingAddressId = guestShipping.id;

      if (useSameAddress) {
        finalBillingAddressId = guestShipping.id;
      } else if (newBillingAddress) {
        const guestBilling = await prisma.address.create({
          data: {
            fullName: newBillingAddress.fullName,
            email: guestEmail ?? "",
            phone: newBillingAddress.phone,
            address: newBillingAddress.address,
            city: newBillingAddress.city,
            state: newBillingAddress.state,
            zip: newBillingAddress.zip,
          },
        });

        finalBillingAddressId = guestBilling.id;
      }
    }

    /** ✅ Verify Cart Total */
    const verifiedTotal = cartItems.reduce(
      (acc: number, item: CartItem) => acc + item.product.price * item.quantity,
      0
    );

    if (verifiedTotal !== total) {
      return NextResponse.json({ error: "Cart total mismatch. Please try again." }, { status: 400 });
    }

    /** ✅ Create Order in Database */
    const order = await prisma.order.create({
      data: {
        userId: user?.id || null,
        guestEmail: isGuest ? guestEmail : null,
        total,
        status: "pending",
        billingAddressId: finalBillingAddressId,
        shippingAddressId: finalShippingAddressId,
        orderItems: {
          create: cartItems.map((item: CartItem) => ({
            productId: item.product.id,
            quantity: item.quantity,
            priceAtPurchase: item.product.price,
          })),
        },
      },
    });

    /** ✅ Create Stripe Checkout Session */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: guestEmail || user?.email,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/confirmation?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      line_items: cartItems.map((item: CartItem) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
          },
          unit_amount: Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json(
      { success: true, sessionId: session.id, checkoutUrl: session.url },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Checkout Error:", error);
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
  }
}

