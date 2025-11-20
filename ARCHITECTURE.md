# 문서박사 시스템 아키텍처

## 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────┐
│                         사용자 브라우저                          │
│                    http://localhost:3000                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      프론트엔드 (React)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  HomePage → UserModePage / AdminModePage             │  │
│  │  - ChatTab (질문)                                     │  │
│  │  - SuggestionTab (건의)                               │  │
│  │  - UploadTab (업로드)                                 │  │
│  │  - VOCTab (VOC 현황)                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│           React Router | React Query | Axios               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API 요청
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     백엔드 (FastAPI)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/chat/    - 챗봇 질의응답                         │  │
│  │  /api/voc/     - VOC 생성 및 조회                      │  │
│  │  /api/upload/  - 파일 업로드 및 관리                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────┐  ┌───────────────────────────────┐  │
│  │  RAG Service     │  │  File Processor               │  │
│  │  - 문서 검색     │  │  - PDF, DOCX, PPTX, XLSX 처리 │  │
│  │  - AI 답변 생성  │  │  - 텍스트 추출                 │  │
│  └────────┬─────────┘  └───────────────────────────────┘  │
└───────────┼────────────────────────────────────────────────┘
            │
            ├─────────────┬─────────────────┬────────────────┐
            │             │                 │                │
┌───────────▼──┐  ┌──────▼────────┐  ┌─────▼─────┐  ┌──────▼──────┐
│  ChromaDB    │  │  SQLite DB    │  │  Uploads  │  │  AI API     │
│  (벡터 DB)   │  │  (VOC, Files) │  │  (파일)   │  │  (GPT-120B) │
└──────────────┘  └───────────────┘  └───────────┘  └─────────────┘
```

## 컴포넌트 설명

### 1. 프론트엔드 (React + TypeScript)

**기술 스택:**
- React 18: UI 라이브러리
- TypeScript: 타입 안정성
- Vite: 빌드 도구 (빠른 개발 서버)
- TailwindCSS: 유틸리티 기반 CSS 프레임워크
- React Router: 클라이언트 사이드 라우팅
- React Query: 서버 상태 관리 및 캐싱
- Axios: HTTP 클라이언트

**주요 페이지:**
- `HomePage`: 사용자/관리자 모드 선택
- `UserModePage`: 질문 및 건의 기능
- `AdminModePage`: 파일 업로드 및 VOC 관리

### 2. 백엔드 (FastAPI + Python)

**기술 스택:**
- FastAPI: 고성능 웹 프레임워크
- Pydantic: 데이터 검증 및 스키마
- SQLAlchemy: ORM
- Python-dotenv: 환경 변수 관리

**API 엔드포인트:**

#### Chat API (`/api/chat/`)
- `POST /`: 사용자 질문에 대한 AI 답변 생성

#### VOC API (`/api/voc/`)
- `POST /`: VOC 생성
- `GET /`: 모든 VOC 조회
- `GET /{id}`: 특정 VOC 조회

#### Upload API (`/api/upload/`)
- `POST /`: 파일 업로드 및 처리
- `GET /files`: 업로드된 파일 목록
- `DELETE /{id}`: 파일 삭제

### 3. RAG 시스템 (LangChain + ChromaDB)

**데이터 흐름:**

```
파일 업로드
    ↓
텍스트 추출 (FileProcessor)
    ↓
텍스트 청크 분할 (RecursiveCharacterTextSplitter)
    ↓
임베딩 생성 (HuggingFace Embeddings)
    ↓
벡터 DB 저장 (ChromaDB)
```

**질의 응답 흐름:**

```
사용자 질문
    ↓
질문 임베딩 생성
    ↓
유사 문서 검색 (ChromaDB)
    ↓
컨텍스트 생성 (상위 3개 문서)
    ↓
AI API 호출 (GPT-OSS-120B)
    ↓
답변 반환 (출처 포함)
```

### 4. 데이터베이스

**SQLite (app.db):**
- `voc`: VOC 테이블 (id, user_name, category, content, created_at)
- `uploaded_files`: 업로드 파일 테이블 (id, filename, file_path, file_type, upload_date, processed)

**ChromaDB (벡터 DB):**
- 문서 임베딩 저장
- 유사도 검색

### 5. 파일 처리

**지원 형식:**
- TXT: 기본 텍스트
- PDF: PyPDF2
- PPTX: python-pptx
- XLSX: openpyxl
- DOCX: python-docx

**처리 과정:**
1. 파일 업로드 → 로컬 저장
2. 확장자별 파서 실행
3. 텍스트 추출
4. 청크 분할 (1000자, 200자 오버랩)
5. 임베딩 생성 및 저장
6. DB 상태 업데이트 (완료/실패)

## 보안 고려사항

1. **CORS 설정**: 프로덕션에서는 특정 도메인만 허용
2. **API 키 관리**: 환경 변수로 관리, Git에 커밋 금지
3. **파일 업로드 제한**: 파일 크기, 형식 검증 필요
4. **인증/인가**: 현재 미구현, 프로덕션에서는 필수
5. **SQL 인젝션 방지**: SQLAlchemy ORM 사용
6. **XSS 방지**: React의 기본 이스케이핑 활용

## 성능 최적화

1. **프론트엔드**:
   - React Query로 캐싱 및 재요청 최소화
   - 코드 스플리팅 (Vite 자동 처리)
   - 이미지 최적화

2. **백엔드**:
   - 비동기 처리 (FastAPI async)
   - 벡터 검색 최적화 (ChromaDB 인덱싱)
   - 파일 처리 백그라운드 작업 (실제로는 Celery 권장)

3. **데이터베이스**:
   - 인덱스 설정 (id, created_at)
   - 쿼리 최적화

## 확장 가능성

### 수평 확장
- 백엔드: 로드 밸런서 + 여러 FastAPI 인스턴스
- ChromaDB: 분산 벡터 DB로 전환 (Milvus, Pinecone)
- SQLite → PostgreSQL/MySQL

### 기능 확장
- 사용자 인증 시스템
- 실시간 알림 (WebSocket)
- 파일 버전 관리
- 대화 히스토리 저장
- 관리자 대시보드 (통계, 분석)
- 다국어 지원

### 배포 옵션
- Docker 컨테이너화
- Kubernetes 오케스트레이션
- CI/CD 파이프라인 (GitHub Actions)
- 클라우드 배포 (AWS, Azure, GCP)

## 모니터링 & 로깅

**구현 예정:**
- 로그 수집: Loguru, Python logging
- 모니터링: Prometheus + Grafana
- 에러 추적: Sentry
- APM: New Relic, DataDog

## 개발 워크플로우

```
개발 → 로컬 테스트 → Git Push → CI/CD → 스테이징 → 프로덕션
```

**브랜치 전략:**
- `main`: 프로덕션
- `develop`: 개발
- `feature/*`: 기능 개발
- `hotfix/*`: 긴급 수정

## 문서 및 API

- **API 문서**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc
- **소스 코드 문서**: 각 모듈의 docstring 참조

---

**작성일**: 2025-11-20  
**버전**: 1.0.0

