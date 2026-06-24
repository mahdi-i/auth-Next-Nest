"use client";
import { H2, Small } from "@/shared/components/custom/ui/typography/typography";
import { useSearchParams } from "next/navigation";
import { AuthStep } from "../../../assets/@types/types";

function LoginHeader() {
  const searchParams = useSearchParams();

  const step = (searchParams.get("step") as AuthStep) ?? "send";
  const email = searchParams.get("email") ?? "";
  const titles = {
    send: "Welcome Back",
    verify: "Verify Code",
  };

  const subtitles = {
    send: "Enter your email and password to login",
    verify: `A verification code has been sent to ${email}`,
  };

  return (
    <div className="text-center mb-5">
      <H2>{titles[step]}</H2>
      <Small className="">{subtitles[step]}</Small>
    </div>
  );
}

export default LoginHeader;
