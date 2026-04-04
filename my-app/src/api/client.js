const API_BASE_URL = "http://localhost:5000/api";

// ── Token helpers ──────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("jwt_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ── Auth ───────────────────────────────────────────────────────────────────
export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw new Error("Неверный логин или пароль");
  const data = await response.json();
  localStorage.setItem("jwt_token", data.token);
  localStorage.setItem("jwt_username", data.username);
  localStorage.setItem("jwt_role", data.role);
  return data;
};

export const logout = () => {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("jwt_username");
  localStorage.removeItem("jwt_role");
};

export const getSession = () => {
  const token = getToken();
  if (!token) return null;
  return {
    token,
    username: localStorage.getItem("jwt_username"),
    role: localStorage.getItem("jwt_role"),
  };
};

// ── Users ──────────────────────────────────────────────────────────────────
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка загрузки пользователей");
  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Ошибка создания пользователя");
  return response.json();
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Ошибка обновления пользователя");
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка удаления пользователя");
  return response.ok;
};

// ── Health ─────────────────────────────────────────────────────────────────
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health/ping`);
  if (!response.ok) throw new Error("API недоступен");
  return response.json();
};
