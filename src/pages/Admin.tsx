import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1")
  .replace(/\/$/, "");

function apiV1Base() {
  return /\/api\/v1$/i.test(API_BASE) ? API_BASE : `${API_BASE}/api/v1`;
}

type Post = {
  id: number | string;
  title: string;
  content?: string;
  published?: boolean;
  status?: "draft" | "published";
  created_at?: string;
  slug?: string;
};

export default function Admin() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const headers = (): HeadersInit => {
    const token = localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(import.meta.env.VITE_ADMIN_API_KEY
        ? { "X-Admin-API-Key": String(import.meta.env.VITE_ADMIN_API_KEY) }
        : {}),
    };
  };

  const loadPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiV1Base()}/posts`, { headers: headers() });
      if (response.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/login", { replace: true });
        return;
      }
      if (!response.ok) throw new Error("No se pudieron cargar los artículos.");
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Error al cargar los artículos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/login", { replace: true });
      return;
    }
    void loadPosts();
  }, [navigate]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setPublished(false);
  };

  const savePost = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const endpoint = editingId === null
        ? `${apiV1Base()}/posts`
        : `${apiV1Base()}/posts/${encodeURIComponent(String(editingId))}`;

      let response = await fetch(endpoint, {
        method: editingId === null ? "POST" : "PATCH",
        headers: headers(),
        body: JSON.stringify({ title, content, published }),
      });

      if (!response.ok && editingId === null && (response.status === 404 || response.status === 405)) {
        response = await fetch(`${apiV1Base()}/drafts`, {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({
            title,
            slug: "",
            excerpt: content.slice(0, 160),
            content,
            cover_image: "",
            author: "Ernesto Montes",
          }),
        });
        if (response.ok && published) {
          const draft = await response.json();
          response = await fetch(`${apiV1Base()}/drafts/${draft.id}/publish`, {
            method: "POST",
            headers: headers(),
          });
        }
      }

      if (!response.ok) throw new Error("No se pudo guardar el artículo.");
      resetForm();
      await loadPosts();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo guardar el artículo.");
    } finally {
      setSaving(false);
    }
  };

  const editPost = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content ?? "");
    setPublished(post.published ?? post.status === "published");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePost = async (id: number | string) => {
    if (!window.confirm("¿Eliminar este artículo?")) return;
    setError("");
    try {
      const response = await fetch(`${apiV1Base()}/posts/${encodeURIComponent(String(id))}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (!response.ok && response.status === 404) {
        const draftResponse = await fetch(`${apiV1Base()}/drafts/${encodeURIComponent(String(id))}`, {
          method: "DELETE",
          headers: headers(),
        });
        if (!draftResponse.ok) throw new Error("No se pudo eliminar el artículo.");
      } else if (!response.ok) {
        throw new Error("No se pudo eliminar el artículo.");
      }
      await loadPosts();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "No se pudo eliminar el artículo.");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#102327] text-[#ddd0b3]" style={{ fontFamily: "DM Sans, Arial, sans-serif" }}>
      <nav className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#102327]/85 px-5 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          <p className="text-sm font-black uppercase tracking-[0.16em]">Blog Dev <span className="text-[#4f8e8c]">CMS</span></p>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-zinc-700 bg-zinc-900/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#ddd0b3] transition hover:border-[#c65c2e]/70 hover:bg-[#c65c2e]/15 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:px-8 sm:py-10">
        <section className="h-fit rounded-2xl border border-zinc-800 bg-[#123f49]/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#4f8e8c]">
            {editingId === null ? "Nuevo contenido" : "Editar contenido"}
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight" style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}>
            {editingId === null ? "Crear artículo" : "Editar artículo"}
          </h1>

          <form onSubmit={savePost} className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#ddd0b3]/75">Título</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="w-full rounded-xl border border-zinc-800 bg-[#102327]/80 px-4 py-3 text-[#ddd0b3] outline-none transition focus:border-[#4f8e8c] focus:ring-2 focus:ring-[#4f8e8c]/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#ddd0b3]/75">Contenido</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
                rows={12}
                className="min-h-72 w-full resize-y rounded-xl border border-zinc-800 bg-[#102327]/80 px-4 py-3 leading-7 text-[#ddd0b3] outline-none transition focus:border-[#4f8e8c] focus:ring-2 focus:ring-[#4f8e8c]/20"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800 bg-[#102327]/50 p-3.5">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="h-4 w-4 accent-[#c65c2e]"
              />
              <span className="text-sm font-semibold">{published ? "Publicado" : "Guardar como borrador"}</span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl border border-[#c65c2e]/50 bg-[#c65c2e] px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-[#d56a3a] disabled:opacity-60"
              >
                {saving ? "Guardando..." : editingId === null ? "Publicar artículo" : "Guardar cambios"}
              </button>
              {editingId !== null && (
                <button type="button" onClick={resetForm} className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold text-[#ddd0b3] transition hover:bg-zinc-800">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-[#123f49]/70 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#4f8e8c]">Biblioteca</p>
          <h2 className="text-3xl font-black uppercase tracking-tight" style={{ fontFamily: "Barlow Condensed, Arial Narrow, sans-serif" }}>
            Lista de artículos
          </h2>

          {error && <p role="alert" className="mt-5 rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">{error}</p>}
          {loading ? (
            <p className="mt-6 text-sm text-[#ddd0b3]/60">Cargando artículos...</p>
          ) : posts.length === 0 ? (
            <p className="mt-6 rounded-xl border border-zinc-800 bg-[#102327]/50 p-5 text-sm text-[#ddd0b3]/60">No hay artículos publicados.</p>
          ) : (
            <div className="mt-6 space-y-3">
              {posts.map((post) => (
                <article key={String(post.id)} className="rounded-xl border border-zinc-800 bg-[#102327]/55 p-4 transition hover:-translate-y-0.5 hover:border-[#4f8e8c]/60 hover:bg-[#102327]/80">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-[#ddd0b3]">{post.title}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#ddd0b3]/45">
                        {(post.published ?? post.status === "published") ? "Publicado" : "Borrador"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => editPost(post)} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-bold transition hover:border-[#4f8e8c] hover:text-[#9ec5c2]">Editar</button>
                      <button type="button" onClick={() => void deletePost(post.id)} className="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-950/50">Eliminar</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
