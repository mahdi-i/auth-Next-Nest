"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { LoginInput } from "./LoginInput";
import { PasswordInputProps } from "./types";
import { Button } from "@/components/ui/button";

export const PasswordInput = ({
  value,
  onChange,
  label = "Password",
  error,
  placeholder = "••••••••",
}: PasswordInputProps) => {
  const [showpass, setShowPass] = useState(false);

  const togglePassword = () => setShowPass((prev) => !prev);

  return (
    <div className="relative ">
      <LoginInput
        id="password"
        type={showpass ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        label={label}
        error={error}
        inputClassName="pr-12"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute cursor-pointer right-3 top-9 text-accent"
        >
          {showpass ? <Eye size={22} /> : <EyeOff size={22} />}
        </button>
      )}
    </div>
  );
};
