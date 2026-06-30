import { sendOtpAction } from "@/features/auth/actions/sendOtpAction";
import { P, Small } from "@/shared/components/custom/ui/typography/typography";
import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";
import Form from "next/form";
import { PasswordInput } from "./PasswordInput";

export default function OtpSendForm({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  return (
    <Form action={sendOtpAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">ایمیل</label>

        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          defaultValue={email}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">رمز عبور</label>

        <PasswordInput
          name="password"
          defaultValue={password}
          placeholder="••••••••"
          className="h-11"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-2 h-11 w-full rounded-xl font-medium"
      >
        ورود
      </Button>

      <Small className="text-center">
        با ورود، قوانین و حریم خصوصی را می‌پذیرید.
      </Small>
    </Form>
  );
}
