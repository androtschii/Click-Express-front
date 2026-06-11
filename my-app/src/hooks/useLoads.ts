import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/client.js";
import { fetchLoads } from "../services/loadService";
import { LOADS } from "../utils/data";
import type { Load } from "../types/index";

export const LOADS_KEY = ["loads"] as const;

async function loadProducts(): Promise<Load[]> {
  const staticMap = new Map(LOADS.map((l) => [l.id, l]));
  try {
    const products = await fetchProducts();
    return products
      .filter((p: { isActive: boolean }) => p.isActive)
      .map(
        (p: {
          id: number;
          name: string;
          description: string;
          price: number;
          imageUrl: string;
          category: string;
        }) => {
          const parts = p.name.split(" → ");
          const staticLoad = staticMap.get(p.id);
          return {
            id: p.id,
            route: parts[0]?.trim() || p.name,
            dest: parts[1]?.trim() || "",
            price: p.price,
            miles: staticLoad?.miles ?? 0,
            type: (p.category === "Partial" ? "Partial" : "Full Load") as
              | "Full Load"
              | "Partial",
            cargo: p.description,
            image: p.imageUrl,
            tag:
              staticLoad?.tag ??
              (p.category === "Military Load" ? "Military Load" : null),
          } satisfies Load;
        }
      );
  } catch {
    return fetchLoads(LOADS);
  }
}

export function useLoads() {
  return useQuery<Load[], Error>({
    queryKey: LOADS_KEY,
    queryFn: loadProducts,
    staleTime: 1000 * 60 * 5,
  });
}
