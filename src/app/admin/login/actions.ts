"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Fallback for dev

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin-session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Incorrect password" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-session");
  redirect("/");
}
