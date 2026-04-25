const API_BASE_URL = "http://localhost:5114/api";

// Token helpers 
const getToken = () => {
  try {
    const session = JSON.parse(localStorage.getItem("ce_session") || "null");
    return session?.token ?? null;
  } catch {
    return null;
  }
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// Auth 
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

// Users 
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

// Products 
export const fetchProducts = async (search = "", category = "") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  const response = await fetch(`${API_BASE_URL}/product?${params}&pageSize=100`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка загрузки товаров");
  const data = await response.json();
  return Array.isArray(data) ? data : (data.items ?? []);
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/product`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Ошибка создания карточки");
  return response.json();
};

export const updateProductPrice = async (id, price) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}/price`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ price }),
  });
  if (!response.ok) throw new Error("Ошибка обновления цены");
  return response.json();
};

export const updateProductImage = async (id, imageUrl) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}/image`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ imageUrl }),
  });
  if (!response.ok) throw new Error("Ошибка обновления фото");
  return response.json();
};

export const updateProductStock = async (id, quantity) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}/stock`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) throw new Error("Ошибка обновления остатка");
  return response.json();
};

export const toggleProductActive = async (id) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка изменения статуса");
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/product/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка удаления товара");
  return response.ok;
};

export const fetchProductStats = async () => {
  const response = await fetch(`${API_BASE_URL}/product/stats`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка загрузки статистики");
  return response.json();
};

// Job Applications
export const submitJobApplication = async (data) => {
  const response = await fetch(`${API_BASE_URL}/jobapplication`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Ошибка отправки заявки");
  }
  return response.json();
};

export const fetchJobApplications = async (status = "") => {
  const params = status ? `?status=${encodeURIComponent(status)}` : "";
  const response = await fetch(`${API_BASE_URL}/jobapplication${params}`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка загрузки заявок");
  return response.json();
};

export const updateJobApplicationStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/jobapplication/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Ошибка обновления статуса");
  return response.json();
};

export const deleteJobApplication = async (id) => {
  const response = await fetch(`${API_BASE_URL}/jobapplication/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка удаления заявки");
  return true;
};

// Health
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health/ping`);
  if (!response.ok) throw new Error("API недоступен");
  return response.json();
};
