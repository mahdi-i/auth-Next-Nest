/**
 * API Client با قابلیت auto-refresh
 *
 * وقتی 401/403 می‌گیره:
 * 1. یه بار /auth/refresh-token صدا می‌زنه
 * 2. بک‌اند کوکی جدید ست می‌کنه
 * 3. request اصلی رو retry می‌کنه
 * 4. اگه refresh هم fail شد → logout
 *
 * اگه چند تا request همزمان 401 بگیرن → فقط یه بار refresh می‌زنه
 * بقیه صبر می‌کنن (queue)
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

// ────────────────────────────────────────────────
// Refresh queue — جلوگیری از چند refresh همزمان
// ────────────────────────────────────────────────
let isRefreshing = false;
let waitingQueue: Array<(ok: boolean) => void> = [];

function notifyQueue(ok: boolean) {
  waitingQueue.forEach((resolve) => resolve(ok));
  waitingQueue = [];
}

async function callRefreshEndpoint(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("[API Client] Refresh response status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.error("[API Client] Refresh failed:", text);
      return false;
    }

    // ✅ لاگ کردن کوکی‌های جدید
    const setCookie = res.headers.get("set-cookie");
    console.log("[API Client] New cookie received:", !!setCookie);

    return true;
  } catch (error) {
    console.error("[API Client] Refresh error:", error);
    return false;
  }
}

// ────────────────────────────────────────────────
// Main API client
// ────────────────────────────────────────────────
export interface ApiClientOptions extends RequestInit {
  /** اگه true باشه در صورت 401 دیگه retry نمی‌کنه */
  _isRetry?: boolean;
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { _isRetry = false, ...fetchOptions } = options;

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  // ── موفق ──────────────────────────────────────
  if (res.ok) {
    // اگه response body خالیه (مثل 204) null برگردون
    const text = await res.text();
    return (text ? JSON.parse(text) : null) as T;
  }

  // ── 401 / 403 → try refresh ──────────────────
  if ((res.status === 401 || res.status === 403) && !_isRetry) {
    if (isRefreshing) {
      // صبر کن تا refresh قبلی تموم بشه
      const ok = await new Promise<boolean>((resolve) => {
        waitingQueue.push(resolve);
      });

      if (!ok) {
        handleLogout();
        throw new ApiError(res.status, "Session expired");
      }

      // retry بعد از اینکه refresh موفق شد
      return apiClient<T>(endpoint, { ...options, _isRetry: true });
    }

    // این request اول refresh رو شروع می‌کنه
    isRefreshing = true;
    const refreshOk = await callRefreshEndpoint();
    isRefreshing = false;
    notifyQueue(refreshOk);

    if (!refreshOk) {
      handleLogout();
      throw new ApiError(res.status, "Session expired");
    }

    // retry با access token جدید
    return apiClient<T>(endpoint, { ...options, _isRetry: true });
  }

  // ── سایر خطاها ────────────────────────────────
  let errorMessage = `Request failed with status ${res.status}`;
  try {
    const body = await res.json();
    errorMessage = body?.message ?? errorMessage;
  } catch {
    // json parse fail → پیام پیش‌فرض
  }

  throw new ApiError(res.status, errorMessage);
}

// ────────────────────────────────────────────────
// Custom Error
// ────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ────────────────────────────────────────────────
// Logout helper (client-side only)
// ────────────────────────────────────────────────
function handleLogout() {
  if (typeof window === "undefined") return;

  // Zustand store رو clear کن
  // import مستقیم برای جلوگیری از circular dependency
  import("@/store/auth.store").then(({ useAuthStore }) => {
    useAuthStore.getState().clearUser();
  });

  window.location.href = "/auth/login";
}

// ────────────────────────────────────────────────
// Convenience wrappers
// ────────────────────────────────────────────────
export const api = {
  get: <T>(endpoint: string, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
