"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BACKEND_URL } from "@/core/config/base-url/BaseUrl";
import { LoginHeader } from "./LoginHeader";
import { LoginInput } from "./LoginInput";
import { PasswordInput } from "./PasswordInput";
import { LoginButton } from "./LoginButton";

export const LoginForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<"send" | "verify">("send");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/auth/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("verify");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/auth/verifyOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Invalid OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-10">
      <LoginHeader step={step} email={email} />

      {error && (
        <div className="bg-red-500/15 backdrop-blur-sm border border-red-500/30 text-red-700 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {step === "send" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <LoginInput
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <LoginButton type="submit" loading={loading}>
            Send OTP
          </LoginButton>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <LoginInput
            id="code"
            type="text"
            placeholder="e.g. 12345"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label="Verification Code"
            inputClassName="text-center text-lg tracking-widest"
          />

          <LoginButton type="submit" loading={loading}>
            Verify OTP
          </LoginButton>

          <LoginButton
            type="button"
            onClick={() => setStep("send")}
            variant={"ghost"}
            className="py-3"
          >
            ← Back to Login
          </LoginButton>
        </form>
      )}
    </div>
  );
};
