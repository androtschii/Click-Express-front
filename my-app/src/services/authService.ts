export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  avatar?: string;
  provider?: "local" | "google";
}

export interface Session {
  userId: string;
  email: string;
  name: string;
  token: string;
  refreshToken?: string;
  avatar?: string;
  role?: string;
}

const API_BASE = "http://localhost:5114/api";
const USERS_KEY = "ce_users";
const SESSION_KEY = "ce_session";
const COOKIE_NAME = "ce_token";

// Cookies
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  return (
    document.cookie
      .split("; ")
      .map((p) => p.split("="))
      .find(([k]) => k === name)?.[1] ?? null
  );
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// Storage
function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

// Public API
export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string; user?: User }> {
  if (!username.trim()) return { ok: false, error: "Username is required" };
  if (!email.trim()) return { ok: false, error: "Email is required" };
  if (password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters" };

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({})) as { message?: string };
      return { ok: false, error: err.message || "Registration failed" };
    }

    const data = await response.json() as { token: string; refreshToken: string; username: string; role: string };

    const session: Session = {
      userId: data.username,
      email: email.trim(),
      name: data.username,
      token: data.token,
      refreshToken: data.refreshToken,
      role: data.role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCookie(COOKIE_NAME, data.token, 1);

    const user: User = {
      id: data.username,
      name: data.username,
      email: email.trim(),
      password: "",
      createdAt: new Date().toISOString(),
      provider: "local",
    };
    return { ok: true, user };
  } catch {
    return { ok: false, error: "Ошибка подключения к серверу" };
  }
}

export async function login(
  username: string,
  password: string
): Promise<{ ok: boolean; error?: string; user?: User }> {
  if (!username.trim()) return { ok: false, error: "Username is required" };
  if (!password) return { ok: false, error: "Password is required" };

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return { ok: false, error: "Неверный логин или пароль" };
    }

    const data = await response.json() as { token: string; refreshToken: string; username: string; role: string };

    const session: Session = {
      userId: data.username,
      email: data.username,
      name: data.username,
      token: data.token,
      refreshToken: data.refreshToken,
      role: data.role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCookie(COOKIE_NAME, data.token, 1);

    const fakeUser: User = {
      id: data.username,
      name: data.username,
      email: data.username,
      password: "",
      createdAt: new Date().toISOString(),
      provider: "local",
    };
    return { ok: true, user: fakeUser };
  } catch {
    return { ok: false, error: "Ошибка подключения к серверу" };
  }
}

// Exchanges a Google OAuth access token (from @react-oauth/google) for our own
// JWT session by calling the backend, which verifies the token with Google.
export async function loginWithGoogle(
  accessToken: string
): Promise<{ ok: boolean; user?: User; error?: string }> {
  if (!accessToken) return { ok: false, error: "Google did not return a token" };

  try {
    const response = await fetch(`${API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      const err = (await response.json().catch(() => ({}))) as { message?: string };
      return { ok: false, error: err.message || "Google login failed" };
    }

    const data = (await response.json()) as {
      token: string;
      refreshToken: string;
      username: string;
      role: string;
    };

    const session: Session = {
      userId: data.username,
      email: data.username,
      name: data.username,
      token: data.token,
      refreshToken: data.refreshToken,
      role: data.role,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCookie(COOKIE_NAME, data.token, 1);

    const user: User = {
      id: data.username,
      name: data.username,
      email: data.username,
      password: "",
      createdAt: new Date().toISOString(),
      provider: "google",
    };
    return { ok: true, user };
  } catch {
    return { ok: false, error: "Ошибка подключения к серверу" };
  }
}

export function getSession(): Session | null {
  try {
    const cookieToken = getCookie(COOKIE_NAME);
    if (!cookieToken) return null;
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY) || "null"
    ) as Session | null;
    if (!session || session.token !== cookieToken) return null;
    return session;
  } catch {
    return null;
  }
}

export function logout() {
  const session = getSession();
  if (session?.refreshToken) {
    fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    }).catch(() => {});
  }
  localStorage.removeItem(SESSION_KEY);
  deleteCookie(COOKIE_NAME);
}

export async function forgotPassword(
  email: string
): Promise<{ ok: boolean; error?: string; message?: string }> {
  if (!email.trim()) return { ok: false, error: "Email is required" };
  try {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json() as { message?: string };
    return { ok: true, message: data.message };
  } catch {
    return { ok: false, error: "Ошибка подключения к серверу" };
  }
}

export function getUserById(userId: string): User | null {
  return getUsers().find((u) => u.id === userId) ?? null;
}

export async function updateUser(
  _userId: string,
  updates: { name?: string; currentPassword?: string; newPassword?: string }
): Promise<{ ok: boolean; error?: string }> {
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null") as Session | null;

  if (updates.name !== undefined) {
    if (!session?.token) return { ok: false, error: "Not authenticated" };
    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ fullName: updates.name.trim() }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        return { ok: false, error: data.message || "Update failed" };
      }
    } catch {
      // Continue — update session locally even if API unreachable
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, name: updates.name.trim() }));
    return { ok: true };
  }

  if (updates.newPassword !== undefined) {
    if (!session?.token) return { ok: false, error: "Not authenticated" };
    try {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ currentPassword: updates.currentPassword, newPassword: updates.newPassword }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { message?: string };
        const msg = (data.message || "").toLowerCase();
        if (msg.includes("incorrect")) return { ok: false, error: "wrong_password" };
        if (msg.includes("8 char") || msg.includes("least 8")) return { ok: false, error: "password_short" };
        return { ok: false, error: data.message || "wrong_password" };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Ошибка подключения к серверу" };
    }
  }

  return { ok: true };
}
