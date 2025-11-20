# 문서박사 (DocsAgent)

AI 기반 문서 검색 및 VOC 관리 시스템

## 📋 프로젝트 개요

문서박사는 RAG(Retrieval Augmented Generation) 기술을 활용하여 업로드된 문서를 기반으로 사용자 질문에 답변하고, VOC(Voice of Customer)를 관리하는 통합 웹 시스템입니다.

### 주요 기능

**사용자 모드:**
- 🤖 **무엇이든 질문하세요**: 업로드된 문서를 기반으로 한 AI 챗봇 질의응답
- 💬 **무엇이든 건의하세요**: 카테고리별 건의사항 제출

**관리자 모드:**
- 📁 **자료 업로드**: 다양한 형식의 문서 업로드 및 AI 학습
- 📊 **VOC 현황**: 사용자 건의사항 조회 및 관리

## 🛠️ 기술 스택

### Backend
- **Python 3.11+**
- **FastAPI**: 웹 프레임워크
- **LangChain**: RAG 파이프라인 구축
- **ChromaDB**: 벡터 데이터베이스 (SimpleEmbeddings 사용)
- **GPT-OSS-120B**: vLLM 기반 AI 모델 (120억 파라미터)
- **SQLAlchemy**: ORM
- **SQLite**: 메타데이터 저장

### Frontend
- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안정성
- **Vite**: 빌드 도구
- **TailwindCSS**: 스타일링
- **React Query**: 서버 상태 관리
- **React Router**: 라우팅

### AI & Embedding
- **GPT-OSS-120B API**: 오픈소스 120B 모델 (공개 API, 인증 불필요)
- **SimpleEmbeddings**: 외부 모델 다운로드 없이 작동하는 경량 임베딩

## 📁 프로젝트 구조

```
C:\AI chat\
├── backend/                 # 백엔드 애플리케이션
│   ├── app/
│   │   ├── main.py         # FastAPI 앱 엔트리포인트
│   │   ├── database.py     # 데이터베이스 설정
│   │   ├── models.py       # SQLAlchemy 모델
│   │   ├── schemas.py      # Pydantic 스키마
│   │   ├── routers/        # API 라우터
│   │   │   ├── chat.py     # 챗봇 API
│   │   │   ├── voc.py      # VOC API
│   │   │   └── upload.py   # 파일 업로드 API
│   │   └── services/       # 비즈니스 로직
│   │       ├── rag_service.py      # RAG 파이프라인
│   │       └── file_processor.py   # 파일 처리
│   ├── requirements.txt    # Python 의존성
│   └── .env.example        # 환경 변수 예시
│
├── frontend/               # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── main.tsx       # React 엔트리포인트
│   │   ├── App.tsx        # 앱 루트 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   │   ├── HomePage.tsx
│   │   │   ├── UserModePage.tsx
│   │   │   └── AdminModePage.tsx
│   │   ├── components/    # 재사용 컴포넌트
│   │   │   ├── ChatTab.tsx
│   │   │   ├── SuggestionTab.tsx
│   │   │   ├── UploadTab.tsx
│   │   │   └── VOCTab.tsx
│   │   └── api/          # API 클라이언트
│   │       └── client.ts
│   ├── package.json      # npm 의존성
│   ├── tsconfig.json     # TypeScript 설정
│   ├── vite.config.ts    # Vite 설정
│   └── tailwind.config.js # TailwindCSS 설정
│
└── README.md             # 프로젝트 문서
```

## 🚀 시작하기

### 사전 요구사항

- Python 3.11 이상
- Node.js 18 이상
- npm 또는 yarn

### ⚡ 빠른 시작 (Windows)

프로젝트 루트에서 배치 파일 실행:

```bash
# 백엔드 + 프론트엔드 동시 실행
START_ALL.bat

# 또는 개별 실행
START_BACKEND.bat   # 백엔드만
START_FRONTEND.bat  # 프론트엔드만
```

### 📦 수동 설정

#### 1. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# 가상환경 생성
python -m venv venv

