from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import require_admin_api_key
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.content import Content, ContentRevision
from app.schemas.content import ContentResponse

router = APIRouter()

@router.get("", response_model=list[ContentResponse])
def list_posts(db: Session = Depends(get_db)):
    return db.query(Content).filter(Content.status == "published").order_by(Content.published_at.desc()).all()

@router.get("/{slug}", response_model=ContentResponse)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(Content).filter(Content.status == "published", Content.slug == slug).first()
    if not post: raise HTTPException(404, "Publicación no encontrada")
    return post


@router.post("/{slug}/view")
def register_post_view(slug: str, db: Session = Depends(get_db)):
    post = db.query(Content).filter(Content.status == "published", Content.slug == slug).first()
    if not post:
        raise HTTPException(404, "Publicación no encontrada")
    post.views += 1
    db.commit()
    db.refresh(post)
    return {"views": post.views}

@router.post("/{post_id}/unpublish", response_model=ContentResponse, dependencies=[Depends(require_admin_api_key)])
def unpublish_post(post_id: int, db: Session = Depends(get_db)):
    post = db.get(Content, post_id)
    if not post or post.status != "published":
        raise HTTPException(404, "Publicación no encontrada")
    db.add(ContentRevision(
        content_id=post.id, title=post.title, slug=post.slug, excerpt=post.excerpt,
        content=post.content, cover_image=post.cover_image, status=post.status, author=post.author,
    ))
    post.status = "draft"
    post.published_at = None
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin_api_key)])
def delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.get(Content, post_id)
    if not post or post.status != "published": raise HTTPException(404, "Publicación no encontrada")
    db.delete(post)
    db.commit()
