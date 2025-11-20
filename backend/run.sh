#!/bin/bash

echo "Starting DocsAgent Backend Server..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found!"
    echo "Please create .env file from .env.example"
    echo ""
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo ""
fi

# Activate virtual environment
source venv/bin/activate

# Install/Update requirements
echo "Installing dependencies..."
pip install -r requirements.txt
echo ""

# Create necessary directories
mkdir -p uploads
mkdir -p chroma_db

# Start server
echo "Starting FastAPI server on http://localhost:8000"
echo "API documentation: http://localhost:8000/docs"
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

