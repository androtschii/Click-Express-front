import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../config";

export const NOTIFICATIONS_KEY = ["notifications"] as const;

export interface ApiNotification {
  id: number;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

async function fetchNotifications(token: string): Promise<ApiNotification[]> {
  const res = await fetch(`${API_BASE}/notification/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
}

export function useNotifications(token?: string) {
  return useQuery<ApiNotification[]>({
    queryKey: [...NOTIFICATIONS_KEY, token],
    queryFn: () => fetchNotifications(token!),
    enabled: !!token,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
}

export function useUnreadCount(token?: string) {
  const { data = [] } = useNotifications(token);
  return data.filter((n) => !n.isRead).length;
}

export function useMarkRead(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE}/notification/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to mark as read");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [...NOTIFICATIONS_KEY, token] }),
  });
}

export function useDeleteNotification(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE}/notification/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete notification");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [...NOTIFICATIONS_KEY, token] }),
  });
}
