"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Secret key for JWT signing - in production, use environment variable
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "spanelstina-brno-admin-secret-key-2024"
);

// Admin password - in production, store only the hash in environment variables
// Password: "spanelstina2024"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "spanelstina2024";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

/**
 * Hash a password using Web Crypto API (SHA-256)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify password using timing-safe comparison
 */
export async function verifyPassword(password: string): Promise<boolean> {
  // Hash both passwords and compare
  const inputHash = await hashPassword(password);
  const storedHash = await hashPassword(ADMIN_PASSWORD);

  // Use timing-safe comparison to prevent timing attacks
  if (inputHash.length !== storedHash.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < inputHash.length; i++) {
    result |= inputHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Create a JWT token
 */
export async function createToken(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Set authentication cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Remove authentication cookie
 */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get authentication cookie value
 */
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthCookie();
  if (!token) {
    return false;
  }
  return verifyToken(token);
}
