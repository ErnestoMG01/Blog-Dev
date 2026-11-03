import mimetypes
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from app.core.config import settings
from app.core.security import require_admin_api_key

router = APIRouter()

STATIC_DIR = Path(__file__).resolve().parents[3] / "static" / "uploads"
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@router.post("/upload")
async def upload_image(request: Request, file: UploadFile = File(...), _: None = Depends(require_admin_api_key)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Solo se permiten imágenes JPEG, PNG, WEBP o GIF")

    extension = Path(file.filename or "").suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        guessed = mimetypes.guess_extension(file.content_type or "")
        extension = guessed if guessed in {".jpg", ".jpeg", ".png", ".webp", ".gif"} else ""
    if not extension:
        raise HTTPException(status_code=415, detail="Extensión de imagen no válida")

    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    safe_name = f"{uuid.uuid4().hex}{extension}"
    destination = STATIC_DIR / safe_name

    total_bytes = 0
    signatures: dict[str, bytes] = {
        "image/jpeg": b"\xff\xd8\xff",
        "image/png": b"\x89PNG\r\n\x1a\n",
        "image/webp": b"RIFF",
        "image/gif": b"GIF8",
    }
    try:
        with destination.open("wb") as output:
            while chunk := await file.read(1024 * 1024):
                total_bytes += len(chunk)
                if total_bytes > settings.max_upload_bytes:
                    raise HTTPException(status_code=413, detail="La imagen supera el tamaño máximo permitido")
                if total_bytes == len(chunk):
                    valid = chunk.startswith(signatures[file.content_type])
                    if file.content_type == "image/webp":
                        valid = valid and len(chunk) >= 12 and chunk[8:12] == b"WEBP"
                    if not valid:
                        raise HTTPException(status_code=415, detail="El contenido no corresponde a una imagen válida")
                output.write(chunk)
    except HTTPException:
        destination.unlink(missing_ok=True)
        raise
    except Exception:
        destination.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail="No se pudo guardar la imagen")
    finally:
        await file.close()

    relative_url = f"/static/uploads/{safe_name}"
    absolute_url = f"{str(request.base_url).rstrip('/')}{relative_url}"
    return {"filename": safe_name, "url": absolute_url, "path": relative_url}
