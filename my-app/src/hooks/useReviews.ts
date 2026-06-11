import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchReviews,
  createReview,
  approveReview,
  rejectReview,
  deleteReview,
} from "../api/client.js";

export const REVIEWS_KEY = ["reviews"] as const;

export interface ApiReview {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  isApproved: boolean;
  productId: number | null;
  username: string;
  role?: string;
  location?: string;
  likes?: number;
  dislikes?: number;
}

export interface CreateReviewPayload {
  rating: number;
  text: string;
  productId?: number | null;
  role?: string;
  location?: string;
}

export function useReviews(onlyApproved = true) {
  return useQuery<ApiReview[]>({
    queryKey: [...REVIEWS_KEY, onlyApproved],
    queryFn: () => fetchReviews(onlyApproved),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: REVIEWS_KEY });
    },
  });
}

export function useApproveReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveReview(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: REVIEWS_KEY }),
  });
}

export function useRejectReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rejectReview(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: REVIEWS_KEY }),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: REVIEWS_KEY }),
  });
}
