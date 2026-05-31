const BASE_URL = "http://localhost:5114/api";
const SESSION_KEY = "ce_session";

interface Session {
  token: string;
  refreshToken?: string;
}

function getSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const session = getSession();
  if (!session?.refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { token: string; refreshToken: string };
    const updated = { ...session, token: data.token, refreshToken: data.refreshToken };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    return data.token;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  status: number;
  correlationId?: string;

  constructor(status: number, message: string, correlationId?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.correlationId = correlationId;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isRetry = false
): Promise<T> {
  const session = getSession();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (session?.token) {
    headers["Authorization"] = `Bearer ${session.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !isRetry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(method, path, body, true);
    }
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new CustomEvent("ce:logout"));
    throw new ApiError(401, "Session expired");
  }

  if (!res.ok) {
    const correlationId = res.headers.get("X-Correlation-ID") ?? undefined;
    let message = `Request failed: ${res.status}`;
    try {
      const err = (await res.json()) as { message?: string };
      if (err.message) message = err.message;
    } catch {
      // use default message
    }
    throw new ApiError(res.status, message, correlationId);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T = void>(path: string) => request<T>("DELETE", path),
};

export const API_BASE = BASE_URL;
