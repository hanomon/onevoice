# 배포 가이드

## 프로덕션 배포 체크리스트

### 1. 환경 변수 설정

**백엔드 (.env):**
```env
AI_API_URL=<프로덕션_AI_API_URL>
AI_MODEL=GPT-OSS-120B
AI_API_KEY=<프로덕션_API_키>
DATABASE_URL=postgresql://user:pass@host:port/dbname  # SQLite 대신 PostgreSQL 권장
CHROMA_PERSIST_DIR=/var/lib/docsagent/chroma_db
UPLOAD_DIR=/var/lib/docsagent/uploads
```

**프론트엔드 (.env.production):**
```env
VITE_API_URL=https://api.yourdomain.com
```

### 2. 보안 설정

**CORS 설정 수정 (backend/app/main.py):**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)
```

**HTTPS 설정:**
- SSL/TLS 인증서 설치
- Nginx 또는 Traefik 리버스 프록시 사용

### 3. 데이터베이스 마이그레이션

**SQLite → PostgreSQL:**
```bash
# PostgreSQL 설치
sudo apt-get install postgresql postgresql-contrib

# 데이터베이스 생성
sudo -u postgres psql
CREATE DATABASE docsagent;
CREATE USER docsagent_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE docsagent TO docsagent_user;

# 환경 변수 업데이트
DATABASE_URL=postgresql://docsagent_user:secure_password@localhost:5432/docsagent
```

---

## Docker 배포

### Dockerfile (백엔드)

`backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 앱 코드 복사
COPY app/ ./app/

# 볼륨 디렉토리 생성
RUN mkdir -p /app/uploads /app/chroma_db

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile (프론트엔드)

`frontend/Dockerfile`:
```dockerfile
# 빌드 스테이지
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

`docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: docsagent-backend
    env_file:
      - ./backend/.env
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/chroma_db:/app/chroma_db
    ports:
      - "8000:8000"
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: docsagent-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: docsagent-db
    environment:
      POSTGRES_DB: docsagent
      POSTGRES_USER: docsagent_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

**실행:**
```bash
docker-compose up -d
```

---

## 클라우드 배포

### AWS 배포

**1. EC2 인스턴스 설정**
```bash
# 인스턴스 생성 (Ubuntu 22.04 LTS)
# Security Group: 80 (HTTP), 443 (HTTPS), 22 (SSH)

# SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 필수 패키지 설치
sudo apt update
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# Git 클론
git clone https://github.com/yourusername/docsagent.git
cd docsagent

# 환경 변수 설정
cp backend/.env.example backend/.env
nano backend/.env

# Docker Compose 실행
sudo docker-compose up -d
```

**2. Nginx 리버스 프록시**

`/etc/nginx/sites-available/docsagent`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**3. SSL 인증서 설정**
```bash
sudo certbot --nginx -d yourdomain.com
```

### Azure 배포

**Azure Container Instances 사용:**
```bash
# Azure CLI 설치 및 로그인
az login

# 리소스 그룹 생성
az group create --name docsagent-rg --location koreacentral

# 컨테이너 레지스트리 생성
az acr create --resource-group docsagent-rg --name docsagentreg --sku Basic

# Docker 이미지 빌드 및 푸시
docker build -t docsagentreg.azurecr.io/backend:latest ./backend
docker build -t docsagentreg.azurecr.io/frontend:latest ./frontend
az acr login --name docsagentreg
docker push docsagentreg.azurecr.io/backend:latest
docker push docsagentreg.azurecr.io/frontend:latest

# 컨테이너 인스턴스 배포
az container create \
  --resource-group docsagent-rg \
  --name docsagent-backend \
  --image docsagentreg.azurecr.io/backend:latest \
  --cpu 2 \
  --memory 4 \
  --port 8000
```

---

## 모니터링 & 로깅

### Prometheus + Grafana

**docker-compose.yml에 추가:**
```yaml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
```

### 로그 수집

**Fluentd 또는 Logstash 사용:**
```yaml
  fluentd:
    image: fluent/fluentd
    volumes:
      - ./fluentd/conf:/fluentd/etc
    ports:
      - "24224:24224"
```

---

## CI/CD 파이프라인

### GitHub Actions

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Backend
      run: |
        cd backend
        docker build -t docsagent-backend .
    
    - name: Build Frontend
      run: |
        cd frontend
        docker build -t docsagent-frontend .
    
    - name: Deploy to Server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/docsagent
          git pull
          docker-compose down
          docker-compose up -d --build
```

---

## 백업 & 복구

### 자동 백업 스크립트

`backup.sh`:
```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/docsagent"

# 데이터베이스 백업
pg_dump docsagent > $BACKUP_DIR/db_$DATE.sql

# 파일 백업
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/lib/docsagent/uploads
tar -czf $BACKUP_DIR/chroma_$DATE.tar.gz /var/lib/docsagent/chroma_db

# 오래된 백업 삭제 (30일 이상)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

**Cron 등록:**
```bash
crontab -e
# 매일 새벽 2시 백업
0 2 * * * /opt/docsagent/backup.sh
```

---

## 성능 튜닝

### 백엔드
- Gunicorn 워커 수 증가
- Redis 캐싱 추가
- 데이터베이스 인덱싱

### 프론트엔드
- CDN 사용 (CloudFlare, AWS CloudFront)
- Gzip 압축
- 정적 파일 캐싱

### 데이터베이스
- Connection Pool 설정
- 쿼리 최적화
- Read Replica 구성

---

## 문제 해결

### 로그 확인
```bash
# Docker 로그
docker logs docsagent-backend
docker logs docsagent-frontend

# 시스템 로그
journalctl -u docsagent -f
```

### 성능 모니터링
```bash
# CPU/메모리 사용량
docker stats

# 네트워크
netstat -tulpn | grep :8000
```

---

**배포 문의: [담당자 이메일]**

