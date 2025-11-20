from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from .database import Base


class VOC(Base):
    __tablename__ = "voc"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # 프로세스 문의, 시스템 문의, 기타
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    processed = Column(Integer, default=0)  # 0: 대기, 1: 완료, -1: 실패

