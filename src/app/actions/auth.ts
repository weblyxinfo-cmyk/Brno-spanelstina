"use server";

import {
  verifyPassword,
  createToken,
  setAuthCookie,
  removeAuthCookie,
  isAuthenticated,
} from "@/lib/auth";
import { redirect } from "next/navigation";

export interface AuthResult {
  success: boolean;
  error?: string;
}

/**
 * Login action - validates password and sets session cookie
 */
export async function login(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const password = formData.get("password") as string;

  if (!password) {
    return {
      success: false,
      error: "Heslo je povinne",
    };
  }

  const isValid = await verifyPassword(password);

  if (!isValid) {
    // Add a small delay to prevent brute force attacks
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: false,
      error: "Nespravne heslo",
    };
  }

  const token = await createToken();
  await setAuthCookie(token);

  return {
    success: true,
  };
}

/**
 * Logout action - removes session cookie and redirects to login
 */
export async function logout(): Promise<void> {
  await removeAuthCookie();
  redirect("/admin/login");
}

/**
 * Check authentication status
 */
export async function checkAuth(): Promise<boolean> {
  return isAuthenticated();
}