# 가상환경 활성화
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (중요!)
# backend/.env 파일을 생성하고 아래 내용 입력:
# AI_API_URL=https://hackerthon-gpt120.platform.haiqv.ai/v1/chat/completions
# AI_MODEL=GPT-OSS-120B
# AI_API_KEY=  (비워두셔도 됩니다 - 공개 API)
# DATABASE_URL=sqlite:///./app.db
# CHROMA_PERSIST_DIR=./chroma_db
# UPLOAD_DIR=./uploads

# 서버 실행
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. 프론트엔드 설정

```bash
# 새 터미널에서 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

#### 3. 접속

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

✅ **서버가 정상 실행되면 브라우저에서 http://localhost:3000 을 여세요!**

## ⚙️ 환경 변수 설정

`backend/.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
# AI API 설정 (GPT-OSS-120B - 공개 API)
AI_API_URL=https://hackerthon-gpt120.platform.haiqv.ai/v1/chat/completions
AI_MODEL=GPT-OSS-120B
AI_API_KEY=  
# 👆 API_KEY는 비워두셔도 됩니다! (공개 API이므로 인증 불필요)

# 데이터베이스 설정
DATABASE_URL=sqlite:///./app.db

# ChromaDB 벡터 저장소
CHROMA_PERSIST_DIR=./chroma_db

# 파일 업로드 디렉토리
UPLOAD_DIR=./uploads
```

### 💡 중요 설정 정보

- **AI_API_KEY**: GPT-OSS-120B는 공개 API이므로 **인증 키가 필요 없습니다**. 비워두거나 삭제해도 됩니다.
- **AI_MODEL**: 반드시 `GPT-OSS-120B`로 설정해야 합니다 (대소문자 구분).
- **max_tokens**: 코드에서 2000으로 설정됨 (추론 과정 + 답변 생성에 충분한 토큰).

## 📚 지원 파일 형식

- **텍스트**: .txt
- **PDF**: .pdf
- **프레젠테이션**: .pptx, .ppt
- **스프레드시트**: .xlsx, .xls
- **문서**: .docx, .doc

## 🎨 디자인 특징

- **무채색 기반**: 그레이 스케일을 활용한 깔끔한 디자인
- **Google 검색 스타일**: 직관적이고 친숙한 UI
- **반응형 디자인**: 다양한 화면 크기 지원
- **부드러운 애니메이션**: 사용자 경험 향상

## 📝 API 엔드포인트

### 채팅
- `POST /api/chat/`: 사용자 질문에 대한 AI 답변 생성

### VOC
- `POST /api/voc/`: VOC 생성
- `GET /api/voc/`: 모든 VOC 조회
- `GET /api/voc/{id}`: 특정 VOC 조회

### 파일 업로드
- `POST /api/upload/`: 파일 업로드 및 처리
- `GET /api/upload/files`: 업로드된 파일 목록 조회
- `DELETE /api/upload/{id}`: 파일 삭제

## 🔧 개발 가이드

### 백엔드 개발

```bash
# 새 라우터 추가
# backend/app/routers/ 디렉토리에 파일 생성
# backend/app/main.py에 라우터 등록

# 데이터베이스 모델 수정 후
# 자동으로 테이블이 생성됩니다 (SQLite)
```

### 프론트엔드 개발

```bash
# 새 컴포넌트 추가
# frontend/src/components/ 디렉토리에 파일 생성

# 새 페이지 추가
# frontend/src/pages/ 디렉토리에 파일 생성
# frontend/src/App.tsx에 라우트 추가
```

## 🏗️ 아키텍처 및 주요 구현

### RAG 파이프라인

**문서 처리 흐름**:
1. 파일 업로드 → `FileProcessor`로 텍스트 추출
2. 텍스트 청크 분할 (1000자, 200자 오버랩)
3. `SimpleEmbeddings`로 벡터 임베딩 생성
4. ChromaDB에 저장 (persist)

**질문 처리 흐름**:
1. 사용자 질문 → ChromaDB에서 유사 문서 검색 (Top 3)
2. 검색된 문서를 컨텍스트로 결합
3. GPT-OSS-120B API에 프롬프트 전송
4. AI 답변 생성 (추론 + 답변)
5. 프론트엔드에 응답 반환

### SimpleEmbeddings 클래스

**특징**:
- ✅ 외부 모델 다운로드 불필요 (SSL 오류 방지)
- ✅ LangChain `Chroma` vectorstore 완벽 호환
- ✅ 해시 기반 384차원 벡터 생성
- ✅ 가볍고 빠른 임베딩

**구현** (`backend/app/services/rag_service.py`):
```python
class SimpleEmbeddings:
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        # SHA-384 해시 기반 임베딩
        
    def embed_query(self, text: str) -> List[float]:
        # 쿼리 임베딩 (동일한 방식)
