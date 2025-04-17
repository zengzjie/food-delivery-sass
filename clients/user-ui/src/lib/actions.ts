"use server";

import { signIn, signOut } from "@/auth-server";
import { AuthError } from "next-auth";

/**
 * @description: Google login
 * @return {*}
 */
export async function googleAuthenticate(from: string) {
  try {
    await signIn("google", {
      callbackUrl: from,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "google log in failed";
    }
    throw error;
  }
}

/**
 * @description: Google logout
 * @return {*}
 */
export async function googleLogout() {
  try {
    await signOut({
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "google log out failed";
    }
    throw error;
  }
}
