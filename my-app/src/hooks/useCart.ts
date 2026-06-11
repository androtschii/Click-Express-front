import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../config";
import type { CartItemDto } from "../components/Modals/CartPanel";

export const CART_KEY = ["cart"] as const;

async function fetchCart(token: string): Promise<CartItemDto[]> {
  const res = await fetch(`${API_BASE}/cart/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  return data.items ?? [];
}

export function useCart(token?: string) {
  return useQuery<CartItemDto[]>({
    queryKey: [...CART_KEY, token],
    queryFn: () => fetchCart(token!),
    enabled: !!token,
    staleTime: 1000 * 30,
  });
}

export function useAddToCart(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [...CART_KEY, token] }),
  });
}

export function useRemoveFromCart(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: number) => {
      const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove from cart");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: [...CART_KEY, token] }),
  });
}

export function useCheckout(token?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/order/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Checkout failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...CART_KEY, token] });
      qc.invalidateQueries({ queryKey: ["my-orders", token] });
    },
  });
}
