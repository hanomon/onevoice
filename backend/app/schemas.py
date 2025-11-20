from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class VOCCreate(BaseModel):
    user_name: str = Field(..., min_length=1)
    category: str = Field(..., pattern="^(프로세스 문의|시스템 문의|기타)$")
    content: str = Field(..., min_length=1)


class VOCResponse(BaseModel):
    id: int
    user_name: str
    category: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    answer: str
    sources: Optional[list[str]] = []


class FileUploadResponse(BaseModel):
    filename: str
    message: str
    file_id: int


class UploadedFileResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    upload_date: datetime
    processed: int

    class Config:
        from_attributes = True

