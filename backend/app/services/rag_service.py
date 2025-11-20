import os
import ssl
import urllib3
from typing import List, Dict
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
import requests
from dotenv import load_dotenv
import chromadb
from chromadb.config import Settings

# SSL 검증 우회 (개발 환경용)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
os.environ['CURL_CA_BUNDLE'] = ''
os.environ['REQUESTS_CA_BUNDLE'] = ''
os.environ['HF_HUB_DISABLE_SSL_VERIFY'] = '1'
os.environ['CURL_CA_BUNDLE'] = ''
ssl._create_default_https_context = ssl._create_unverified_context

load_dotenv()


class SimpleEmbeddings:
    """간단한 임베딩 함수 - 외부 모델 다운로드 없이 작동"""
    
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """문서 임베딩 생성 (간단한 해시 기반)"""
        import hashlib
        embeddings = []
        for text in texts:
            # 텍스트를 해시하여 384차원 벡터 생성
            hash_obj = hashlib.sha384(text.encode())
            hash_bytes = hash_obj.digest()
            # 바이트를 -1.0 ~ 1.0 범위의 float로 변환
            embedding = [(b / 127.5) - 1.0 for b in hash_bytes[:384]]
            embeddings.append(embedding)
        return embeddings
    
    def embed_query(self, text: str) -> List[float]:
        """쿼리 임베딩 생성"""
        return self.embed_documents([text])[0]


class RAGService:
    """RAG 파이프라인을 관리하는 서비스"""
    
    def __init__(self):
        self.chroma_persist_dir = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
        self.ai_api_url = os.getenv("AI_API_URL")
        self.ai_model = os.getenv("AI_MODEL", "GPT-OSS-120B")
        self.ai_api_key = os.getenv("AI_API_KEY", "")
        
        # 임베딩 함수 초기화 (외부 모델 다운로드 없이 작동하는 간단한 임베딩)
        self.embedding_function = SimpleEmbeddings()
        
        # ChromaDB 초기화 (LangChain 호환 임베딩 함수 사용)
        self.vectorstore = Chroma(
            persist_directory=self.chroma_persist_dir,
            collection_name="documents",
            embedding_function=self.embedding_function
        )
    
    def add_documents(self, text: str, filename: str) -> None:
        """문서를 벡터 DB에 추가"""
        # 텍스트를 청크로 분할
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        chunks = text_splitter.split_text(text)
        
        # Document 객체 생성
        documents = [
            Document(
                page_content=chunk,
                metadata={"source": filename, "chunk_index": i}
            )
            for i, chunk in enumerate(chunks)
        ]
        
        # 벡터 DB에 추가
        self.vectorstore.add_documents(documents)
        self.vectorstore.persist()
    
    def search_documents(self, query: str, k: int = 5) -> List[Dict]:
        """유사한 문서 검색"""
        results = self.vectorstore.similarity_search_with_score(query, k=k)
        
        return [
            {
                "content": doc.page_content,
                "source": doc.metadata.get("source", "Unknown"),
                "score": float(score)
            }
            for doc, score in results
        ]
    
    def generate_answer(self, question: str, context: str) -> str:
        """AI API를 사용하여 답변 생성"""
        prompt = f"""다음 문서 내용을 참고하여 질문에 답변해주세요.

문서 내용:
{context}

질문: {question}

답변: 위 문서 내용을 바탕으로 정확하고 자세하게 답변해주세요."""

        try:
            headers = {
                "Content-Type": "application/json"
            }
            
            if self.ai_api_key:
                headers["Authorization"] = f"Bearer {self.ai_api_key}"
            
            payload = {
                "model": self.ai_model,
                "messages": [
                    {"role": "system", "content": "당신은 업로드된 문서의 내용을 바탕으로 사용자의 질문에 답변하는 전문 AI 어시스턴트입니다. 문서 내용을 기반으로 정확하고 친절하게 답변해주세요."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 2000  # GPT-OSS-120B는 추론 과정과 답변을 모두 생성하므로 충분한 토큰 할당
            }
            
            response = requests.post(
                self.ai_api_url,
                headers=headers,
                json=payload,
                timeout=30,
                verify=False  # SSL 검증 우회 (개발 환경용)
            )
            
            if response.status_code == 200:
                result = response.json()
                choices = result.get("choices", [])
                if choices:
                    message = choices[0].get("message", {})
                    # content가 있으면 사용, 없으면 reasoning_content 사용 (GPT-OSS-120B의 특징)
                    answer = message.get("content") or message.get("reasoning_content", "답변을 생성할 수 없습니다.")
                    return answer
                return "답변을 생성할 수 없습니다."
            else:
                return f"AI API 오류 (상태 코드: {response.status_code}): 답변을 생성할 수 없습니다."
                
        except Exception as e:
            return f"답변 생성 중 오류가 발생했습니다: {str(e)}"
    
    def query(self, question: str) -> Dict[str, any]:
        """질문에 대한 답변 생성 (RAG 파이프라인)"""
        # 1. 관련 문서 검색
        search_results = self.search_documents(question, k=3)
        
        if not search_results:
            return {
                "answer": "죄송합니다. 업로드된 문서에서 관련 정보를 찾을 수 없습니다. 관리자 모드에서 관련 문서를 업로드해주세요.",
                "sources": []
            }
        
        # 2. 컨텍스트 생성
        context = "\n\n---\n\n".join([result["content"] for result in search_results])
        
        # 3. AI 답변 생성
        answer = self.generate_answer(question, context)
        
        # 4. 출처 정보
        sources = list(set([result["source"] for result in search_results]))
        
        return {
            "answer": answer,
            "sources": sources
        }

