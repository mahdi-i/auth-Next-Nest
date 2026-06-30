import { verifyOtpAction } from "@/features/auth/actions/verifyOtpAction";
import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";
import Form from "next/form";
import { useState } from "react";
import SubmitButton from "../SubmitButton";
import OtpInputField from "./OtpInputField";
import ResendTimer from "./ResendTimer";

function VerifyFormInputs({ email }: { email: string }) {
  const [otpCode, setOtpCode] = useState("");

  return (
    <Form action={verifyOtpAction} className="space-y-6">
      <Input type="hidden" name="email" value={email} />
      <Input type="hidden" name="code" value={otpCode} />

      <OtpInputField value={otpCode} onChange={setOtpCode} length={6} />

      <ResendTimer />

      <div className="space-y-2">
        <SubmitButton />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
        >
          ← بازگشت به مرحله ورود
        </Button>
      </div>
    </Form>
  );
}

export default VerifyFormInputs;
