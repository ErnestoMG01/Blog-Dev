import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../../../api/client";

export default function AdminLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const from = (location.state as { from?: string } | null)?.from ?? "/admin/drafts";

  if (sessionStorage.getItem("cms_admin_authenticated") === "true") {
    return <Navigate to={from} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    sessionStorage.setItem("cms_admin_api_key", apiKey.trim());
    try {
      await apiClient<{ authenticated: boolean }>("/auth/verify", { method: "POST" });
      sessionStorage.setItem("cms_admin_authenticated", "true");
      navigate(from, { replace: true });
    } catch {
      sessionStorage.removeItem("cms_admin_api_key");
      sessionStorage.removeItem("cms_admin_authenticated");
      setError("Clave administrativa incorrecta o API de administración no configurada.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cms-page" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={submit} className="cms-editor" style={{ width: "min(420px, 90vw)", margin: 0 }}>
        <p className="cms-kicker">CMS SEGURO</p>
        <h1>Acceso administrativo</h1>
        <label>Clave administrativa
          <input type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} required autoComplete="current-password" />
        </label>
        {error && <p className="cms-error">{error}</p>}
        <button className="cms-primary" type="submit" disabled={loading}>{loading ? "Verificando..." : "Entrar"}</button>
      </form>
    </main>
  );
}
