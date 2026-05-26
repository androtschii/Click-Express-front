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

const API = "http://localhost:5114/api";
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

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createSession(user: User) {
  const token = btoa(`${user.id}:${Date.now()}:${Math.random()}`);
  const session: Session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    token,
    avatar: user.avatar,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  setCookie(COOKIE_NAME, token, 30);
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
    const response = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({})) as { message?: string };
      return { ok: false, error: err.message || "Registration failed" };
    }

    const data = await response.json() as { token: string; refreshToken: string; username: string; role: string };

    const session: Session = {
      userId: data.username,
      email,
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
      email,
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
 const response = await fetch("http://localhost:5114/api/auth/login", {
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

export function loginWithGoogle(): Promise<{
  ok: boolean;
  user?: User;
  error?: string;
}> {
 // Mock Google OAuth — replace with real Google Identity Services in production
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockEmail = `demo.google@gmail.com`;
      const mockName = "Google Demo User";
      const users = getUsers();
      let user = users.find((u) => u.email === mockEmail);
      if (!user) {
        user = {
          id: crypto.randomUUID(),
          name: mockName,
          email: mockEmail,
          password: "",
          createdAt: new Date().toISOString(),
          provider: "google",
 avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockName)}&background=EA4335&color=fff&size=64`,
        };
        saveUsers([...users, user]);
      }
      createSession(user);
      resolve({ ok: true, user });
    }, 1200);
  });
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
    fetch(`${API}/auth/logout`, {
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
    const response = await fetch(`${API}/auth/forgot-password`, {
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

export function updateUser(
  userId: string,
  updates: { name?: string; currentPassword?: string; newPassword?: string }
): { ok: boolean; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { ok: false, error: "User not found" };

  const user = { ...users[idx] };

  if (updates.name !== undefined) {
    user.name = updates.name.trim();
  }

  if (updates.newPassword !== undefined) {
    if (user.provider === "google") return { ok: false, error: "Cannot change password for Google accounts" };
    if (user.password !== updates.currentPassword) return { ok: false, error: "wrong_password" };
    if (updates.newPassword.length < 6) return { ok: false, error: "password_short" };
    user.password = updates.newPassword;
  }

  users[idx] = user;
  saveUsers(users);

 // Update session name if changed
  if (updates.name !== undefined) {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null") as Session | null;
    if (session && session.userId === userId) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, name: user.name }));
    }
  }

  return { ok: true };
}
