import type {
  Product, PagedResult, Order, Cart, Review,
  UserProfile, AppNotification, Favorite,
  NewsArticle, Driver, Vehicle, AuditLog,
} from './types';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5114/api';
const SESSION_KEY = 'ce_session';

function token(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { token?: string }).token ?? null : null;
  } catch {
    return null;
  }
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = token();
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (t) headers.set('Authorization', `Bearer ${t}`);

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    localStorage.removeItem(SESSION_KEY);
    window.location.replace('/');
    throw new Error('Unauthorized');
  }

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

const get   = <T>(path: string)                  => req<T>(path);
const post  = <T>(path: string, body?: unknown)  => req<T>(path, { method: 'POST',   body: JSON.stringify(body) });
const put   = <T>(path: string, body?: unknown)  => req<T>(path, { method: 'PUT',    body: JSON.stringify(body) });
const patch = <T>(path: string, body?: unknown)  => req<T>(path, { method: 'PATCH',  body: body !== undefined ? JSON.stringify(body) : undefined });
const del   = <T>(path: string)                  => req<T>(path, { method: 'DELETE' });

async function upload<T>(path: string, file: File): Promise<T> {
  const t = token();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: t ? { Authorization: `Bearer ${t}` } : {},
    body: form,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? 'Upload failed');
  }
  return res.json();
}

// Products
export const products = {
  list:         (params?: Record<string, string | number>) => get<PagedResult<Product>>(`/product${params ? '?' + new URLSearchParams(params as Record<string,string>) : ''}`),
  byId:         (id: number)                               => get<Product>(`/product/${id}`),
  stats:        ()                                         => get<unknown>('/product/stats'),
  create:       (data: Partial<Product>)                   => post<Product>('/product', data),
  update:       (id: number, data: Partial<Product>)       => put<Product>(`/product/${id}`, data),
  setPrice:     (id: number, price: number)                => patch<Product>(`/product/${id}/price`, { price }),
  setStock:     (id: number, quantity: number)             => patch<Product>(`/product/${id}/stock`, { quantity }),
  toggle:       (id: number)                               => patch<{ message: string }>(`/product/${id}/toggle`),
  uploadImage:  (id: number, file: File)                   => upload<Product>(`/product/${id}/upload-image`, file),
  remove:       (id: number)                               => del<void>(`/product/${id}`),
  deleted:      ()                                         => get<Product[]>('/product/deleted'),
  restore:      (id: number)                               => post<Product>(`/product/${id}/restore`),
};

// Orders
export const orders = {
  all:    ()                          => get<Order[]>('/order'),
  my:     ()                          => get<Order[]>('/order/my'),
  byId:   (id: number)                => get<Order>(`/order/${id}`),
  create: (productId: number)         => post<Order>('/order', { productId, quantity: 1 }),
  cancel: (id: number)                => patch<Order>(`/order/${id}/cancel`),
  status: (id: number, status: string)=> patch<Order>(`/order/${id}/status`, { status }),
};

// Cart
export const cart = {
  get:      ()                                        => get<Cart>('/cart/my'),
  add:      (productId: number, quantity = 1)         => post<void>('/cart/items', { productId, quantity }),
  remove:   (itemId: number)                          => del<void>(`/cart/items/${itemId}`),
  checkout: ()                                        => post<Order[]>('/order/checkout'),
};

// Reviews
export const reviews = {
  list:    (onlyApproved = true)  => get<Review[]>(`/review?onlyApproved=${onlyApproved}`),
  create:  (data: Partial<Review>)=> post<Review>('/review', data),
  approve: (id: number)           => patch<Review>(`/review/${id}/approve`),
  reject:  (id: number)           => patch<Review>(`/review/${id}/reject`),
  remove:  (id: number)           => del<void>(`/review/${id}`),
  like:    (id: number)           => patch<{ likes: number }>(`/review/${id}/like`),
};

// User
export const user = {
  profile:         ()                          => get<UserProfile>('/user/profile'),
  update:          (data: Partial<UserProfile>)=> put<UserProfile>('/user/profile', data),
  favorites:       ()                          => get<Favorite[]>('/user/favorites'),
  addFavorite:     (productId: number)         => post<void>('/user/favorites', { productId }),
  removeFavorite:  (productId: number)         => del<void>(`/user/favorites/${productId}`),
  notifications:   ()                          => get<AppNotification[]>('/notification/my'),
  markRead:        (id: number)                => patch<void>(`/notification/${id}/read`),
  markAllRead:     ()                          => patch<void>('/notification/read-all'),
};

// News
export const news = {
  list:   (onlyPublished = true) => get<NewsArticle[]>(`/news?onlyPublished=${onlyPublished}`),
  create: (data: Partial<NewsArticle>) => post<NewsArticle>('/news', data),
  update: (id: number, data: Partial<NewsArticle>) => put<NewsArticle>(`/news/${id}`, data),
  remove: (id: number) => del<void>(`/news/${id}`),
};

// Drivers & Vehicles
export const drivers  = {
  list:    (status?: string) => get<Driver[]>(status ? `/drivers?status=${status}` : '/drivers'),
  create:  (data: Partial<Driver>)  => post<Driver>('/drivers', data),
  update:  (id: number, data: Partial<Driver>) => put<Driver>(`/drivers/${id}`, data),
  status:  (id: number, s: string)  => patch<void>(`/drivers/${id}/status`, { status: s }),
  remove:  (id: number)             => del<void>(`/drivers/${id}`),
  deleted: ()                       => get<Driver[]>('/drivers/deleted'),
  restore: (id: number)             => post<Driver>(`/drivers/${id}/restore`),
};

export const vehicles = {
  list:   ()                                  => get<Vehicle[]>('/vehicle'),
  create: (data: Partial<Vehicle>)            => post<Vehicle>('/vehicle', data),
  update: (id: number, data: Partial<Vehicle>)=> put<Vehicle>(`/vehicle/${id}`, data),
  toggle: (id: number)                        => patch<Vehicle>(`/vehicle/${id}/availability`),
  remove: (id: number)                        => del<void>(`/vehicle/${id}`),
};

// Audit
export const audit = {
  logs: (params?: Record<string, string | number>) =>
    get<PagedResult<AuditLog>>(`/audit${params ? '?' + new URLSearchParams(params as Record<string,string>) : ''}`),
};
