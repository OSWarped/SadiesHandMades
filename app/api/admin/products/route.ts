import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}


export async function POST(req: Request) {
  try {
    const { name, price, imageUrl, imageData, description, stock } = await req.json();

    // ✅ Validate input
    if (!name || !price || !description || stock === undefined) {
      return NextResponse.json({ error: "All fields except images are required" }, { status: 400 });
    }

    if (!imageUrl && !imageData) {
      return NextResponse.json({ error: "Either imageUrl or imageData is required" }, { status: 400 });
    }

    // ✅ Convert `price` to Decimal & `stock` to Int
    const parsedPrice = new Prisma.Decimal(price);
    const parsedStock = parseInt(stock, 10);

    if (isNaN(parsedStock)) {
      return NextResponse.json({ error: "Stock must be a valid integer" }, { status: 400 });
    }

    // ✅ Store product in the database with either imageUrl or imageData
    const product = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        imageUrl: imageUrl || null, // ✅ Prioritize URL
        imageData: imageUrl ? null : imageData || null, // ✅ Store Base64 only if no URL is given
        description,
        stock: parsedStock,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("❌ Prisma Error:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error },
      { status: 500 }
    );
  }
}