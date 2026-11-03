import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router-dom";
import { postsService, type Post } from "../../../api/posts.service";
import SEO from "../../../components/SEO";

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (slug) postsService.get(slug).then(setPost).catch((reason) => setError(reason instanceof Error ? reason.message : "No se pudo cargar la publicación")); }, [slug]);
  return (
    <main className="cms-page blog-page">
      {post && <SEO title={`${post.title} | Blog Dev`} description={post.excerpt} image={post.cover_image} type="article" />}
      <header className="cms-header"><Link className="cms-brand" to="/blog">BLOG DEV</Link><nav><Link to="/blog">Todas las notas</Link></nav></header>
      {error ? <p className="cms-error">{error}</p> : post && (
        <article className="cms-post">
          <p className="cms-kicker">{post.author}</p>
          <h1>{post.title}</h1>
          <p className="cms-lead">{post.excerpt}</p>
          {post.cover_image && <img className="cms-post-cover" src={post.cover_image} alt={post.title} />}
          <div className="cms-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div>
        </article>
      )}
    </main>
  );
}

export default BlogPostPage;
