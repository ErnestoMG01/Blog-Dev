import { apiClient } from "./client";

export type Draft = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  status: "draft" | "published";
  author: string;
  views: number;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type DraftInput = Pick<Draft, "title" | "slug" | "excerpt" | "content" | "cover_image" | "author">;
export type ContentRevision = {
  id: number;
  content_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  status: string;
  author: string;
  created_at: string;
};

export const draftsService = {
  list: () => apiClient<Draft[]>("/drafts"),
  get: (id: number) => apiClient<Draft>(`/drafts/${id}`),
  create: (input: DraftInput) => apiClient<Draft>("/drafts", { method: "POST", body: JSON.stringify(input) }),
  update: (id: number, input: Partial<DraftInput>) => apiClient<Draft>(`/drafts/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  remove: (id: number) => apiClient<void>(`/drafts/${id}`, { method: "DELETE" }),
  publish: (id: number) => apiClient<Draft>(`/drafts/${id}/publish`, { method: "POST" }),
  revisions: (id: number) => apiClient<ContentRevision[]>(`/drafts/${id}/revisions`),
  restoreRevision: (id: number, revisionId: number) => apiClient<Draft>(`/drafts/${id}/revisions/${revisionId}/restore`, { method: "POST" }),
};

export const DraftsService = {
  getAll: draftsService.list,
  get: draftsService.get,
  create: draftsService.create,
  update: draftsService.update,
  delete: draftsService.remove,
  publish: draftsService.publish,
};
