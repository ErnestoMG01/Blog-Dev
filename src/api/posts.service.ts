import { apiClient } from "./client";
import type { Draft } from "./drafts.service";

export type Post = Draft;

export const postsService = {
  list: () => apiClient<Post[]>("/posts"),
  get: (idOrSlug: string | number) => apiClient<Post>(`/posts/${encodeURIComponent(idOrSlug)}`),
  remove: (id: number) => apiClient<void>(`/posts/${id}`, { method: "DELETE" }),
  unpublish: (id: number) => apiClient<Post>(`/posts/${id}/unpublish`, { method: "POST" }),
};
