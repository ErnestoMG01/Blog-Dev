import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { assetsService } from "../../../api/assets.service";
import { draftsService, type ContentRevision, type Draft, type DraftInput } from "../../../api/drafts.service";

const emptyDraft: DraftInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  author: "Ernesto Montes",
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function DraftEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState<DraftInput>(emptyDraft);
  const [status, setStatus] = useState<Draft["status"]>("draft");
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(Boolean(id));
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);

  useEffect(() => {
    if (!id) return;
    draftsService.get(Number(id)).then((value) => {
      setDraft({
        title: value.title,
        slug: value.slug,
        excerpt: value.excerpt,
        content: value.content,
        cover_image: value.cover_image ?? "",
        author: value.author,
      });
      setStatus(value.status);
      draftsService.revisions(Number(id)).then(setRevisions).catch(() => setRevisions([]));
      setLoading(false);
    }).catch((reason) => {
      setError(reason.message);
      setLoading(false);
    });
  }, [id]);

  const update = (field: keyof DraftInput, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const updateTitle = (value: string) => {
    setDraft((current) => ({
      ...current,
      title: value,
      slug: slugEdited ? current.slug : createSlug(value),
    }));
  };

  const persist = async (publish: boolean) => {
    setSaving(true);
    setError("");
    try {
      let saved: Draft;
      if (id) {
        saved = await draftsService.update(Number(id), draft);
        if (publish) saved = await draftsService.publish(saved.id);
      } else {
        saved = await draftsService.create(draft);
        if (publish) saved = await draftsService.publish(saved.id);
      }
      setStatus(saved.status);
      if (publish) navigate("/admin/posts");
      else navigate(`/admin/drafts/${saved.id}/edit`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar el borrador");
    } finally {
      setSaving(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void persist(false);
  };

  const restoreRevision = async (revisionId: number) => {
    if (!id || !window.confirm("¿Restaurar esta versión? Se guardará una versión de seguridad antes de restaurar.")) return;
    try {
      const restored = await draftsService.restoreRevision(Number(id), revisionId);
      setDraft({ title: restored.title, slug: restored.slug, excerpt: restored.excerpt, content: restored.content, cover_image: restored.cover_image ?? "", author: restored.author });
      setStatus(restored.status);
      setRevisions(await draftsService.revisions(Number(id)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo restaurar la versión");
    }
  };

  const uploadCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const asset = await assetsService.upload(file);
      update("cover_image", asset.url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const uploadMarkdownImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const asset = await assetsService.upload(file);
      const markdown = `![${file.name}](${asset.url})`;
      const textarea = contentRef.current;
      const start = textarea?.selectionStart ?? draft.content.length;
      const end = textarea?.selectionEnd ?? start;
      const nextContent = `${draft.content.slice(0, start)}${markdown}${draft.content.slice(end)}`;
      update("content", nextContent);
      requestAnimationFrame(() => {
        if (!textarea) return;
        textarea.focus();
        textarea.setSelectionRange(start + markdown.length, start + markdown.length);
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  if (loading) return <main className="cms-admin"><p>Cargando editor...</p></main>;

  return (
    <main className="cms-admin">
      <aside className="cms-sidebar">
        <Link className="cms-brand" to="/">BLOG DEV CMS</Link>
        <nav><Link to="/admin">Dashboard</Link><Link to="/admin/drafts">Borradores</Link><Link to="/admin/posts">Publicaciones</Link></nav>
      </aside>
      <section className="cms-content">
        <header><p className="cms-kicker">EDITOR MARKDOWN</p><h1>{id ? "Editar borrador" : "Nuevo borrador"}</h1></header>
        {error && <p className="cms-error">{error}</p>}
        <form className="cms-editor" onSubmit={submit}>
          <div className="cms-editor-grid">
            <label>Título<input value={draft.title} onChange={(event) => updateTitle(event.target.value)} required /></label>
            <label>Slug<input value={draft.slug} onChange={(event) => { setSlugEdited(true); update("slug", event.target.value); }} required /></label>
          </div>
          <label>Extracto<textarea value={draft.excerpt} onChange={(event) => update("excerpt", event.target.value)} rows={2} required /></label>
          <label>Autor<input value={draft.author} onChange={(event) => update("author", event.target.value)} required /></label>
          <div className="cms-editor-grid">
            <label>Imagen de portada<input value={draft.cover_image ?? ""} onChange={(event) => update("cover_image", event.target.value)} /></label>
            <label>Subir portada<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadCover} disabled={uploading} /></label>
          </div>
          <div className="cms-markdown-toolbar">
            <label className="cms-upload-button">Insertar imagen Markdown<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadMarkdownImage} disabled={uploading} /></label>
            <span>{uploading ? "Subiendo..." : `Estado: ${status}`}</span>
          </div>
          <div className="cms-markdown-grid">
            <label>Contenido Markdown<textarea ref={contentRef} value={draft.content} onChange={(event) => update("content", event.target.value)} rows={18} required /></label>
            <article className="cms-markdown-preview">
              <h3>Vista previa</h3>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.content || "Escribe contenido Markdown..."}</ReactMarkdown>
            </article>
          </div>
          {revisions.length > 0 && (
            <details className="cms-history">
              <summary>Historial y versiones ({revisions.length})</summary>
              {revisions.map((revision) => (
                <div key={revision.id} className="cms-history-row">
                  <span>{revision.title} · {new Date(revision.created_at).toLocaleString()}</span>
                  <button type="button" onClick={() => void restoreRevision(revision.id)}>Restaurar</button>
                </div>
              ))}
            </details>
          )}
          <div className="cms-editor-actions">
            <button className="cms-primary" type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar borrador"}</button>
            <button type="button" className="cms-publish" disabled={saving} onClick={() => void persist(true)}>Publicar</button>
          </div>
        </form>
      </section>
    </main>
  );
}
