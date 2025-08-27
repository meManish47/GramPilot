"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function generateToken(email: string) {
  const userCookies = await cookies();
  const token = jwt.sign(email, process.env.JWT_SECRET as string);
  userCookies.set("token", token);
}

export async function deleteCookies() {
  const userCookies = await cookies();
  userCookies.delete("token");
}
export async function verifyToken(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as string;

  return decoded;
}
