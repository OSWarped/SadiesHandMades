import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function getAdminUser() {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get("auth_token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, isAdmin: true },
    });

    return user?.isAdmin ? user : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSessionUser() {
    const cookieStore = await cookies();
    const token = await cookieStore.get("auth_token")?.value; // Await cookies correctly
  
    if (!token) return null;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      return prisma.user.findUnique({ where: { id: decoded.id } });
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }
