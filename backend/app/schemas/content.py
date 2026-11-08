from datetime import datetime
from pydantic import BaseModel, ConfigDict

class ContentInput(BaseModel):
    title: str
    slug: str | None = None
    excerpt: str = ""
    content: str = ""
    cover_image: str | None = None
    author: str = "Ernesto Montes"

class ContentUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = None
    author: str | None = None

class ContentRevisionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    content_id: int
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image: str | None = None
    status: str
    author: str
    created_at: datetime


class ContentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image: str | None = None
    status: str
    author: str
    views: int = 0
    created_at: datetime
    updated_at: datetime
    published_at: datetime | None = None
