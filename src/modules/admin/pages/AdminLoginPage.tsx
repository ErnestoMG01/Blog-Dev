import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, login } from "../../../services/authService";

export default function AdminLoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const from = (location.state as { from?: string } | null)?.from ?? "/admin/drafts";

  if (isAuthenticated()) {
    return <Navigate to={from} replace />;
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email: email.trim() || undefined, password });
      navigate(from, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cms-page" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <form onSubmit={submit} className="cms-editor" style={{ width: "min(420px, 90vw)", margin: 0 }}>
        <p className="cms-kicker">CMS SEGURO</p>
        <h1>Acceso administrativo</h1>
        <label>Email o usuario
          <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" />
        </label>
        <label>Contraseña
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
        </label>
        {error && <p className="cms-error">{error}</p>}
        <button className="cms-primary" type="submit" disabled={loading}>{loading ? "Verificando..." : "Entrar"}</button>
      </form>
    </main>
  );
}
