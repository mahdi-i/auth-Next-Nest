"use client";

import { BACKEND_URL } from "@/core/config/base-url/BaseUrl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
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
      console.log("📤 Sending OTP for:", email);

      const res = await fetch(`${BACKEND_URL}/auth/sendOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("📥 Send OTP response:", data);

      if (res.ok) {
        setStep("verify");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔐 Verifying OTP for:", email);

      const res = await fetch(`${BACKEND_URL}/auth/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      console.log("📥 Response status:", res.status);

      if (res.ok) {
        let data = null;
        try {
          data = await res.json();
          console.log("📥 Response data:", data);
        } catch {
          console.log("📥 No JSON body");
        }

        setTimeout(() => {
          console.log("✅ Redirecting to dashboard...");
          router.push("/dashboard");
        }, 200);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">
          {step === "send" ? "Login" : "Verify OTP"}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {step === "send" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 5-digit code"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <p className="mt-2 text-sm text-gray-500">Code sent to {email}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep("send")}
              className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