```

### GPT-OSS-120B API 통합

**API 설정**:
- **엔드포인트**: `https://hackerthon-gpt120.platform.haiqv.ai/v1/chat/completions`
- **모델**: `GPT-OSS-120B` (120억 파라미터)
- **인증**: 불필요 (공개 API)
- **Temperature**: 0.7 (창의성과 일관성 균형)
- **Max Tokens**: 2000 (추론 + 답변)

**응답 구조**:
```json
{
  "choices": [{
    "message": {
      "content": "실제 답변",
      "reasoning_content": "추론 과정 (이 모델의 특징)"
    }
  }]
}
```

### SSL 우회 설정

개발 환경에서 SSL 인증 오류 방지:
```python
# backend/app/services/rag_service.py
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
os.environ['CURL_CA_BUNDLE'] = ''
os.environ['REQUESTS_CA_BUNDLE'] = ''
ssl._create_default_https_context = ssl._create_unverified_context
```

⚠️ **주의**: 프로덕션 환경에서는 적절한 SSL 인증서 사용 권장

## 🐛 트러블슈팅

### 백엔드 문제

#### ❌ 문제: SSL 인증 오류 (파일 업로드 시)
```
[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed
```

**원인**: ChromaDB가 외부 임베딩 모델을 다운로드하려고 시도  
**해결**: ✅ 이미 `SimpleEmbeddings` 클래스로 해결됨! 외부 모델 다운로드 없이 작동합니다.

만약 오류가 계속된다면:
```python
# backend/app/services/rag_service.py 확인
# SimpleEmbeddings 클래스가 있는지 확인
# embedding_function = SimpleEmbeddings() 사용 확인
```

#### ❌ 문제: 'embed_documents' 메서드 없음
```
'DefaultEmbeddingFunction' object has no attribute 'embed_documents'
```

**원인**: ChromaDB의 기본 임베딩이 LangChain과 호환되지 않음  
**해결**: ✅ `SimpleEmbeddings` 클래스 사용으로 해결됨!

#### ❌ 문제: AI 응답이 비어있음 (content: null)
```json
{"content": null, "reasoning_content": "..."}
```

**원인**: `max_tokens`가 부족하여 추론 과정만 생성됨  
**해결**: ✅ `max_tokens=2000`으로 설정하여 해결됨!

GPT-OSS-120B는 **추론 과정(reasoning_content)**과 **답변(content)**을 모두 생성하므로 충분한 토큰이 필요합니다.

#### ❌ 문제: 패키지 설치 오류
```bash
# pip 업그레이드
pip install --upgrade pip

# Python 버전 확인 (3.11+ 권장, 3.13은 일부 패키지 호환 문제 가능)
python --version

# 특정 패키지만 재설치
pip install --force-reinstall <package-name>
```

#### ❌ 문제: ChromaDB 데이터 초기화 필요
```bash
# ChromaDB 디렉토리 삭제 후 재시작
rm -rf chroma_db  # Windows: rmdir /s /q chroma_db
```

#### ❌ 문제: uvicorn을 찾을 수 없음
```
'uvicorn' 용어가 cmdlet으로 인식되지 않습니다
```

**해결**:
```bash
# 가상환경이 활성화되었는지 확인
.\venv\Scripts\Activate.ps1

# 또는 전체 경로로 실행
python -m uvicorn app.main:app --reload
```

### 프론트엔드 문제

