import { sendOtpAction } from "@/features/auth/actions/sendOtpAction";
import { Input } from "@/shared/components/shadcn/input";
import { ArrowRight, Mail } from "lucide-react";
import Form from "next/form";
import { useState } from "react";
import { PasswordInput } from "./PasswordInput";
import SubmitButton from "../SubmitButton";
function LoginAuthWithForm({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  const [showEmailForm, setShowEmailForm] = useState(!!email || !!password);

  return (
    <>
      {!showEmailForm ? (
        <button
          type="button"
          onClick={() => setShowEmailForm(true)}
          className="group flex w-full items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="h-4 w-4" />
          ورود با ایمیل
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </button>
      ) : (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">
                یا با ایمیل
              </span>
            </div>
          </div>

          <Form
            action={sendOtpAction}
            className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">ایمیل</label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={email}
                className="h-11"
                autoComplete="email"
                autoFocus
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

            <SubmitButton />
          </Form>
        </>
      )}
    </>
  );
}

export default LoginAuthWithForm;
