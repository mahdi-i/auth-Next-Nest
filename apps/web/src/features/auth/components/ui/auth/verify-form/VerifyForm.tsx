"use client";

import HeadVerifyForm from "./HeadVerifyForm";
import VerifyFormInputs from "./VerifyFormInputs";

function VerifyForm({ email }: { email: string }) {
  return (
    <div className="space-y-6">
      <HeadVerifyForm email={email} />

      <VerifyFormInputs email={email} />
    </div>
  );
}

export default VerifyForm;
