import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession, logout as logoutFn, type Session } from "../services/authService";
import { API_BASE } from "../config";

export const SESSION_KEY = ["session"] as const;
export const PROFILE_KEY = ["profile"] as const;

export function useSession() {
  return useQuery<Session | null>({
    queryKey: SESSION_KEY,
    queryFn: () => getSession(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

async function fetchProfile(token: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export function useProfile(token?: string) {
  return useQuery({
    queryKey: [...PROFILE_KEY, token],
    queryFn: () => fetchProfile(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => logoutFn(),
    onSuccess: () => {
      qc.setQueryData(SESSION_KEY, null);
      qc.removeQueries({ queryKey: PROFILE_KEY });
    },
  });
}

export function useSavedLoads(token?: string) {
  return useQuery<Array<{ productId: number }>>({
    queryKey: ["saved-loads", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/user/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch saved loads");
      return res.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyOrders(token?: string) {
  return useQuery<Array<{ id: number; productId: number; status: string }>>({
    queryKey: ["my-orders", token],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/order/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: !!token,
    staleTime: 1000 * 60,
  });
}

export function useSaveLoad(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(`${API_BASE}/user/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Failed to save load");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-loads", token] }),
  });
}

export function useUnsaveLoad(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (loadId: number) => {
      const res = await fetch(`${API_BASE}/user/favorites/${loadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to unsave load");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-loads", token] }),
  });
}

export function useCancelOrder(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: number) => {
      const res = await fetch(`${API_BASE}/order/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel order");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-orders", token] }),
  });
}
