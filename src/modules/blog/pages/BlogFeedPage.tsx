import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postsService, type Post } from "../../../api/posts.service";
import SEO from "../../../components/SEO";

export function BlogFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    postsService.list()
      .then(setPosts)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudo conectar con la API"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="cms-page blog-page">
      <SEO title="Blog Dev | Artículos de desarrollo" description="Artículos, tutoriales y notas sobre desarrollo de software." />
      <header className="cms-header"><Link className="cms-brand" to="/">BLOG DEV</Link><nav><Link to="/">Landing</Link><Link to="/admin">CMS</Link></nav></header>
      <section>
        <p className="cms-kicker">PUBLICACIONES</p><h1>Bitácora Dev</h1>
        {error && <p className="cms-error">No se pudo conectar con la API: {error}</p>}
        {loading && <p>Cargando publicaciones...</p>}
        {!loading && !error && posts.length === 0 && <p>No hay publicaciones disponibles.</p>}
        <div className="cms-post-grid">
          {posts.map((post) => (
            <article key={post.id}>
              {post.cover_image && <img src={post.cover_image} alt="" />}
              <span>{post.author}</span>
              <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
              <p>{post.excerpt}</p>
              <small>{post.views ?? 0} vistas</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BlogFeedPage;
