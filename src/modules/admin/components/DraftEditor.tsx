import { useState, type FormEvent } from "react";
import type { DraftInput } from "../../../api/drafts.service";

const emptyDraft: DraftInput = { title: "", slug: "", excerpt: "", content: "", cover_image: "", author: "Ernesto Montes" };

export default function DraftEditor({ onSave }: { onSave: (draft: DraftInput) => Promise<void> }) {
  const [draft, setDraft] = useState<DraftInput>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const update = (field: keyof DraftInput, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    await onSave(draft);
    setDraft(emptyDraft);
    setSaving(false);
  };
  return (
    <form className="cms-editor" onSubmit={submit}>
      <div className="cms-editor-grid">
        <label>Título<input value={draft.title} onChange={(event) => update("title", event.target.value)} required /></label>
        <label>Slug<input value={draft.slug} onChange={(event) => update("slug", event.target.value)} required /></label>
      </div>
      <label>Extracto<textarea value={draft.excerpt} onChange={(event) => update("excerpt", event.target.value)} rows={2} required /></label>
      <label>Contenido<textarea value={draft.content} onChange={(event) => update("content", event.target.value)} rows={10} required /></label>
      <label>Imagen de portada<input value={draft.cover_image} onChange={(event) => update("cover_image", event.target.value)} /></label>
      <button className="cms-primary" disabled={saving} type="submit">{saving ? "Guardando..." : "Guardar borrador"}</button>
    </form>
  );
}
