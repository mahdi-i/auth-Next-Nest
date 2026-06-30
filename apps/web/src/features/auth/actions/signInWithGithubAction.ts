// features/auth/actions/signInWithGithubAction.ts
"use server";
import { redirect } from "next/navigation";

export async function signInWithGithubAction() {
  // اگه از NextAuth استفاده می‌کنی:
  // const { signIn } = await import("@/auth");
  // await signIn("github");

  redirect(`${process.env.NEXT_PUBLIC_API_URL}/auth/github`);
}
