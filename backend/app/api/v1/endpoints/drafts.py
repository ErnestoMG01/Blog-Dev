from fastapi import APIRouter, Depends, HTTPException, status
import re
import unicodedata
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.models.content import Content, ContentRevision
from app.schemas.content import ContentInput, ContentResponse, ContentRevisionResponse, ContentUpdate
from app.core.security import require_admin_api_key

router = APIRouter()


def create_slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", normalized.lower()).strip("-")
    return slug or "post"


def unique_slug(db: Session, base_slug: str, exclude_id: int | None = None) -> str:
    slug = base_slug
    suffix = 2
    while True:
        query = db.query(Content).filter(Content.slug == slug)
        if exclude_id is not None:
            query = query.filter(Content.id != exclude_id)
        if not query.first():
            return slug
        slug = f"{base_slug}-{suffix}"
        suffix += 1


def snapshot(draft: Content, db: Session) -> None:
    db.add(ContentRevision(
        content_id=draft.id,
        title=draft.title,
        slug=draft.slug,
        excerpt=draft.excerpt,
        content=draft.content,
        cover_image=draft.cover_image,
        status=draft.status,
        author=draft.author,
    ))


@router.get("/{draft_id}/revisions", response_model=list[ContentRevisionResponse], dependencies=[Depends(require_admin_api_key)])
def list_revisions(draft_id: int, db: Session = Depends(get_db)):
    return db.query(ContentRevision).filter(ContentRevision.content_id == draft_id).order_by(ContentRevision.created_at.desc()).all()


@router.post("/{draft_id}/revisions/{revision_id}/restore", response_model=ContentResponse, dependencies=[Depends(require_admin_api_key)])
def restore_revision(draft_id: int, revision_id: int, db: Session = Depends(get_db)):
    draft = db.get(Content, draft_id)
    revision = db.get(ContentRevision, revision_id)
    if not draft or not revision or revision.content_id != draft_id:
        raise HTTPException(404, "Versión no encontrada")
    snapshot(draft, db)
    for field in ("title", "slug", "excerpt", "content", "cover_image", "status", "author"):
        setattr(draft, field, getattr(revision, field))
    db.commit()
    db.refresh(draft)
    return draft

@router.get("", response_model=list[ContentResponse], dependencies=[Depends(require_admin_api_key)])
def list_drafts(db: Session = Depends(get_db)):
    return db.query(Content).filter(Content.status == "draft").order_by(Content.updated_at.desc()).all()

@router.post("", response_model=ContentResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin_api_key)])
def create_draft(payload: ContentInput, db: Session = Depends(get_db)):
    data = payload.model_dump()
    base_slug = create_slug(payload.slug or payload.title)
    data["slug"] = unique_slug(db, base_slug)
    draft = Content(**data, status="draft")
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft

@router.get("/{draft_id}", response_model=ContentResponse, dependencies=[Depends(require_admin_api_key)])
def get_draft(draft_id: int, db: Session = Depends(get_db)):
    draft = db.get(Content, draft_id)
    if not draft: raise HTTPException(404, "Borrador no encontrado")
    return draft

@router.patch("/{draft_id}", response_model=ContentResponse, dependencies=[Depends(require_admin_api_key)])
def update_draft(draft_id: int, payload: ContentUpdate, db: Session = Depends(get_db)):
    draft = db.get(Content, draft_id)
    if not draft: raise HTTPException(404, "Borrador no encontrado")
    changes = payload.model_dump(exclude_unset=True)
    if changes.get("slug") is not None:
        changes["slug"] = unique_slug(db, create_slug(changes["slug"]), exclude_id=draft.id)
    if changes:
        snapshot(draft, db)
        for field, value in changes.items(): setattr(draft, field, value)
    db.commit()
    db.refresh(draft)
    return draft

@router.post("/{draft_id}/publish", response_model=ContentResponse, dependencies=[Depends(require_admin_api_key)])
def publish_draft(draft_id: int, db: Session = Depends(get_db)):
    draft = db.get(Content, draft_id)
    if not draft: raise HTTPException(404, "Borrador no encontrado")
    snapshot(draft, db)
    draft.status = "published"
    draft.published_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(draft)
    return draft

@router.delete("/{draft_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin_api_key)])
def delete_draft(draft_id: int, db: Session = Depends(get_db)):
    draft = db.get(Content, draft_id)
    if not draft: raise HTTPException(404, "Contenido no encontrado")
    db.delete(draft)
    db.commit()
