import { P } from "@/shared/components/custom/ui/typography/typography";

function HeadVerifyForm({ email }: { email: string }) {
  return (
    <div className="text-center space-y-1.5">
      <h1 className="text-xl font-semibold tracking-tight">کد رو وارد کن</h1>
      <P className="text-sm text-muted-foreground">
        یه کد تأیید به {email} ارسال شد
      </P>
    </div>
  );
}

export default HeadVerifyForm;
