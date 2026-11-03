from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.content import Content
from app.core.security import require_admin_api_key

router = APIRouter()

@router.get("", dependencies=[Depends(require_admin_api_key)])
def get_metrics(db: Session = Depends(get_db)):
    drafts = db.query(func.count(Content.id)).filter(Content.status == "draft").scalar() or 0
    posts = db.query(func.count(Content.id)).filter(Content.status == "published").scalar() or 0
    views = db.query(func.coalesce(func.sum(Content.views), 0)).scalar() or 0
    return {"drafts": drafts, "posts": posts, "views": views}
