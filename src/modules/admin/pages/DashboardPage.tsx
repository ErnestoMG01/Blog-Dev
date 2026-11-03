import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../../api/client";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({ drafts: 0, posts: 0, views: 0 });
  useEffect(() => {
    apiClient<{ drafts: number; posts: number; views: number }>("/metrics")
      .then(setMetrics)
      .catch(() => undefined);
  }, []);

  return (
    <main className="cms-admin">
      <aside className="cms-sidebar"><Link className="cms-brand" to="/">BLOG DEV CMS</Link><nav><Link to="/admin">Dashboard</Link><Link to="/admin/drafts">Borradores</Link><Link to="/admin/posts">Publicaciones</Link><Link to="/blog">Ver blog</Link></nav></aside>
      <section className="cms-content">
        <header><p className="cms-kicker">CMS DASHBOARD</p><h1>Contenido</h1></header>
        <div className="cms-dashboard-grid">
          <Link to="/admin/drafts"><strong>+</strong><span>Crear borrador</span></Link>
          <Link to="/admin/drafts"><strong>{metrics.drafts}</strong><span>Borradores</span></Link>
          <Link to="/admin/posts"><strong>{metrics.posts}</strong><span>Publicaciones · {metrics.views} vistas</span></Link>
        </div>
      </section>
    </main>
  );
}
