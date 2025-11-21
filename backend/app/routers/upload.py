from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from pathlib import Path
from ..database import get_db
from ..models import UploadedFile
from ..schemas import FileUploadResponse, UploadedFileResponse
from ..services.file_processor import FileProcessor
from ..services.rag_service import RAGService
from ..services.excel_analyzer import ExcelAnalyzer
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/upload", tags=["upload"])

# 업로드 디렉토리 설정
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 서비스 인스턴스
file_processor = FileProcessor()
_rag_service = None


def get_rag_service():
    """RAG 서비스를 지연 초기화하여 반환"""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service


@router.post("/", response_model=FileUploadResponse)
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """파일 업로드 및 처리"""
    try:
        # 파일 저장
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # DB에 파일 정보 저장
        file_extension = Path(file.filename).suffix.lower()
        db_file = UploadedFile(
            filename=file.filename,
            file_path=file_path,
            file_type=file_extension,
            processed=0
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)
        
        # 백그라운드에서 파일 처리 (실제로는 celery 등 사용 권장)
        try:
            # 텍스트 추출
            text = file_processor.extract_text(file_path)
            
            # 벡터 DB에 추가
            rag_service = get_rag_service()
            rag_service.add_documents(text, file.filename)
            
            # 처리 완료 상태 업데이트
            db_file.processed = 1
            db.commit()
            
            return FileUploadResponse(
                filename=file.filename,
                message="파일이 성공적으로 업로드되고 처리되었습니다.",
                file_id=db_file.id
            )
        except Exception as e:
            # 처리 실패 상태 업데이트
            db_file.processed = -1
            db.commit()
            raise HTTPException(status_code=500, detail=f"파일 처리 중 오류가 발생했습니다: {str(e)}")
            
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}")


@router.get("/files", response_model=List[UploadedFileResponse])
async def get_uploaded_files(db: Session = Depends(get_db)):
    """업로드된 파일 목록 조회"""
    try:
        files = db.query(UploadedFile).order_by(UploadedFile.upload_date.desc()).all()
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 목록 조회 중 오류가 발생했습니다: {str(e)}")


@router.delete("/{file_id}")
async def delete_file(file_id: int, db: Session = Depends(get_db)):
    """업로드된 파일 삭제"""
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    
    try:
        # 실제 파일 삭제
        if os.path.exists(file.file_path):
            os.remove(file.file_path)
        
        # DB에서 삭제
        db.delete(file)
        db.commit()
        
        return {"message": "파일이 성공적으로 삭제되었습니다."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"파일 삭제 중 오류가 발생했습니다: {str(e)}")


@router.get("/analyze-excel/{file_id}")
async def analyze_excel_file(file_id: int, db: Session = Depends(get_db)):
    """엑셀 파일 분석 (메타데이터 및 통계)"""
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    
    # 엑셀 파일인지 확인
    if file.file_type not in ['.xlsx', '.xls']:
        raise HTTPException(status_code=400, detail="엑셀 파일만 분석 가능합니다.")
    
    try:
        # 파일 분석
        analysis = ExcelAnalyzer.analyze_excel(file.file_path)
        
        # 요약 정보 생성
        summary = ExcelAnalyzer.generate_summary(file.file_path)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "analysis": analysis,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"엑셀 분석 중 오류가 발생했습니다: {str(e)}")


@router.post("/search-excel/{file_id}")
async def search_in_excel_file(
    file_id: int, 
    keyword: str, 
    db: Session = Depends(get_db)
):
    """엑셀 파일 내에서 키워드 검색"""
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="파일을 찾을 수 없습니다.")
    
    # 엑셀 파일인지 확인
    if file.file_type not in ['.xlsx', '.xls']:
        raise HTTPException(status_code=400, detail="엑셀 파일만 검색 가능합니다.")
    
    try:
        # 엑셀 내에서 검색
        results = ExcelAnalyzer.search_in_excel(file.file_path, keyword)
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "keyword": keyword,
            "result_count": len(results),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"엑셀 검색 중 오류가 발생했습니다: {str(e)}")

