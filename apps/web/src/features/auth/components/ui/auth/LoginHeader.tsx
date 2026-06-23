"use client";

import { LoginHeaderProps } from "./types";

export const LoginHeader = ({ step, email }: LoginHeaderProps) => {
  const titles = {
    send: "Welcome Back",
    verify: "Verify Code",
  };

  const subtitles = {
    send: "Enter your email and password to login",
    verify: `A verification code has been sent to ${email}`,
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-800">{titles[step]}</h2>
      <p className="text-gray-600 text-sm mt-1">{subtitles[step]}</p>
    </div>
  );
};
