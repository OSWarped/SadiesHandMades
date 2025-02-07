import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ GET: Fetch all products
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json
    ({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// ✅ POST: Add a new product (Admin only)
export async function POST(req: Request) {
  try {
    const { name, description, price, stock, imageUrl, imageData } = await req.json();

    if (!name || !price || stock == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: { name, description, price, stock, imageUrl, imageData },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
