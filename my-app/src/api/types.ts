export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isActive: boolean;
  isDeleted: boolean;
  viewCount: number;
  createdAt: string;
}

export interface PagedResult<T> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: T[];
}

export interface Order {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  status: string;
  totalPrice: number | null;
  createdAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface Review {
  id: number;
  userId: number;
  username: string;
  productId: number;
  stars: number;
  text: string;
  isApproved: boolean;
  createdAt: string;
  likes: number;
  role?: string;
  location?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface AppNotification {
  id: number;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Favorite {
  id: number;
  productId: number;
  productName: string;
  createdAt: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt: string;
  authorId?: number;
  authorName?: string;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  status: string;
  vehicleId?: number;
  isDeleted: boolean;
}

export interface Vehicle {
  id: number;
  model: string;
  plateNumber: string;
  type: string;
  isAvailable: boolean;
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  username: string;
  details?: string;
  timestamp: string;
}
