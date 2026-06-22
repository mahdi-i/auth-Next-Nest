// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "./lib/token";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/_next",
  "/favicon.ico",
  "/api",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

async function refreshFromMiddleware(
  request: NextRequest,
): Promise<NextResponse | null> {
  // ✅ دریافت refresh token از کوکی
  const refreshToken = request.cookies.get("X-CINEMA-REFRESH")?.value;

  console.log("[Middleware] Refresh token exists:", !!refreshToken);

  if (!refreshToken) {
    console.log("[Middleware] No refresh token found");
    return null;
  }

  try {
    // ✅ ساخت هدر Cookie به صورت دستی
    const cookieHeader = `X-CINEMA-REFRESH=${refreshToken}`;

    console.log("[Middleware] Sending refresh request to backend");

    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      // ✅ مهم: برای دریافت کوکی جدید
      credentials: "include",
    });

    console.log("[Middleware] Refresh response status:", refreshRes.status);

    if (!refreshRes.ok) {
      const errorText = await refreshRes.text();
      console.error(
        "[Middleware] Refresh failed:",
        refreshRes.status,
        errorText,
      );
      return null;
    }

    // ✅ دریافت کوکی جدید از هدر Set-Cookie
    const setCookieHeader = refreshRes.headers.get("set-cookie");
    console.log("[Middleware] Set-Cookie header exists:", !!setCookieHeader);

    // ✅ ایجاد پاسخ
    const response = NextResponse.next();

    // ✅ اگر کوکی جدید وجود داشت، اضافه کن
    if (setCookieHeader) {
      // ⚠️ مهم: هدر Set-Cookie رو به صورت مستقیم ست کن
      response.headers.set("Set-Cookie", setCookieHeader);
      console.log("[Middleware] Set-Cookie header added to response");
    }

    return response;
  } catch (err) {
    console.error("[Middleware] Refresh error:", err);
    return null;
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);

  // ✅ پاک کردن کوکی‌ها
  response.cookies.delete("X-CINEMA-ACCESS");
  response.cookies.delete("X-CINEMA-REFRESH");

  console.log("[Middleware] Redirecting to login, cookies cleared");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // پابلیک پاث‌ها
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  console.log("[Middleware] Processing:", pathname);

  const accessToken = request.cookies.get("X-CINEMA-ACCESS")?.value;
  console.log("[Middleware] Access token exists:", !!accessToken);

  // اگر توکن وجود نداره
  if (!accessToken) {
    console.log("[Middleware] No access token, trying refresh");
    const refreshed = await refreshFromMiddleware(request);
    if (refreshed) {
      console.log("[Middleware] Refresh successful, continuing");
      return refreshed;
    }
    console.log("[Middleware] Refresh failed, redirecting to login");
    return redirectToLogin(request);
  }

  // اگر توکن منقضی شده
  if (isTokenExpired(accessToken)) {
    console.log("[Middleware] Access token expired, trying refresh");
    const refreshed = await refreshFromMiddleware(request);
    if (refreshed) {
      console.log("[Middleware] Refresh successful, continuing");
      return refreshed;
    }
    console.log("[Middleware] Refresh failed, redirecting to login");
    return redirectToLogin(request);
  }

  // توکن معتبر
  console.log("[Middleware] Access token valid, continuing");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
