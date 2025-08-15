# 🚀 Deployment Guide

## 📋 Overview

โปรเจคนี้มี 3 environments:
- **Development** (`dev`) - สำหรับการพัฒนา
- **Staging** (`staging`) - สำหรับทดสอบก่อน production
- **Production** (`prod`) - สำหรับใช้งานจริง

## 🛠️ วิธี Deploy (ง่าย!)

### ใช้ Script เดียว:

```bash
# Deploy development
./deploy.sh dev

# Deploy staging
./deploy.sh staging

# Deploy production
./deploy.sh prod
```

## 🌐 URLs ตาม Environment

| Environment | Client URL | Server API | Database |
|-------------|------------|------------|----------|
| Development | http://localhost:4200 | http://localhost:3000/api | localhost:5432 |
| Staging | http://localhost:4300 | http://localhost:3000/api | localhost:5432 |
| Production | http://localhost:8080 | http://localhost:3000/api | localhost:5432 |

## 🔧 การจัดการ Containers

```bash
# ดูสถานะ containers
docker-compose ps

# ดู logs
docker-compose logs [service-name]

# หยุดการทำงาน
docker-compose down

# Rebuild และ restart
docker-compose down && ./deploy.sh dev
```

## 📁 โครงสร้างไฟล์

```
dearmetoday/
├── docker-compose.yml          # ไฟล์เดียวสำหรับทุก environment
├── deploy.sh                   # Script สำหรับ deploy
├── DEPLOYMENT.md              # คู่มือนี้
└── server/
    ├── .env.local             # Development environment
    ├── .env.staging           # Staging environment
    ├── .env.production        # Production environment
    └── env.example           # Template
```

## ⚠️ ข้อควรระวัง

1. **Development**: ใช้ Angular dev server พร้อม hot reload
2. **Staging/Production**: ใช้ Nginx serve static files
3. **Database**: ใช้ PostgreSQL เดียวกันทุก environment
4. **Ports**: ตรวจสอบว่า ports ไม่ชนกัน

## 🐛 Troubleshooting

### ถ้า port ถูกใช้งานอยู่
```bash
# ตรวจสอบ port ที่ใช้งาน
lsof -i :4200
lsof -i :4300
lsof -i :8080

# หยุด process ที่ใช้ port
kill -9 [PID]
```

### ถ้า container ไม่ start
```bash
# ดู logs
docker-compose logs [service-name]

# Rebuild image
docker-compose build [service-name]
``` 