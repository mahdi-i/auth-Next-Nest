"use client";

import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/core/config/base-url/BaseUrl";
import { Eye, EyeOff } from "lucide-react";
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
  const [showpass, setShowPass] = useState(false);
  console.log(1);

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

  const togglePassword = () => {
    setShowPass((i) => !i);
  };
  return (
    <div className="min-h-screen w-full relative flex justify-center items-center p-4">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
        }}
      />

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md shadow-2xl  rounded-2xl ">
        <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {step === "send" ? "Welcome Back" : "Verify Code"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {step === "send"
                ? "Enter your email and password to login"
                : `A verification code has been sent to ${email}`}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/15 backdrop-blur-sm border border-red-500/30 text-red-700 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {step === "send" ? (
            <form onSubmit={handleSendOtp} className="space-y-5 ">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2.5 shadow-sm shadow-blue-200 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative flex justify-center items-center">
                  <input
                    type={showpass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full shadow-sm shadow-blue-200  px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent transition"
                    required
                  />
                  {password.length > 0 &&
                    (showpass ? (
                      <Eye
                        color="#9e9e9e"
                        size={22}
                        onClick={togglePassword}
                        className="absolute right-0 mr-4 cursor-pointer"
                      />
                    ) : (
                      <EyeOff
                        color="#9e9e9e"
                        size={22}
                        onClick={togglePassword}
                        className="absolute right-0 mr-4 cursor-pointer"
                      />
                    ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-5 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. 12345"
                  className="w-full shadow-sm shadow-blue-200 px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent transition text-center text-lg tracking-widest"
                  required
                />
                <p className="mt-2 text-sm text-gray-500 text-center">
                  A 5-digit code has been sent to your email
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <button
                type="button"
                onClick={() => setStep("send")}
                className="w-full cursor-pointer py-5 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
