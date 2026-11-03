export default function StatusBadge({ status }: { status: "draft" | "published" }) {
  return <span className={`status-badge status-${status}`}>{status === "draft" ? "Borrador" : "Publicado"}</span>;
}
