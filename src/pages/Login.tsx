import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1")
  .replace(/\/$/, "");

function apiV1Base() {
  return /\/api\/v1$/i.test(API_BASE) ? API_BASE : `${API_BASE}/api/v1`;
}

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_token")) navigate("/admin", { replace: true });
  }, [navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const responseLogin = await fetch(`${apiV1Base()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      let response = responseLogin;
      if (responseLogin.status === 404 || responseLogin.status === 405) {
        response = await fetch(`${apiV1Base()}/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          typeof body?.detail === "string" ? body.detail : "Clave de administrador incorrecta.",
        );
      }

      const data = await response.json();
      const token = data.access_token ?? data.token;
      if (!token) throw new Error("El servidor no devolvió un token válido.");

      localStorage.setItem("admin_token", token);
      navigate("/admin", { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#102327] text-[#ddd0b3] flex items-center justify-center px-5 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,142,140,.28),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(198,92,46,.18),transparent_38%)]" />
      <div className="absolute left-[-5rem] top-[-5rem] h-64 w-64 rounded-full border border-[#4f8e8c]/20" />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-[#123f49]/75 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9"
      >
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#4f8e8c]">Acceso privado</p>
        <h1 className="text-4xl font-black uppercase tracking-tight text-[#ddd0b3]" style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}>
          Panel Administrativo
        </h1>
        <p className="mt-3 mb-7 text-sm leading-6 text-[#ddd0b3]/65">
          Introduce la clave para gestionar las publicaciones del blog.
        </p>

        <label htmlFor="admin-key" className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#ddd0b3]/80">
          Clave de administrador
        </label>
        <input
          id="admin-key"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          placeholder="••••••••••"
          className="w-full rounded-xl border border-zinc-800 bg-[#102327]/80 px-4 py-3.5 text-[#ddd0b3] outline-none transition placeholder:text-zinc-600 focus:border-[#4f8e8c] focus:ring-2 focus:ring-[#4f8e8c]/20"
        />

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#c65c2e]/50 bg-[#c65c2e] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[#fff7e6] shadow-lg shadow-[#c65c2e]/10 transition hover:-translate-y-0.5 hover:bg-[#d56a3a] hover:shadow-[#c65c2e]/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>
    </main>
  );
}
