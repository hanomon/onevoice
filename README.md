# 문서박사 (DocsAgent) v2.0

**기업형 AI 문서 검색 및 VOC 관리 시스템**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/hanomon/onevoice)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 프로젝트 개요

문서박사는 RAG(Retrieval Augmented Generation) 기술을 활용하여 업로드된 문서를 기반으로 사용자 질문에 답변하고, VOC(Voice of Customer)를 관리하는 기업형 통합 웹 시스템입니다.

**Hanwha HPLM 시스템과 통합되어 실무에 최적화된 UI/UX를 제공합니다.**

## ✨ v2.0 주요 업데이트

### 🎨 UI/UX 전면 개편
- **기업형 대시보드**: Shadcn/UI + Flowbite 스타일 적용
- **HPLM 시스템 통합**: 실제 업무 환경과 동일한 초기 화면
- **플로팅 챗봇 위젯**: 우측 하단 최소화 가능한 챗봇 (480x700px)
- **탭 상태 유지**: AI 질문하기 ↔ 건의하기 탭 전환 시 내용 보존

### 🤖 AI 기능 고도화
- **다중 문서 비교/분석**: 여러 문서를 동시에 비교하여 답변
- **키워드 기반 정확도 향상**: 핵심 키워드 추출 및 관련 문서 검색
- **워드 문서 스타일 답변**: HTML 태그 제거, 구조화된 가독성 높은 답변
- **한글 전용 답변**: 모든 AI 응답을 한글로만 제공
- **VOC 자동 분석**: AI가 업로드된 문서 기반으로 해결책 제시

### 📊 관리 기능 강화
- **통계 대시보드**: 총 문서 수, 처리 완료율, VOC 접수 현황
- **VOC 카테고리 필터**: 전체/프로세스 문의/시스템 문의/기타 분류
- **실시간 분석 팝업**: VOC별 AI 기반 해결책 및 참조 문서 제공

## 🎯 주요 기능

### 🏢 HPLM 시스템 초기 화면
- 실제 업무 환경과 동일한 대시보드
- 개발자금 현황, 공지사항, 결재현황, 나의과제 위젯
- 우측 하단 플로팅 **문서박사 챗봇** 버튼

### 💬 챗봇 위젯 (사용자 모드)
**AI 질문하기 탭:**
- 🔍 업로드된 문서 기반 질의응답
- 📚 여러 문서 동시 비교/분석
- 📄 참조 문서 출처 표시
- 📝 워드 문서 스타일의 깔끔한 답변

**건의하기 탭:**
- 💡 카테고리별 건의사항 제출 (프로세스/시스템/기타)
- ✍️ 이름, 카테고리, 내용 입력
- ✅ 제출 완료 알림

### ⚙️ 관리자 모드
**문서 업로드:**
- 📤 드래그 앤 드롭 업로드
- 📋 업로드 파일 목록 관리
- 🔄 처리 상태 실시간 표시 (완료/처리중/실패)
- 🗑️ 파일 삭제 기능

**VOC 현황:**
- 📊 카테고리별 통계 (전체/프로세스/시스템/기타)
- 🔍 카테고리 필터링
- 🤖 **AI 분석 기능**: VOC별 해결책 자동 생성
- 📄 참조 문서 자동 매칭

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
- **TailwindCSS**: 스타일링 프레임워크
- **Shadcn/UI + Flowbite**: 기업형 UI 컴포넌트
- **lucide-react**: 아이콘 라이브러리
- **clsx + tailwind-merge**: 동적 스타일링
- **React Query**: 서버 상태 관리
- **React Router**: 라우팅

### AI & Embedding
- **GPT-OSS-120B API**: 오픈소스 120B 모델 (공개 API, 인증 불필요)
- **SimpleEmbeddings**: 외부 모델 다운로드 없이 작동하는 경량 임베딩
- **Temperature 0.3**: 정확도 중심 답변 생성
- **Max Tokens 3000**: 다중 문서 비교 분석 지원

## 📁 프로젝트 구조

