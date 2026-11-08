import { apiClient } from "./client";
import type { Draft } from "./drafts.service";

export type Post = Draft;

export const postsService = {
  list: () => apiClient<Post[]>("/posts"),
  get: (slug: string) => apiClient<Post>(`/posts/${encodeURIComponent(slug)}`),
  registerPostView: (slug: string) => apiClient<{ views: number }>(`/posts/${encodeURIComponent(slug)}/view`, { method: "POST" }),
  remove: (id: number) => apiClient<void>(`/posts/${id}`, { method: "DELETE" }),
  unpublish: (id: number) => apiClient<Post>(`/posts/${id}/unpublish`, { method: "POST" }),
};
