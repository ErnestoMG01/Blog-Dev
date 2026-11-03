import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postsService, type Post } from "../../../api/posts.service";
import StatusBadge from "../components/StatusBadge";

export function PostsListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      setPosts(await postsService.list());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudieron cargar las publicaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const unpublish = async (id: number) => {
    if (!window.confirm("¿Deseas despublicar esta entrada? Volverá a borradores.")) return;
    try { await postsService.unpublish(id); await refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo despublicar"); }
  };

  const remove = async (id: number) => {
    if (!window.confirm("¿Eliminar esta publicación permanentemente?")) return;
    try { await postsService.remove(id); await refresh(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo eliminar la publicación"); }
  };

  return (
    <main className="cms-admin">
      <aside className="cms-sidebar">
        <Link className="cms-brand" to="/">BLOG DEV CMS</Link>
        <nav><Link to="/admin">Dashboard</Link><Link to="/admin/drafts">Borradores</Link><Link to="/admin/posts">Publicaciones</Link></nav>
      </aside>
      <section className="cms-content">
        <header><p className="cms-kicker">GESTIÓN</p><h1>Publicaciones</h1></header>
        {error && <p className="cms-error">{error}</p>}
        {loading ? <p>Cargando publicaciones...</p> : (
          <div className="cms-table">
            <div className="cms-table-head cms-post-table"><span>Título</span><span>Estado</span><span>Fecha</span><span>Vistas</span><span>Acciones</span></div>
            {posts.map((post) => (
              <div className="cms-table-row cms-post-table" key={post.id}>
                <strong>{post.title}</strong>
                <StatusBadge status="published" />
                <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}</span>
                <span>{post.views ?? 0}</span>
                <div>
                  <Link className="cms-link" to={`/blog/${post.slug}`}>Ver</Link>
                  <Link className="cms-link" to={`/admin/drafts/${post.id}`}>Editar</Link>
                  <button onClick={() => void unpublish(post.id)}>Despublicar</button>
                  <button className="cms-danger" onClick={() => void remove(post.id)}>Eliminar</button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <div className="cms-empty">No hay publicaciones activas.</div>}
          </div>
        )}
      </section>
    </main>
  );
}

export default PostsListPage;
