import os
from pathlib import Path

from fastapi import Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import Base, engine, get_db
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models import content  # noqa: F401
from app.api.v1.api import router as api_router
from app.models.content import Content

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blog Dev CMS API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_headers=["Content-Type", "X-Admin-API-Key"],
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response

static_dir = Path(__file__).resolve().parent / "static"
(static_dir / "uploads").mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health():
    return {"status":"ok"}


@app.get("/sitemap.xml", response_class=Response)
def sitemap(db: Session = Depends(get_db)):
    posts = db.query(Content).filter(Content.status == "published").order_by(Content.updated_at.desc()).all()
    urls = [f"{settings.site_url.rstrip('/')}/", f"{settings.site_url.rstrip('/')}/blog"]
    urls.extend(f"{settings.site_url.rstrip('/')}/blog/{post.slug}" for post in posts)
    body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    body += "".join(f"<url><loc>{url}</loc></url>" for url in urls)
    body += "</urlset>"
    return Response(content=body, media_type="application/xml")
