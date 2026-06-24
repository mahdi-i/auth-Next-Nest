import { Card, CardContent } from "@/shared/components/shadcn/card";
import { AuthStep } from "../../assets/@types/types";
import AuthToast from "../ui/auth/AuthToast";
import LoginHeader from "../ui/auth/LoginHeader";
import OtpSendForm from "../ui/auth/OtpSendForm";
import VerifyForm from "../ui/auth/VerifyForm";
async function AuthComponents({
  searchParams,
}: {
  searchParams: Promise<{ step?: AuthStep; email?: string; password?: string }>;
}) {
  const { step = "send", email, password } = await searchParams;
  return (
    <>
      <AuthToast />
      <Card size="sm" className="max-w-md mx-auto ">
        <CardContent>
          <LoginHeader />
          {step === "send" ? (
            <OtpSendForm email={email} password={password} />
          ) : (
            <VerifyForm email={email ?? ""} />
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default AuthComponents;
