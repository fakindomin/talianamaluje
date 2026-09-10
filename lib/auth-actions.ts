"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { STUDIO_COOKIE, sha256 } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") || "");
  const expected = process.env.STUDIO_PASSWORD;

  if (!expected || password !== expected) {
    redirect("/login?error=1");
  }

  const token = await sha256(expected);
  const jar = await cookies();
  jar.set(STUDIO_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  redirect("/studio");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(STUDIO_COOKIE);
  redirect("/login");
}
