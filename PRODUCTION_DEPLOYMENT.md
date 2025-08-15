# 🚀 Production Deployment Guide

## 📋 สิ่งที่ต้องเตรียมก่อน Deploy Production

### 1. 🌐 Domain และ SSL
- **Client Domain**: `https://dearmetoday.dev`
- **API Domain**: `https://api.dearmetoday.dev`
- **SSL Certificate**: ต้องมี SSL สำหรับทั้งสอง domains

### 2. 🔧 Environment Variables

#### สร้างไฟล์ `server/.env.production`:
```bash
# Copy from env.example
cp server/env.example server/.env.production
```

#### แก้ไขค่าต่างๆ:
```env
# Environment
NODE_ENV=production
PORT=3000

# Database (ใช้ production database)
DATABASE_URL=postgresql://username:password@your-db-host:5432/dearmetoday_prod

# Frontend URL (CORS)
FRONTEND_URL=https://dearmetoday.dev

# Server URL
SERVER_URL=https://api.dearmetoday.dev

# JWT Secret (เปลี่ยนเป็น secret ที่แข็งแกร่ง)
JWT_SECRET=your-super-secret-jwt-key-for-production

# Google OAuth (ใช้ production credentials)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# SendGrid (ใช้ production API key)
SENDGRID_API_KEY=your-production-sendgrid-api-key
MAIL_FROM=noreply@dearmetoday.dev

# Base URL for file uploads
BASE_URL=https://api.dearmetoday.dev
```

### 3. 🔐 Google OAuth Setup

#### ใน Google Cloud Console:
1. สร้าง OAuth 2.0 credentials สำหรับ production
2. เพิ่ม Authorized redirect URIs:
   - `https://api.dearmetoday.dev/auth/google/callback`

### 4. 📧 SendGrid Setup

#### ใน SendGrid:
1. สร้าง API key สำหรับ production
2. ตั้งค่า domain authentication
3. ตั้งค่า sender verification

### 5. 🗄️ Database Setup

#### Production Database:
```sql
-- สร้าง database
CREATE DATABASE dearmetoday_prod;

-- สร้าง user
CREATE USER dearmetoday_user WITH PASSWORD 'strong_password';

-- ให้สิทธิ์
GRANT ALL PRIVILEGES ON DATABASE dearmetoday_prod TO dearmetoday_user;
```

## 🚀 วิธี Deploy

### 1. เตรียม Server
```bash
# Clone repository
git clone https://github.com/your-username/dearmetoday.git
cd dearmetoday

# สร้าง environment files
cp server/env.example server/.env.production
# แก้ไขค่าต่างๆ ใน .env.production
```

### 2. Deploy Production
```bash
# Deploy production
./deploy.sh prod
```

### 3. ตรวจสอบ
```bash
# ดูสถานะ containers
docker-compose ps

# ดู logs
docker-compose logs server
docker-compose logs client-prod
```

## 🌐 URLs หลัง Deploy

| Service | URL | Port |
|---------|-----|------|
| Client | https://dearmetoday.dev | 80 (Nginx) |
| API | https://api.dearmetoday.dev | 3000 |
| Database | localhost | 5432 |

## 🔧 Reverse Proxy Setup (Nginx)

### สำหรับ Client:
```nginx
server {
    listen 80;
    server_name dearmetoday.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name dearmetoday.dev;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### สำหรับ API:
```nginx
server {
    listen 80;
    server_name api.dearmetoday.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.dearmetoday.dev;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔍 Monitoring และ Maintenance

### 1. Logs
```bash
# ดู logs ทั้งหมด
docker-compose logs -f

# ดู logs เฉพาะ service
docker-compose logs -f server
docker-compose logs -f client-prod
```

### 2. Database Backup
```bash
# Backup database
docker exec dearmetoday-postgres-1 pg_dump -U myuser mydb > backup.sql

# Restore database
docker exec -i dearmetoday-postgres-1 psql -U myuser mydb < backup.sql
```

### 3. Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild และ restart
docker-compose down
./deploy.sh prod
```

## ⚠️ Security Checklist

- [ ] เปลี่ยน JWT_SECRET เป็นค่าที่แข็งแกร่ง
- [ ] ใช้ HTTPS ทั้งหมด
- [ ] ตั้งค่า CORS ให้ถูกต้อง
- [ ] ใช้ production database
- [ ] ตั้งค่า firewall
- [ ] ใช้ strong passwords
- [ ] เปิดใช้งาน SSL certificates
- [ ] ตั้งค่า rate limiting
- [ ] ตรวจสอบ logs เป็นประจำ

## 🆘 Troubleshooting

### ถ้า API ไม่ทำงาน:
1. ตรวจสอบ environment variables
2. ตรวจสอบ database connection
3. ดู logs: `docker-compose logs server`

### ถ้า Client ไม่ทำงาน:
1. ตรวจสอบ build process
2. ตรวจสอบ nginx configuration
3. ดู logs: `docker-compose logs client-prod`

### ถ้า Database ไม่เชื่อมต่อ:
1. ตรวจสอบ DATABASE_URL
2. ตรวจสอบ network connectivity
3. ดู logs: `docker-compose logs postgres` 