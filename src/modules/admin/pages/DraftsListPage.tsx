import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DraftsService, type Draft } from "../../../api/drafts.service";
import StatusBadge from "../components/StatusBadge";

export function DraftsListPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDrafts = async () => {
    setLoading(true);
    setError("");
    try {
      const content = await DraftsService.getAll();
      setDrafts(content.filter((draft) => draft.status === "draft"));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudieron cargar los borradores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadDrafts(); }, []);

  const handlePublish = async (id: number) => {
    if (!window.confirm("¿Deseas publicar este borrador?")) return;
    try {
      await DraftsService.publish(id);
      await loadDrafts();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo publicar el borrador");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Eliminar borrador permanentemente?")) return;
    try {
      await DraftsService.delete(id);
      await loadDrafts();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo eliminar el borrador");
    }
  };

  return (
    <main className="cms-admin">
      <aside className="cms-sidebar">
        <Link className="cms-brand" to="/">BLOG DEV CMS</Link>
        <nav><Link to="/admin">Dashboard</Link><Link to="/admin/drafts">Borradores</Link><Link to="/admin/posts">Publicaciones</Link></nav>
      </aside>
      <section className="cms-content">
        <header><p className="cms-kicker">GESTIÓN</p><h1>Borradores</h1><Link className="cms-primary" to="/admin/drafts/new">+ Crear borrador</Link></header>
        {error && <p className="cms-error">{error}</p>}
        {loading ? <p>Cargando borradores...</p> : (
          <div className="cms-table">
            <div className="cms-table-head cms-draft-table"><span>Título</span><span>Estado</span><span>Última edición</span><span>Acciones</span></div>
            {drafts.map((draft) => (
              <div className="cms-table-row cms-draft-table" key={draft.id}>
                <strong>{draft.title}</strong>
                <StatusBadge status={draft.status} />
                <span>{new Date(draft.updated_at).toLocaleDateString()}</span>
                <div>
                  <button onClick={() => navigate(`/admin/drafts/${draft.id}`)}>Editar</button>
                  <button onClick={() => void handlePublish(draft.id)}>Publicar</button>
                  <button className="cms-danger" onClick={() => void handleDelete(draft.id)}>Eliminar</button>
                </div>
              </div>
            ))}
            {drafts.length === 0 && <div className="cms-empty">No hay borradores pendientes.</div>}
          </div>
        )}
      </section>
    </main>
  );
}

export default DraftsListPage;
