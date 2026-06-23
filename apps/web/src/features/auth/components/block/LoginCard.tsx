"use client";

import { LoginForm } from "../ui/auth/LoginForm";

export const LoginCard = () => {
  return (
    <div className="relative z-10 w-full max-w-md shadow-2xl rounded-2xl">
      <div className="bg-card rounded-2xl shadow-2xl p-8">
        <LoginForm />
      </div>
    </div>
  );
};
