import { API_URL } from "./client";
import { logout } from "../services/authService";

export type UploadedAsset = {
  filename: string;
  url: string;
  path: string;
};

export const assetsService = {
  async upload(file: File): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append("file", file);

    const headers = new Headers();
    const adminApiKey = sessionStorage.getItem("cms_admin_api_key") ?? import.meta.env.VITE_ADMIN_API_KEY;
    if (adminApiKey) headers.set("X-Admin-API-Key", String(adminApiKey));
    const accessToken = sessionStorage.getItem("cms_admin_access_token");
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(`${API_URL}/assets/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        window.location.assign("/admin/login");
      }
      const body = await response.text();
      throw new Error(body || `Error al subir la imagen: ${response.status}`);
    }

    return response.json();
  },
};
