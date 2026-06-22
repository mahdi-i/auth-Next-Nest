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

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

async function refreshFromMiddleware(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("X-CINEMA-REFRESH")?.value;

    if (!refreshToken) {
      return null;
    }

    const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `X-CINEMA-REFRESH=${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!refreshRes.ok) {
      return null;
    }

    const setCookie = refreshRes.headers.get("set-cookie");

    if (!setCookie) {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(request.url);

    response.headers.set("Set-Cookie", setCookie);

    return response;
  } catch (error) {
    console.error("[Middleware] Refresh failed:", error);
    return null;
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/auth/login", request.url);

  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  const response = NextResponse.redirect(loginUrl);

  response.cookies.delete("X-CINEMA-ACCESS");
  response.cookies.delete("X-CINEMA-REFRESH");

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("X-CINEMA-ACCESS")?.value;

  // توکن وجود نداره یا منقضی شده
  if (!accessToken || isTokenExpired(accessToken)) {
    const refreshed = await refreshFromMiddleware(request);

    if (refreshed) {
      return refreshed;
    }

    return redirectToLogin(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
