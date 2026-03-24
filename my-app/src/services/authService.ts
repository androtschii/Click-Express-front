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
  avatar?: string;
}

const USERS_KEY = "ce_users";
const SESSION_KEY = "ce_session";
const COOKIE_NAME = "ce_token";

// ── Cookies ────────────────────────────────────────────────────────────────
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

// ── Storage ────────────────────────────────────────────────────────────────
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

// ── Public API ─────────────────────────────────────────────────────────────
export function register(
  name: string,
  email: string,
  password: string
): { ok: boolean; error?: string; user?: User } {
  if (!name.trim()) return { ok: false, error: "Name is required" };
  if (!email.trim()) return { ok: false, error: "Email is required" };
  if (password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters" };

  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "Email already registered. Please login." };
  }

  const user: User = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    createdAt: new Date().toISOString(),
    provider: "local",
  };
  saveUsers([...users, user]);
  createSession(user);
  return { ok: true, user };
}

export function login(
  email: string,
  password: string
): { ok: boolean; error?: string; user?: User } {
  if (!email.trim()) return { ok: false, error: "Email is required" };
  if (!password) return { ok: false, error: "Password is required" };

  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
  if (!user) {
    return { ok: false, error: "No account found. Please register first." };
  }
  if (user.provider === "google") {
    return { ok: false, error: "This account uses Google Sign-In." };
  }
  if (user.password !== password) {
    return { ok: false, error: "Incorrect password." };
  }

  createSession(user);
  return { ok: true, user };
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
  localStorage.removeItem(SESSION_KEY);
  deleteCookie(COOKIE_NAME);
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
