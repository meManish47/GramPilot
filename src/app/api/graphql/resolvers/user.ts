import { verifyToken } from "@/services/jwt";
import prismaClient from "@/services/prisma";
import { cookies } from "next/headers";

export default async function createUser(
  parent: unknown,
  args: { name: string; email: string; password: string }
) {
  try {
    const user = await prismaClient.user.create({ data: args });
    if (user) {
      return { success: true, message: "User created" };
    }
    return { success: false, message: "Not created" };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function currentUser() {
  try {
    const userCookies = await cookies();
    const token = userCookies.get("token")?.value;

    if (!token) return null;
    const decoded = await verifyToken(token);

    const user = await prismaClient.user.findUnique({
      where: { email: decoded },
    });
    if (!user) return null;
    return user;
  } catch (error) {
    return null;
  }
}
