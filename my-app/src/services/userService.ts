const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

type Json = Record<string, unknown> | string | null;

async function parseJson(response: Response): Promise<Json> {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

async function ensureOk<T>(response: Response, errorMessage: string): Promise<T> {
  if (!response.ok) {
    const data = await parseJson(response);
    const message = typeof data === "object" && data !== null && "message" in data
      ? String((data as Record<string, unknown>).message)
      : errorMessage;
    throw new Error(message || errorMessage);
  }
  return response.json() as Promise<T>;
}

export interface ApiUser {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export const fetchUsers = async (): Promise<ApiUser[]> => {
  const response = await fetch(`${API_BASE_URL}/user`);
  return ensureOk<ApiUser[]>(response, "Ошибка загрузки пользователей");
};

export const createUser = async (userData: Partial<ApiUser>): Promise<ApiUser> => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return ensureOk<ApiUser>(response, "Ошибка создания пользователя");
};

export const updateUser = async (id: number, userData: Partial<ApiUser>): Promise<ApiUser> => {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return ensureOk<ApiUser>(response, "Ошибка обновления пользователя");
};

export const deleteUser = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Ошибка удаления пользователя");
  return true;
};

export const healthCheck = async (): Promise<{ message: string; timestamp: string; status: string }> => {
  const response = await fetch(`${API_BASE_URL}/health/ping`);
  return ensureOk(response, "API недоступен");
};