```
onevoice/
├── backend/                          # 백엔드 애플리케이션
│   ├── app/
│   │   ├── main.py                  # FastAPI 앱 엔트리포인트
│   │   ├── database.py              # 데이터베이스 설정
│   │   ├── models.py                # SQLAlchemy 모델
│   │   ├── schemas.py               # Pydantic 스키마
│   │   ├── routers/                 # API 라우터
│   │   │   ├── chat.py              # 챗봇 API
│   │   │   ├── voc.py               # VOC API
│   │   │   └── upload.py            # 파일 업로드 API
│   │   └── services/                # 비즈니스 로직
│   │       ├── rag_service.py       # RAG 파이프라인 (다중 문서 비교)
│   │       └── file_processor.py    # 파일 처리
│   ├── requirements.txt             # Python 의존성
│   ├── .env.example                 # 환경 변수 예시
│   ├── chroma_db/                   # 벡터 DB (gitignore)
│   └── uploads/                     # 업로드 파일 (gitignore)
│
├── frontend/                         # 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── main.tsx                 # React 엔트리포인트
│   │   ├── App.tsx                  # 앱 루트 컴포넌트
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   │   ├── InitialPage.tsx     # HPLM 초기 화면 (NEW)
│   │   │   ├── HomePage.tsx        # 문서박사 메인
│   │   │   ├── UserModePage.tsx    # 사용자 대시보드
│   │   │   └── AdminModePage.tsx   # 관리자 대시보드
│   │   ├── components/              # 재사용 컴포넌트
│   │   │   ├── ChatTab.tsx          # AI 질문하기 (포맷팅 개선)
│   │   │   ├── SuggestionTab.tsx    # 건의하기
│   │   │   ├── UploadTab.tsx        # 파일 업로드
│   │   │   ├── VOCTab.tsx           # VOC 현황 (필터 추가)
│   │   │   ├── ChatbotWidget.tsx    # 플로팅 챗봇 위젯 (NEW)
│   │   │   ├── VOCAnalysisModal.tsx # VOC 분석 팝업 (NEW)
│   │   │   ├── ui/                  # UI 컴포넌트 라이브러리 (NEW)
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── StatCard.tsx
│   │   │   └── layout/              # 레이아웃 컴포넌트 (NEW)
│   │   │       └── DashboardLayout.tsx
│   │   ├── lib/                     # 유틸리티 (NEW)
│   │   │   └── utils.ts             # clsx + tailwind-merge
│   │   └── api/                     # API 클라이언트
│   │       └── client.ts
│   ├── package.json                 # npm 의존성 (lucide-react 추가)
│   ├── tsconfig.json                # TypeScript 설정
│   ├── vite.config.ts               # Vite 설정
│   ├── tailwind.config.js           # TailwindCSS 설정 (기업형 테마)
│   └── index.css                    # 글로벌 스타일
│
├── .gitignore                        # Git 제외 파일
├── README.md                         # 프로젝트 문서
├── START_ALL.bat                     # 통합 실행 스크립트
├── START_BACKEND.bat                 # 백엔드 실행
└── START_FRONTEND.bat                # 프론트엔드 실행
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

### v2.0 기업형 디자인 시스템
- **Shadcn/UI + Flowbite 통합**: 전문적이고 세련된 컴포넌트
- **Primary Blue 테마**: 신뢰감을 주는 파란색 계열
- **카드 기반 레이아웃**: 정보 구조화 및 시각적 계층
- **플로팅 위젯**: 업무 방해 최소화 (최소화/최대화 가능)
- **워드 문서 스타일**: 가독성 높은 답변 포맷
  - 제목: 【 】로 강조
  - 번호 매기기: 1., 2., 3.
  - 불릿 포인트: - 활용
  - 섹션 간 빈 줄로 구분
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- **다크 모드 지원**: 시스템 테마 연동

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

### RAG 파이프라인 (v2.0 개선)

**문서 처리 흐름**:
1. 파일 업로드 → `FileProcessor`로 텍스트 추출
2. 텍스트 청크 분할 (1000자, 200자 오버랩)
3. `SimpleEmbeddings`로 벡터 임베딩 생성
4. ChromaDB에 저장 (파일명 메타데이터 포함)

**질문 처리 흐름 (다중 문서 비교)**:
1. 사용자 질문 → ChromaDB에서 유사 문서 검색 (Top 10, 증가됨)
2. **출처별 문서 그룹화**: 각 파일의 내용을 구분하여 컨텍스트 생성
   ```
   [파일A.docx]
   내용...
   
   [파일B.xlsx]
   내용...
   ```
3. 핵심 키워드 추출 및 프롬프트 생성
4. GPT-OSS-120B API에 전송 (Temperature 0.3, Max Tokens 3000)
5. AI 답변 생성 (비교 분석 형식)
6. **워드 문서 스타일 포맷팅** 적용
7. 프론트엔드에 응답 반환 (출처 문서 목록 포함)

### 다중 문서 비교 분석

**특징**:
- 여러 파일의 내용을 동시에 분석
- 각 문서별 특징 구분
- 공통점과 차이점 명확히 제시
- 출처 문서 자동 매칭

**예시 질문**:
```
"한화비전 과제관리 프로세스와 한화파워시스템 과제관리 프로세스를 비교해줘"
```

**AI 답변 형식**:
```
【한화비전 HPLM 과제관리 프로세스】

