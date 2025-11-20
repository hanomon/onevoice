@echo off
echo ========================================
echo   문서박사 프론트엔드 서버 시작
echo ========================================
echo.

cd frontend

echo [1/2] 의존성 확인...
if not exist node_modules (
    echo node_modules가 없습니다. npm install 실행 중...
    npm install
)

echo.
echo [2/2] 개발 서버 시작 중...
echo.
echo 프론트엔드 URL: http://localhost:3000
echo.
echo 서버를 중지하려면 Ctrl+C를 누르세요
echo ========================================
echo.

npm run dev

pause

