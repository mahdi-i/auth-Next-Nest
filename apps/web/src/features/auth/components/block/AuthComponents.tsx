import { Card, CardContent } from "@/shared/components/shadcn/card";
import { AuthStep } from "../../assets/@types/types";
import AuthToast from "../ui/auth/AuthToast";
import OtpSendForm from "../ui/auth/otp-send-form/OtpSendForm";
import VerifyForm from "../ui/auth/verify-form/VerifyForm";

async function AuthComponents({
  searchParams,
}: {
  searchParams: Promise<{ step?: AuthStep; email?: string; password?: string }>;
}) {
  const { step = "send", email, password } = await searchParams;

  return (
    <>
      <AuthToast />
      <Card className=" w-full max-w-md rounded-3xl border-border/50 bg-background/70 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-10">
          <div
            key={step}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {step === "send" ? (
              <OtpSendForm email={email} password={password} />
            ) : (
              <VerifyForm email={email ?? ""} />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default AuthComponents;
