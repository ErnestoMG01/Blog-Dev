const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";
const TOKEN_KEY = "cms_admin_access_token";

export type LoginInput = {
  email?: string;
  username?: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type?: string;
};

export function getAccessToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  try {
    const payloadPart = token.split(".")[1];
    const payload = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp !== "number" || payload.exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function logout(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem("cms_admin_authenticated");
  sessionStorage.removeItem("cms_admin_api_key");
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let message = "Credenciales incorrectas";
    try {
      const body = await response.json();
      if (typeof body.detail === "string") message = body.detail;
    } catch {
      // Keep the user-facing login error.
    }
    throw new Error(message);
  }

  const data = (await response.json()) as LoginResponse;
  if (!data.access_token) throw new Error("El servidor no devolvió un token válido");
  sessionStorage.setItem(TOKEN_KEY, data.access_token);
  return data;
}
