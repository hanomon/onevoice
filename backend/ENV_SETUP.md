# 환경 변수 설정 가이드

## backend/.env 파일 생성

1. `backend/.env.example` 파일을 복사하여 `backend/.env` 파일을 생성합니다.

```bash
cd backend
copy .env.example .env  # Windows
# 또는
cp .env.example .env    # Mac/Linux
```

2. `.env` 파일을 텍스트 에디터로 열어 다음 값을 설정합니다:

## 필수 환경 변수

### AI_API_URL
```env
AI_API_URL=https://hackerthon-gpt120.platform.haiqv.ai/v1/chat/completions
```
- AI API 엔드포인트 URL
- 기본값 그대로 사용

### AI_MODEL
```env
AI_MODEL=GPT-OSS-120B
```
- 사용할 AI 모델 이름
- 기본값 그대로 사용

### AI_API_KEY ⚠️ **중요!**
```env
AI_API_KEY=your_actual_api_key_here
```
- AI API 인증 키
- **반드시 실제 API 키로 변경해야 합니다!**
- API 키가 없으면 담당자에게 문의하세요

### DATABASE_URL
```env
DATABASE_URL=sqlite:///./app.db
```
- 데이터베이스 연결 URL
- SQLite 사용 (기본값 그대로 사용)

### CHROMA_PERSIST_DIR
```env
CHROMA_PERSIST_DIR=./chroma_db
```
- 벡터 DB 저장 디렉토리
- 기본값 그대로 사용

### UPLOAD_DIR
```env
UPLOAD_DIR=./uploads
```
- 업로드된 파일 저장 디렉토리
- 기본값 그대로 사용

## 완성된 .env 파일 예시

```env
AI_API_URL=https://hackerthon-gpt120.platform.haiqv.ai/v1/chat/completions
AI_MODEL=GPT-OSS-120B
AI_API_KEY=sk-1234567890abcdefghijklmnopqrstuvwxyz
DATABASE_URL=sqlite:///./app.db
CHROMA_PERSIST_DIR=./chroma_db
UPLOAD_DIR=./uploads
```

## 주의사항

1. **절대로 .env 파일을 Git에 커밋하지 마세요!**
   - `.gitignore`에 이미 추가되어 있습니다.

2. **AI_API_KEY는 비밀로 유지하세요!**
   - 다른 사람과 공유하지 마세요.

3. **프로덕션 환경에서는 더 강력한 보안 설정을 사용하세요.**
   - 환경 변수를 OS 레벨에서 설정
   - 시크릿 관리 서비스 사용 (AWS Secrets Manager, Azure Key Vault 등)

## API 키 발급 방법

API 키가 없는 경우:

1. AI API 제공자 웹사이트 방문
2. 계정 생성 또는 로그인
3. API 키 발급 메뉴에서 새 키 생성
4. 생성된 키를 .env 파일에 복사

담당자 문의: [담당자 연락처]

## 문제 해결

### 환경 변수가 로드되지 않는 경우

1. `.env` 파일이 `backend/` 디렉토리에 있는지 확인
2. 파일 이름이 정확히 `.env`인지 확인 (`.env.txt` 아님!)
3. 환경 변수에 공백이나 따옴표가 잘못 들어가지 않았는지 확인
4. 서버를 재시작

### Windows에서 .env 파일 생성하기

Windows 탐색기에서는 `.env` 파일을 직접 만들 수 없습니다.

**방법 1: 명령 프롬프트 사용**
```cmd
cd backend
copy .env.example .env
notepad .env
```

**방법 2: VS Code 등 에디터 사용**
- 에디터에서 새 파일 생성
- `.env`로 저장
- 내용 입력

