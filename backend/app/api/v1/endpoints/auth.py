from fastapi import APIRouter, Depends
from app.core.security import require_admin_api_key

router = APIRouter()


@router.post("/verify")
def verify_admin(_: None = Depends(require_admin_api_key)):
    return {"authenticated": True}
