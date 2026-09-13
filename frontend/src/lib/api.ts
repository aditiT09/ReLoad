// src/lib/api.ts
// Central API client for communicating with the ReLoad FastAPI backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Token Helpers ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("reload_token");
}

export function setToken(token: string) {
  localStorage.setItem("reload_token", token);
}

export function clearToken() {
  localStorage.removeItem("reload_token");
  localStorage.removeItem("reload_user");
}

export function getUserId(): string | null {
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    const sub = parsed.sub;
    if (typeof sub === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sub)) {
      return sub;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: Record<string, unknown>) {
  localStorage.setItem("reload_user", JSON.stringify(user));
}

export function getStoredUser(): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("reload_user");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// ─── Core Fetch Wrapper ───────────────────────────────────────────────────────

interface RequestOptions extends RequestInit {
  auth?: boolean; // attach Bearer token from localStorage
  timeoutMs?: number;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = true, timeoutMs = 8000, headers: extraHeaders = {}, signal: externalSignal, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers,
      signal: externalSignal || controller.signal,
      ...rest,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
      let errorMsg = errorBody.detail || `API error ${res.status}`;
      if (Array.isArray(errorMsg)) {
        errorMsg = errorMsg
          .map((e: any) => `${e.loc ? e.loc.slice(1).join('.') + ': ' : ''}${e.msg}`)
          .join(', ');
      } else if (typeof errorMsg === 'object' && errorMsg !== null) {
        errorMsg = JSON.stringify(errorMsg);
      }
      throw new Error(errorMsg);
    }

    // 204 No Content → return null
    if (res.status === 204) return null as T;
    return res.json() as Promise<T>;
  } catch (err: unknown) {
    if (
      (err instanceof DOMException && err.name === "AbortError") ||
      (err instanceof Error && (err.message.includes("aborted") || err.name === "AbortError"))
    ) {
      throw new Error(`Server request timed out after ${Math.round(timeoutMs / 1000)}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface SignupPayload {
  role: "customer" | "driver" | "admin" | "company_admin";
  name: string;
  phone: string;
  email?: string;
  password: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
}

export const auth = {
  signup: (payload: SignupPayload) =>
    apiFetch<TokenResponse>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }),

  login: (payload: LoginPayload) =>
    apiFetch<TokenResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }),

  verifyOtp: (phone: string, otp_code: string) =>
    apiFetch("/api/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp_code }),
      auth: false,
    }),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookings = {
  list: () => apiFetch("/api/v1/bookings"),
  get: (id: string) => apiFetch(`/api/v1/bookings/${id}`),
  create: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateStatus: (id: string, status: string) =>
    apiFetch(`/api/v1/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export const vehicles = {
  list: () => apiFetch("/api/v1/vehicles"),
  get: (id: string) => apiFetch(`/api/v1/vehicles/${id}`),
  create: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/vehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ─── Trust / Trust Score ──────────────────────────────────────────────────────

export const trust = {
  getScore: (userId: string) => apiFetch(`/api/v1/trust/${userId}`),
  list: () => apiFetch("/api/v1/trust"),
};

// ─── GPS ──────────────────────────────────────────────────────────────────────

export const gps = {
  ping: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/gps/ping", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getHistory: (bookingId: string) =>
    apiFetch(`/api/v1/gps/booking/${bookingId}`),
  getLatestPing: (bookingId: string) =>
    apiFetch<{ id: string; booking_id: string; driver_id: string; lat: number; lng: number; timestamp: string }>(
      `/api/v1/bookings/${bookingId}/gps-pings/latest`
    ),
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const payments = {
  list: () => apiFetch("/api/v1/payments"),
  create: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/payments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  release: (id: string) =>
    apiFetch(`/api/v1/payments/${id}/release`, { method: "POST" }),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = {
  list: () => apiFetch("/api/v1/notifications"),
  markRead: (id: string) =>
    apiFetch(`/api/v1/notifications/${id}/read`, { method: "PATCH" }),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const chat = {
  getMessages: (bookingId: string) =>
    apiFetch(`/api/v1/chat/${bookingId}/messages`),
  send: (bookingId: string, content: string) =>
    apiFetch(`/api/v1/chat/${bookingId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

// ─── Safety ───────────────────────────────────────────────────────────────────

export const safety = {
  report: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/safety", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  list: () => apiFetch("/api/v1/safety"),
};

// ─── Surcharges ───────────────────────────────────────────────────────────────

export const surcharges = {
  list: () => apiFetch("/api/v1/surcharges"),
  request: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/surcharges", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  approve: (id: string) =>
    apiFetch(`/api/v1/surcharges/${id}/approve`, { method: "POST" }),
  reject: (id: string) =>
    apiFetch(`/api/v1/surcharges/${id}/reject`, { method: "POST" }),
};

// ─── Handoffs ─────────────────────────────────────────────────────────────────

export const handoffs = {
  list: (bookingId: string) => apiFetch(`/api/v1/handoffs/${bookingId}`),
  submit: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/handoffs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ─── ML / AI ──────────────────────────────────────────────────────────────────

export const ml = {
  predictDemand: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/ml/predict-demand", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  trustScore: (userId: string) =>
    apiFetch(`/api/v1/ml/trust-score/${userId}`),
  surchargeRecommend: (payload: Record<string, unknown>) =>
    apiFetch("/api/v1/ml/surcharge-recommend", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ─── Health ───────────────────────────────────────────────────────────────────

export const health = {
  check: () => apiFetch("/", { auth: false }),
};
