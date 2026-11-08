import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import create_access_token, require_admin_api_key
from app.core.config import settings

router = APIRouter()


class LoginRequest(BaseModel):
    email: str | None = None
    username: str | None = None
    password: str


@router.post("/login")
def login(payload: LoginRequest):
    if not settings.admin_api_key:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "La protección administrativa no está configurada")
    if not secrets.compare_digest(payload.password, settings.admin_api_key):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales incorrectas")
    return {"access_token": create_access_token(), "token_type": "bearer"}


@router.post("/verify")
def verify_admin(_: None = Depends(require_admin_api_key)):
    return {"authenticated": True}
