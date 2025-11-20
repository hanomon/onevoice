@echo off
echo ========================================
echo   문서박사 백엔드 서버 시작
echo ========================================
echo.

cd backend

echo [1/3] 가상환경 활성화...
call venv\Scripts\activate.bat

echo.
echo [2/3] 환경 변수 확인...
if not exist .env (
    echo 오류: .env 파일이 없습니다!
    echo .env.example을 복사하여 .env 파일을 만들어주세요.
    pause
    exit /b 1
)

echo.
echo [3/3] 서버 시작 중...
echo.
echo 서버 URL: http://localhost:8000
echo API 문서: http://localhost:8000/docs
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요
echo ========================================
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause

