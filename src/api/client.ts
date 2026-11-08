import { getAccessToken, logout } from "../services/authService";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const adminApiKey = sessionStorage.getItem("cms_admin_api_key") ?? import.meta.env.VITE_ADMIN_API_KEY;
  if (adminApiKey) headers.set("X-Admin-API-Key", String(adminApiKey));
  const accessToken = getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/login")) {
      logout();
      window.location.assign("/admin/login");
    }
    const message = await response.text();
    throw new Error(message || `API error: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>; 
}
