// app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, clearUser } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  console.log("📊 Dashboard render:", { isAuthenticated, user, mounted });

  useEffect(() => {
    setMounted(true);
    console.log("🔍 Dashboard mounted");
    console.log("📊 isAuthenticated:", isAuthenticated);
    console.log("👤 user:", user);

    // دریافت اطلاعات محافظت شده
    const fetchProtectedData = async () => {
      try {
        console.log("📤 Fetching protected data...");

        const res = await fetch(`${BACKEND_URL}/auth/profile`, {
          credentials: "include",
        });

        console.log("📥 Protected data status:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("✅ Protected data:", data);
          setData(data);
        } else if (res.status === 401) {
          console.log("❌ Unauthorized");
          clearUser();
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, [isAuthenticated, user, router, clearUser]);

  // ✅ در طول SSR یا قبل از mount، لودینگ نشون بده
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // ✅ اگر لاگین نیست، چیزی نشون نده (redirect میشه)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={() => {
                document.cookie =
                  "X-CINEMA-ACCESS=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                document.cookie =
                  "X-CINEMA-REFRESH=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                clearUser();
                router.push("/auth/login");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h2 className="text-sm font-medium text-gray-500">User Info</h2>
              <pre className="mt-2 p-3 bg-gray-50 rounded text-sm">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Protected Data
              </h2>
              <pre className="mt-2 p-3 bg-gray-50 rounded text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
