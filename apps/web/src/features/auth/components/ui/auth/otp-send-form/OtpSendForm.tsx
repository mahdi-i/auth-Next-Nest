"use client";
import { Small } from "@/shared/components/custom/ui/typography/typography";
import HeadTitleAuth from "./HeadTitleAuth";
import LoginAuthWithForm from "./LoginAuthWithForm";
import LoginWithPorvider from "./LoginWithPorvider";

export default function OtpSendForm({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  return (
    <div className="space-y-6">
      <HeadTitleAuth />
      <LoginWithPorvider />
      <LoginAuthWithForm email={email} password={password} />
      <Small className="text-center block">
        با ورود، قوانین و حریم خصوصی را می‌ پذیرید.
      </Small>
    </div>
  );
}
