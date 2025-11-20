from fastapi import APIRouter, HTTPException
from ..schemas import ChatRequest, ChatResponse
from ..services.rag_service import RAGService

router = APIRouter(prefix="/api/chat", tags=["chat"])

# RAG 서비스 인스턴스 (지연 초기화)
_rag_service = None


def get_rag_service():
    """RAG 서비스를 지연 초기화하여 반환"""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """사용자 질문에 대한 AI 답변 생성"""
    try:
        rag_service = get_rag_service()
        result = rag_service.query(request.question)
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"답변 생성 중 오류가 발생했습니다: {str(e)}")

