@echo off
echo Starting DocsAgent Backend Server...
echo.

REM Check if .env exists
if not exist .env (
    echo Warning: .env file not found!
    echo Please create .env file from .env.example
    echo.
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install/Update requirements
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Create necessary directories
if not exist uploads mkdir uploads
if not exist chroma_db mkdir chroma_db

REM Start server
echo Starting FastAPI server on http://localhost:8000
echo API documentation: http://localhost:8000/docs
echo.
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

