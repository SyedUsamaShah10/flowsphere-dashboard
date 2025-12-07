// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const TOKEN_NAME = "saasify_token";

export interface JwtPayload {
  id: string;
  email: string;
  role: "admin" | "user";
  name: string;
}

export function signToken(payload: JwtPayload) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not set");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    if (!process.env.JWT_SECRET) return null;
    return jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(payload: JwtPayload) {
  const token = signToken(payload);
  const cookieStore = await cookies(); 

  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies(); 

  cookieStore.set(TOKEN_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getUserFromCookie(): Promise<JwtPayload | null> {
  const cookieStore = await cookies(); 
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}