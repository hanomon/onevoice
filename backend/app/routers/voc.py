from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import VOC
from ..schemas import VOCCreate, VOCResponse

router = APIRouter(prefix="/api/voc", tags=["voc"])


@router.post("/", response_model=VOCResponse)
async def create_voc(voc: VOCCreate, db: Session = Depends(get_db)):
    """VOC 생성"""
    try:
        db_voc = VOC(
            user_name=voc.user_name,
            category=voc.category,
            content=voc.content
        )
        db.add(db_voc)
        db.commit()
        db.refresh(db_voc)
        return db_voc
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"VOC 저장 중 오류가 발생했습니다: {str(e)}")


@router.get("/", response_model=List[VOCResponse])
async def get_all_voc(db: Session = Depends(get_db)):
    """모든 VOC 조회"""
    try:
        vocs = db.query(VOC).order_by(VOC.created_at.desc()).all()
        return vocs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"VOC 조회 중 오류가 발생했습니다: {str(e)}")


@router.get("/{voc_id}", response_model=VOCResponse)
async def get_voc(voc_id: int, db: Session = Depends(get_db)):
    """특정 VOC 조회"""
    voc = db.query(VOC).filter(VOC.id == voc_id).first()
    if not voc:
        raise HTTPException(status_code=404, detail="VOC를 찾을 수 없습니다.")
    return voc

