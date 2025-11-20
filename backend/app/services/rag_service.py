import os
import ssl
import urllib3
import json
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
    
    def search_documents(self, query: str, k: int = 10) -> List[Dict]:
        """유사한 문서 검색 (여러 문서에서 검색)"""
        results = self.vectorstore.similarity_search_with_score(query, k=k)
        
        return [
            {
                "content": doc.page_content,
                "source": doc.metadata.get("source", "Unknown"),
                "score": float(score)
            }
            for doc, score in results
        ]
    
    def generate_answer(self, question: str, context: str, sources: List[str]) -> str:
        """AI API를 사용하여 답변 생성"""
        # 출처별로 문서 구분
        sources_info = "관련 문서: " + ", ".join(set(sources))
        
        prompt = f"""다음 여러 문서의 내용을 참고하여 질문에 답변해주세요.

{sources_info}

문서 내용:
{context}

질문: {question}

답변 규칙:
1. 질문에서 핵심 키워드를 정확히 파악하세요
2. 여러 문서의 내용을 종합적으로 분석하세요
3. 여러 문서가 있는 경우 각 문서의 내용을 비교하고 차이점을 설명하세요
4. 문서에 해당 키워드나 관련 내용이 없다면 "죄송하지만, 업로드된 문서에서 해당 키워드에 대한 내용을 찾을 수 없습니다. 관련 문서를 추가로 업로드해주세요."라고 답변하세요
5. 답변은 반드시 한글로만 작성하세요
6. HTML 태그(<br>, <p> 등)는 절대 사용하지 마세요
7. 답변은 다음과 같이 깔끔하게 구조화하세요:

【제목 또는 주제】

1. 첫 번째 요점
   - 세부 내용
   - 추가 설명

2. 두 번째 요점
   - 세부 내용
   - 추가 설명

【정리】
간단한 요약

8. 각 섹션 사이에는 빈 줄을 두어 가독성을 높이세요
9. 번호, 불릿, 들여쓰기를 활용하여 구조를 명확히 하세요"""

        try:
            headers = {
                "Content-Type": "application/json; charset=utf-8"
            }
            
            if self.ai_api_key:
                headers["Authorization"] = f"Bearer {self.ai_api_key}"
            
            payload = {
                "model": self.ai_model,
                "messages": [
                    {"role": "system", "content": "당신은 업로드된 여러 문서를 종합 분석하여 답변하는 전문 AI 어시스턴트입니다. 답변은 워드 문서처럼 깔끔하게 구조화하여 작성하세요. HTML 태그는 절대 사용하지 말고, 제목【 】, 번호 매기기, 불릿 포인트(-)를 사용하여 가독성 높게 작성하세요. 각 섹션 사이에는 빈 줄을 넣어 읽기 쉽게 만드세요. 반드시 한글로만 답변하세요."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 3000
            }
            
            # UTF-8로 명시적으로 인코딩
            json_data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
            
            response = requests.post(
                self.ai_api_url,
                headers=headers,
                data=json_data,
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
        # 1. 관련 문서 검색 (여러 문서에서 충분히 검색)
        search_results = self.search_documents(question, k=10)
        
        if not search_results:
            return {
                "answer": "죄송하지만, 업로드된 문서가 없거나 질문과 관련된 내용을 찾을 수 없습니다.\n\n관리자 모드에서 관련 문서를 업로드해주세요.",
                "sources": []
            }
        
        # 2. 출처별로 그룹화하여 컨텍스트 생성
        sources_dict = {}
        for result in search_results:
            source = result["source"]
            if source not in sources_dict:
                sources_dict[source] = []
            sources_dict[source].append(result["content"])
        
        # 문서별로 구분된 컨텍스트 생성
        context_parts = []
        for source, contents in sources_dict.items():
            context_parts.append(f"[{source}]\n" + "\n".join(contents))
        
        context = "\n\n---\n\n".join(context_parts)
        
        # 3. 출처 정보
        sources = list(sources_dict.keys())
        
        # 4. AI 답변 생성
        answer = self.generate_answer(question, context, sources)
        
        return {
            "answer": answer,
            "sources": sources
        }

