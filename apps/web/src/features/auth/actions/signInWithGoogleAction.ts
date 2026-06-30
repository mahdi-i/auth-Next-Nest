// features/auth/actions/signInWithGoogleAction.ts
"use server";
import { redirect } from "next/navigation";

export async function signInWithGoogleAction() {
  // اگه NextAuth داری:
  // const { signIn } = await import("@/auth");
  // await signIn("google");

  redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
}
