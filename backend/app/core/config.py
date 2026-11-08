from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    database_url: str = "sqlite:///./blog_dev.db"
    allowed_origins: str = (
        "http://localhost:5173,http://localhost:3000,http://localhost:8443,"
        "https://ernestomg01.github.io"
    )
    cors_origins: str | None = None
    admin_api_key: str = ""
    jwt_secret: str = ""
    jwt_expiration_minutes: int = 60
    max_upload_bytes: int = 5 * 1024 * 1024
    site_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str | None) -> str:
        url = value or "sqlite:///./blog_dev.db"
        if url.startswith("postgres://"):
            return url.replace("postgres://", "postgresql://", 1)
        return url

settings = Settings()