1. 주요 단계
   - 과제 등록
   - 승인 프로세스

【한화파워시스템 IDMS 과제관리 프로세스】

1. 주요 단계
   - 프로젝트 생성
   - 팀 구성

【공통점】
- 승인 단계 존재
- 문서화 필수

【차이점】
- 한화비전: HPLM 시스템 사용
- 한화파워시스템: IDMS 시스템 사용

【정리】
두 프로세스는 유사하나...
```

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

### GPT-OSS-120B API 통합 (v2.0 최적화)

**API 설정**:
- **엔드포인트**: `https://hackerthon-gpt120.platform.haiqv.ai/v1/chat/completions`
- **모델**: `GPT-OSS-120B` (120억 파라미터)
- **인증**: 불필요 (공개 API)
- **Temperature**: 0.3 → **정확도 중심** (v1.1: 0.7)
- **Max Tokens**: 3000 → **다중 문서 비교 지원** (v1.1: 2000)

**시스템 메시지 (v2.0)**:
```
여러 문서를 종합 분석하여 답변하는 전문 AI 어시스턴트
- 워드 문서처럼 깔끔하게 구조화
- HTML 태그 절대 사용 금지
- 제목【 】, 번호 매기기, 불릿 포인트(-) 사용
- 각 섹션 사이에 빈 줄 삽입
- 한글로만 답변
```

**프롬프트 강화**:
1. 핵심 키워드 파악
2. 여러 문서 종합 분석
3. 각 문서 내용 비교 및 차이점 설명
4. 문서별 구분하여 설명
5. 공통점과 차이점 명확히 비교
6. 관련 내용 없으면 명확히 안내

