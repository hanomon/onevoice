# 🚀 문서박사 빠른 시작 가이드

## 1️⃣ 백엔드 실행

### Windows 사용자
```cmd
cd backend
run.bat
```

### Mac/Linux 사용자
```bash
cd backend
chmod +x run.sh
./run.sh
```

### 수동 실행
```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt

# .env 파일 생성 (중요!)
cp .env.example .env
# .env 파일을 열어서 AI_API_KEY 등 필수 값을 설정하세요

# 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

백엔드가 실행되면: http://localhost:8000

---

## 2️⃣ 프론트엔드 실행

**새 터미널/명령 프롬프트를 열고:**

```bash
cd frontend

# 의존성 설치 (최초 1회만)
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드가 실행되면: http://localhost:3000

---

## 3️⃣ 접속하기

브라우저에서 http://localhost:3000 을 열면 됩니다!

### 화면 구성
- **메인 화면**: 사용자/관리자 모드 선택
- **사용자 모드**: 질문하기 / 건의하기
- **관리자 모드**: 파일 업로드 / VOC 현황

---

## ⚠️ 중요! 환경 변수 설정

### 백엔드 환경 변수 (backend/.env)

**반드시 설정해야 하는 항목:**

```env
AI_API_URL=https://hackerthon-gpt120.platform.haiqv.ai/v1/chat/completions
AI_MODEL=GPT-OSS-120B
AI_API_KEY=여기에_실제_API_키_입력
DATABASE_URL=sqlite:///./app.db
CHROMA_PERSIST_DIR=./chroma_db
UPLOAD_DIR=./uploads
```

**AI_API_KEY를 설정하지 않으면 챗봇이 작동하지 않습니다!**

---

## 🎯 사용 방법

### 관리자 모드에서 먼저 시작!

1. **관리자 모드** 클릭
2. **자료 업로드** 탭에서 문서 업로드 (TXT, PDF, PPTX, XLSX, DOCX 등)
3. 파일이 처리될 때까지 대기 (상태: ✓ 완료)

### 사용자 모드에서 질문하기

1. **사용자 모드** 클릭
2. **무엇이든 질문하세요** 탭에서 질문 입력
3. AI가 업로드된 문서를 기반으로 답변!

### 건의사항 남기기

1. **사용자 모드** → **무엇이든 건의하세요** 탭
2. 이름, 카테고리, 내용 입력 후 제출
3. 관리자가 **VOC 현황**에서 확인 가능

---

## 🐛 문제 해결

### 백엔드가 실행되지 않는 경우

```bash
# Python 버전 확인 (3.11 이상 필요)
python --version

# pip 업그레이드
pip install --upgrade pip

# 의존성 재설치
pip install -r requirements.txt --force-reinstall
```

### 프론트엔드가 실행되지 않는 경우

```bash
# Node.js 버전 확인 (18 이상 권장)
node --version

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json  # Windows: rmdir /s node_modules, del package-lock.json
npm install
```

### 챗봇이 응답하지 않는 경우

1. backend/.env 파일에 AI_API_KEY가 설정되어 있는지 확인
2. 관리자 모드에서 문서를 업로드했는지 확인
3. 업로드한 문서가 "✓ 완료" 상태인지 확인
4. 백엔드 콘솔에서 에러 메시지 확인

### CORS 오류가 발생하는 경우

- 백엔드가 8000 포트에서 실행 중인지 확인
- 프론트엔드가 3000 포트에서 실행 중인지 확인
- 브라우저 캐시 삭제 후 재시도

---

## 📚 추가 정보

더 자세한 내용은 `README.md` 파일을 참조하세요.

**API 문서**: http://localhost:8000/docs (백엔드 실행 후)

---

**문제가 계속되면 이슈를 등록하거나 담당자에게 문의하세요!** 🙋

