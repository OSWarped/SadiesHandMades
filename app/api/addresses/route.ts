import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// ✅ GET: Fetch all addresses for the logged-in user
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(addresses, { status: 200 });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// ✅ POST: Add a new address for the user
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, email, address, city, state, zip, phone } = await req.json();

    if (!fullName || !email || !address || !city || !state || !zip || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        fullName,
        email,
        address,
        city,
        state,
        zip,
        phone
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 });
  }
}

// ✅ PUT: Update an existing address
export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, fullName, email, address, city, state, zip } = await req.json();

    if (!id || !fullName || !email || !address || !city || !state || !zip) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { fullName, email, address, city, state, zip },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}
