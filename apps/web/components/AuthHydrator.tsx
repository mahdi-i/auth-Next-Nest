// components/AuthHydrator.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

export function AuthHydrator() {
  useEffect(() => {
    // ✅ فقط در کلاینت اجرا میشه
    console.log("💧 Hydrating auth store...");

    // خواندن از localStorage
    const stored = localStorage.getItem("cinema-auth");
    console.log("📦 Stored data:", stored);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log("📦 Parsed data:", parsed);

        if (parsed.state?.user) {
          console.log("👤 Setting user from storage:", parsed.state.user);
          useAuthStore.getState().setUser(parsed.state.user);
        }
      } catch (error) {
        console.error("❌ Error parsing stored data:", error);
      }
    }
  }, []);

  return null;
}
