@echo off
echo ========================================
echo   문서박사 전체 시스템 시작
echo ========================================
echo.

echo 백엔드와 프론트엔드 서버를 새 창에서 시작합니다...
echo.

start "문서박사 - 백엔드" cmd /k "START_BACKEND.bat"
timeout /t 3 /nobreak >nul

start "문서박사 - 프론트엔드" cmd /k "START_FRONTEND.bat"

echo.
echo ========================================
echo 서버가 시작되었습니다!
echo ========================================
echo.
echo 백엔드: http://localhost:8000
echo 프론트엔드: http://localhost:3000
echo API 문서: http://localhost:8000/docs
echo.
echo 브라우저에서 http://localhost:3000 을 열어주세요!
echo.

pause

