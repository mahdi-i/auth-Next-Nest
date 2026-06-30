import { P } from "@/shared/components/custom/ui/typography/typography";
import { useEffect, useState } from "react";

function ResendTimer() {
  const [seconds, setSeconds] = useState(120);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  return (
    <P className="text-center text-xs text-muted-foreground">
      {seconds > 0 ? (
        `ارسال مجدد کد تا ${seconds} ثانیه دیگر`
      ) : (
        <button
          type="button"
          className="text-primary font-medium hover:underline"
        >
          ارسال مجدد کد
        </button>
      )}
    </P>
  );
}
export default ResendTimer;
