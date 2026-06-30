import { Button } from "@/shared/components/shadcn/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="h-11 w-full rounded-xl font-medium"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "ورود"}
    </Button>
  );
}

export default SubmitButton;
