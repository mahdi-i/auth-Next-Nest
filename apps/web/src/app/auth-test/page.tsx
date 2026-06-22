import { BACKEND_URL } from "@/core/config/base-url/BaseUrl";
import { cookies } from "next/headers";

export async function getServerProfile() {
  try {
    const cookieStore = await cookies();

    let accessToken = cookieStore.get("X-CINEMA-ACCESS")?.value;
    const refreshToken = cookieStore.get("X-CINEMA-REFRESH")?.value;

    console.log(
      "🖥️ [Server] Access Token:",
      accessToken ? "✅ Exists" : "❌ Missing",
    );

    if (!accessToken) {
      return {
        success: false,
        error: "No access token even after refresh",
        cookies: {
          hasAccess: false,
          hasRefresh: !!refreshToken,
        },
      };
    }

    const res = await fetch(`${BACKEND_URL}/auth/profile`, {
      headers: {
        Cookie: `X-CINEMA-ACCESS=${accessToken}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();

      return {
        success: true,
        data,
        cookies: {
          hasAccess: true,
          hasRefresh: !!refreshToken,
        },
      };
    }

    return {
      success: false,
      error: `Backend returned ${res.status}`,
      cookies: {
        hasAccess: false,
        hasRefresh: !!refreshToken,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      cookies: {
        hasAccess: false,
        hasRefresh: false,
      },
    };
  }
}
export default async function AuthTestPage() {
  const serverData = await getServerProfile();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Auth Test - Server & Client</h1>

        {/* Server-side data */}
        <div className="bg-blue-50 p-4 rounded shadow border border-blue-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">
            🖥️ Server-side Check
          </h2>
          <div className="space-y-2">
            <p>
              <strong>Success:</strong>{" "}
              {serverData.success ? "✅ Yes" : "❌ No"}
            </p>
            {serverData.error && (
              <p className="text-red-600">
                <strong>Error:</strong> {serverData.error}
              </p>
            )}
            <p>
              <strong>Cookies:</strong>
            </p>
            <pre className="bg-blue-100 p-2 rounded text-sm overflow-auto max-h-40">
              {JSON.stringify(serverData.cookies, null, 2)}
            </pre>
            {serverData.data && (
              <>
                <p>
                  <strong>Profile Data:</strong>
                </p>
                <pre className="bg-blue-100 p-2 rounded text-sm overflow-auto max-h-60">
                  {JSON.stringify(serverData.data, null, 2)}
                </pre>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