**응답 구조**:
```json
{
  "choices": [{
    "message": {
      "content": "실제 답변 (워드 문서 스타일)",
      "reasoning_content": "추론 과정"
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

## 📋 버전 히스토리

### 🎉 v2.0.0 (2024-11-20) - 기업형 대시보드 및 AI 고도화

#### 🎨 UI/UX 전면 개편
1. **Shadcn/UI + Flowbite 스타일 통합** ✅
   - 기업형 디자인 시스템 구축
   - Primary Blue 테마 적용
   - Card, Button, Badge, StatCard 컴포넌트 라이브러리

2. **HPLM 시스템 초기 화면 추가** ✅
   - 실제 업무 환경과 동일한 대시보드
   - 개발자금 현황, 공지사항, 결재현황, 나의과제 위젯
   - 우측 하단 플로팅 챗봇 버튼

3. **플로팅 챗봇 위젯 구현** ✅
   - 480x700px 크기의 독립 위젯
   - 최소화/최대화 기능
   - AI 질문하기 / 건의하기 탭 통합
   - 탭 전환 시 상태 유지 (CSS display 방식)

4. **UI 컴포넌트 라이브러리** ✅
   - lucide-react 아이콘 통합 (280+ 아이콘)
   - clsx + tailwind-merge 유틸리티
   - DashboardLayout 공통 레이아웃

#### 🤖 AI 기능 고도화
1. **다중 문서 비교/분석 기능** ✅
   - 여러 파일 동시 분석 (k=10)
   - 출처별 문서 그룹화
   - 각 문서 특징, 공통점, 차이점 명확히 제시

2. **키워드 기반 정확도 향상** ✅
   - 질문에서 핵심 키워드 추출
   - 관련 문서 정밀 검색
   - 내용 없으면 명확한 안내

3. **AI 답변 포맷팅 개선** ✅
   - HTML 태그 완전 제거
   - 워드 문서 스타일 적용
     - 제목: 【 】
     - 번호 매기기: 1., 2., 3.
     - 불릿: -
     - 섹션 간 빈 줄
   - 줄 간격 1.8 (가독성 향상)

4. **한글 인코딩 문제 해결** ✅
   - UTF-8 명시적 처리
   - json.dumps(ensure_ascii=False)
   - 한글 전용 답변 강제

5. **Temperature 최적화** ✅
   - 0.7 → 0.3 (정확도 중심)
   - Max Tokens: 2000 → 3000 (다중 문서 지원)

#### 📊 관리 기능 강화
1. **관리자 통계 대시보드** ✅
   - 총 문서 수, 처리 완료율, VOC 접수 현황
   - StatCard 컴포넌트로 시각화

2. **VOC 카테고리 필터링** ✅
   - 전체/프로세스 문의/시스템 문의/기타
   - 카테고리별 통계 (4개)
   - 실시간 필터링

3. **VOC AI 분석 기능** ✅
   - VOC별 "분석" 버튼
   - 팝업 모달로 해결책 제시
   - 업로드된 문서 기반 자동 분석
   - 참조 문서 자동 매칭
   - 재분석 기능

#### 🔧 기술 개선
- `lucide-react` 패키지 추가
- `clsx` + `tailwind-merge` 추가
- Tailwind 기업형 테마 설정
- 글로벌 CSS 개선

---

### ✅ v1.1.0 (2024-11-20) - 핵심 기능 안정화

1. **ChromaDB SSL 인증 오류 해결** ✅
   - SimpleEmbeddings 클래스 구현

2. **LangChain 호환성 문제 해결** ✅
   - LangChain 인터페이스 호환

3. **GPT-OSS-120B API 통합** ✅
   - vLLM 기반 120B 모델
   - max_tokens 최적화 (2000)

4. **AI 응답 파싱 개선** ✅
   - content + reasoning_content 지원

---

### 📊 프로젝트 통계 (v2.0)

- **총 파일 수**: 33개 (v1.1 대비 +11개)
- **코드 라인 수**: +2,042줄 추가
- **백엔드 패키지**: ~20개
- **프론트엔드 패키지**: ~35개 (+5개)
- **UI 컴포넌트**: 10개
- **지원 파일 형식**: 5가지
- **AI 모델**: GPT-OSS-120B (120B)

## ⚠️ 알려진 제한사항

1. **프로젝트 용량**: backend/venv가 약 1.2GB (torch, transformers 등 포함)
   - 정상적인 크기입니다 (.gitignore에 포함되어 Git에는 업로드 안 됨)

2. **임베딩 품질**: SimpleEmbeddings는 해시 기반이므로 의미적 유사도가 완벽하지 않음
   - 실제 운영 환경에서는 HuggingFace Sentence-Transformers 권장
   - 또는 OpenAI Embeddings API 사용

3. **SSL 인증**: 개발 환경에서 SSL 검증 우회 중
   - 프로덕션 환경에서는 적절한 인증서 사용 필요

4. **GPT-OSS-120B API**: 공개 API이므로 응답 속도가 느릴 수 있음
   - 프로덕션: OpenAI GPT-4 또는 자체 모델 서버 권장

5. **파일 크기 제한**: 현재 제한 없음 (추후 설정 권장)
   - 권장: 파일당 최대 50MB

## 🚀 향후 개발 계획

### v2.1 (계획)
- [ ] 문서 버전 관리
- [ ] 사용자 권한 관리 (RBAC)
- [ ] 검색 히스토리
- [ ] 즐겨찾기 기능
- [ ] 다국어 지원 (영어)

### v3.0 (장기)
- [ ] 음성 인식 질문
- [ ] 문서 자동 요약
- [ ] 실시간 협업 기능
- [ ] 모바일 앱
- [ ] 온프레미스 배포 지원

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👥 기여

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다!

## 📞 지원

문제가 발생하면 이슈를 등록하거나 담당자에게 문의하세요.

## 🎬 시작하기 (Quick Start)

### Windows에서 원클릭 실행
```batch
START_ALL.bat
```

### 브라우저 접속
- http://localhost:3000 (프론트엔드)
- http://localhost:8000/docs (API 문서)

### 사용 흐름
1. **HPLM 초기 화면** 접속
2. **우측 하단 챗봇 버튼** 클릭
3. **관리자 모드** 버튼 → 문서 업로드
4. **AI 질문하기** 탭 → 문서 기반 질문
5. **VOC 분석** → 건의사항 자동 해결책

---

## 🌟 주요 특징 요약

| 기능 | v1.0 | v2.0 |
|------|------|------|
| UI 스타일 | 기본 | Shadcn/UI + Flowbite |
| 초기 화면 | 단순 | HPLM 시스템 통합 |
| 챗봇 형태 | 전체 화면 | 플로팅 위젯 |
| 문서 비교 | 단일 | 다중 비교/분석 |
| 답변 형식 | 텍스트 | 워드 문서 스타일 |
| VOC 분석 | 수동 | AI 자동 분석 |
| 카테고리 필터 | 없음 | 4개 필터 |
| 통계 대시보드 | 없음 | 3개 통계 카드 |

---

**문서박사 (DocsAgent) v2.0** - 기업형 AI 문서 관리 시스템 🚀

*Powered by GPT-OSS-120B (vLLM), LangChain, ChromaDB, Shadcn/UI*

[![GitHub](https://img.shields.io/badge/GitHub-hanomon/onevoice-blue)](https://github.com/hanomon/onevoice)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

