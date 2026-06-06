import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNews, createNews, updateNews, deleteNews } from "../api/client.js";

export const NEWS_KEY = ["news"] as const;

export interface ApiNewsArticle {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  publishedAt: string;
  isPublished: boolean;
  authorName: string;
  authorId?: number;
}

export interface CreateNewsPayload {
  title: string;
  content: string;
  imageUrl?: string | null;
  isPublished?: boolean;
}

export function useNews(onlyPublished = true) {
  return useQuery<ApiNewsArticle[]>({
    queryKey: [...NEWS_KEY, onlyPublished],
    queryFn: () => fetchNews(onlyPublished),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNewsArticle(id: number | null) {
  const { data: articles = [] } = useNews();
  return articles.find((a) => a.id === id) ?? null;
}

export function useCreateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNewsPayload) => createNews(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: NEWS_KEY }),
  });
}

export function useUpdateNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateNewsPayload }) =>
      updateNews(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: NEWS_KEY }),
  });
}

export function useDeleteNews() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteNews(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NEWS_KEY }),
  });
}
