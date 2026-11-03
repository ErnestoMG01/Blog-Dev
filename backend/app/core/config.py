from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "sqlite:///./blog_dev.db"
    cors_origins: str = "http://localhost:5173,http://localhost:8443"
    admin_api_key: str = ""
    max_upload_bytes: int = 5 * 1024 * 1024
    site_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
