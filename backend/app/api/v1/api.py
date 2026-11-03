from fastapi import APIRouter
from app.api.v1.endpoints import assets, auth, drafts, metrics, posts

router = APIRouter()
router.include_router(drafts.router, prefix="/drafts", tags=["drafts"])
router.include_router(posts.router, prefix="/posts", tags=["posts"])
router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(assets.router, prefix="/assets", tags=["assets"])
