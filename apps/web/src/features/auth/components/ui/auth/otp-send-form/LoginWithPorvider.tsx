import { signInWithGithubAction } from "@/features/auth/actions/signInWithGithubAction";
import { signInWithGoogleAction } from "@/features/auth/actions/signInWithGoogleAction";
import { Button } from "@/shared/components/shadcn/button";
import Form from "next/form";
import GithubIcon from "../icons/GithubIcon";
import GoogleIcon from "../icons/GoogleIcon";

function LoginWithPorvider() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Form action={signInWithGoogleAction}>
        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="h-11 w-full rounded-xl font-medium gap-2"
        >
          <GoogleIcon className="h-4 w-4" />
          گوگل
        </Button>
      </Form>

      <Form action={signInWithGithubAction}>
        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="h-11 w-full rounded-xl font-medium gap-2"
        >
          <GithubIcon className="h-4 w-4" />
          گیت‌ هاب
        </Button>
      </Form>
    </div>
  );
}

export default LoginWithPorvider;
