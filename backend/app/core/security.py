import base64
import hashlib
import hmac
import json
import secrets
import time

from fastapi import Header, HTTPException, status

from app.core.config import settings


def _secret() -> str:
    return settings.jwt_secret or settings.admin_api_key


def _base64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def create_access_token(subject: str = "admin") -> str:
    if not _secret():
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "La protección administrativa no está configurada")
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + settings.jwt_expiration_minutes * 60,
    }
    header_part = _base64url(json.dumps(header, separators=(",", ":")).encode())
    payload_part = _base64url(json.dumps(payload, separators=(",", ":")).encode())
    signing_input = f"{header_part}.{payload_part}".encode()
    signature = hmac.new(_secret().encode(), signing_input, hashlib.sha256).digest()
    return f"{header_part}.{payload_part}.{_base64url(signature)}"


def verify_access_token(token: str) -> bool:
    try:
        header_part, payload_part, signature_part = token.split(".")
        signing_input = f"{header_part}.{payload_part}".encode()
        expected = hmac.new(_secret().encode(), signing_input, hashlib.sha256).digest()
        signature = base64.urlsafe_b64decode(signature_part + "=" * (-len(signature_part) % 4))
        if not hmac.compare_digest(expected, signature):
            return False
        payload = json.loads(base64.urlsafe_b64decode(payload_part + "=" * (-len(payload_part) % 4)))
        return payload.get("exp", 0) >= int(time.time()) and payload.get("sub") == "admin"
    except Exception:
        return False


def require_admin_api_key(
    x_admin_api_key: str | None = Header(default=None),
    authorization: str | None = Header(default=None),
) -> None:
    if not settings.admin_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="La protección administrativa no está configurada",
        )
    if authorization and authorization.lower().startswith("bearer "):
        if verify_access_token(authorization[7:].strip()):
            return
    if x_admin_api_key and secrets.compare_digest(x_admin_api_key, settings.admin_api_key):
        return
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No autorizado")