#### ❌ 문제: 모듈을 찾을 수 없음
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json  # Windows: rmdir /s /q node_modules
npm install
```

#### ❌ 문제: 프록시 오류 (백엔드 연결 실패)
- `vite.config.ts`에서 프록시 설정 확인
- 백엔드 서버가 `http://localhost:8000`에서 실행 중인지 확인
- 방화벽 또는 보안 프로그램 확인

#### ❌ 문제: npm run dev 실패
```bash
# Node.js 버전 확인 (18 이상 권장)
node --version

# 캐시 삭제 후 재설치
npm cache clean --force
npm install
```

### 일반 문제

#### 💾 프로젝트 용량이 너무 큼 (1.2GB+)

**원인**: `backend/venv`가 1.2GB 차지 (torch, transformers 등 대용량 패키지)

**해결** (선택사항):
```bash
# .gitignore에 추가되어 있는지 확인
# 다음 디렉토리는 Git에 포함되지 않아야 함:
# - backend/venv/
# - frontend/node_modules/
# - backend/chroma_db/
# - backend/uploads/
# - backend/__pycache__/
```

필요시 경량화:
- `torch`는 CPU 버전만 설치
- 사용하지 않는 패키지 제거

#### 🔄 서버 재시작 필요
코드 변경 후에도 적용되지 않는 경우:
```bash
# 백엔드: Ctrl+C로 종료 후 재실행
# 프론트엔드: 자동 리로드 (--reload 옵션)

# Windows에서 프로세스 강제 종료
Get-Process python,node | Stop-Process -Force
```

## 📋 최근 업데이트 및 수정 이력

### ✅ 해결된 주요 이슈

**v1.1.0 (2024-11-20)**

1. **ChromaDB SSL 인증 오류 해결** ✅
   - 문제: 파일 업로드 시 `[SSL: CERTIFICATE_VERIFY_FAILED]` 오류
   - 해결: `SimpleEmbeddings` 클래스 구현 (외부 모델 다운로드 불필요)

2. **LangChain 호환성 문제 해결** ✅
   - 문제: `'DefaultEmbeddingFunction' object has no attribute 'embed_documents'`
   - 해결: LangChain 인터페이스 호환 임베딩 함수 구현

3. **GPT-OSS-120B API 통합 완료** ✅
   - vLLM 기반 120B 모델 통합
   - API 키 불필요 (공개 API)
   - max_tokens 최적화 (2000)

4. **AI 응답 파싱 개선** ✅
   - `content` 및 `reasoning_content` 지원
   - 추론 과정과 답변 모두 활용

5. **의존성 버전 호환성 개선** ✅
   - Python 3.13 호환성 문제 해결
   - pydantic-core 빌드 오류 수정

### 🎯 성능 최적화

- **파일 업로드**: SSL 우회로 안정성 향상
- **임베딩 생성**: 외부 모델 다운로드 제거로 속도 개선
- **AI 응답**: 토큰 최적화로 완전한 답변 생성

### 📊 프로젝트 통계

- **백엔드 패키지**: ~20개 (핵심 의존성)
- **프론트엔드 패키지**: ~30개
- **지원 파일 형식**: 5가지 (txt, pdf, docx, pptx, xlsx)
- **AI 모델**: GPT-OSS-120B (120B 파라미터)

## ⚠️ 알려진 제한사항

1. **프로젝트 용량**: backend/venv가 약 1.2GB (torch, transformers 등 포함)
   - 정상적인 크기입니다 (.gitignore에 포함되어 Git에는 업로드 안 됨)

2. **임베딩 품질**: SimpleEmbeddings는 해시 기반이므로 의미적 유사도가 완벽하지 않음
   - 실제 운영 환경에서는 HuggingFace Sentence-Transformers 권장

3. **SSL 인증**: 개발 환경에서 SSL 검증 우회 중
   - 프로덕션 환경에서는 적절한 인증서 사용 필요

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👥 기여

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다!

## 📞 지원

문제가 발생하면 이슈를 등록하거나 담당자에게 문의하세요.

---

**문서박사 (DocsAgent)** - AI와 함께하는 스마트한 문서 관리 🚀

*Powered by GPT-OSS-120B (vLLM), LangChain, ChromaDB*

