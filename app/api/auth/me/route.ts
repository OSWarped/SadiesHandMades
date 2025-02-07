import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "../../../../lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser(); // ✅ Await the session fetch

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch user details from the database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, isAdmin: true },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
