import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client"; // ✅ Import Prisma & Decimal
const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      
      where: { id: id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string } >}) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, price, stock, description, imageUrl, imageData } = await req.json();

    // ✅ Ensure all required fields are provided
    if (!name || !price || stock === undefined || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // ✅ Convert `price` to Decimal and `stock` to Int
    const parsedPrice = new Prisma.Decimal(price);
    const parsedStock = parseInt(stock, 10);

    if (isNaN(parsedStock)) {
      return NextResponse.json({ error: "Stock must be a valid integer" }, { status: 400 });
    }

    // ✅ Fetch existing product to keep previous values if not updated
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ✅ Allow either `imageUrl` or `imageData` (Base64) to be updated
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        price: parsedPrice,
        stock: parsedStock,
        description,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl, // ✅ Keep existing if not updated
        imageData: imageData !== undefined ? imageData : existingProduct.imageData, // ✅ Keep existing if not updated
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("❌ Update Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
