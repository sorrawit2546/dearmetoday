# 🚀 Newman Quick Start Guide

## ⚡ เริ่มต้นใช้งานใน 3 ขั้นตอน

### 1. ติดตั้ง Newman
```bash
npm install -g newman newman-reporter-html
```

### 2. เริ่ม Server
```bash
cd server
npm run start:dev
```

### 3. รัน Tests
```bash
# วิธีที่ 1: ใช้ Script (แนะนำ)
./test-public-apis.sh

# วิธีที่ 2: รันโดยตรง
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli
```

## 📋 ไฟล์ที่สำคัญ

| ไฟล์ | คำอธิบาย |
|------|----------|
| `DearMeToday_Public_API_Tests.postman_collection.json` | Collection สำหรับทดสอบ Public APIs |
| `DearMeToday_API_Tests.postman_collection.json` | Collection สำหรับทดสอบ APIs ที่ต้อง Authentication |
| `DearMeToday_Environment.postman_environment.json` | Environment Variables |
| `test-public-apis.sh` | Script สำหรับรัน Public API Tests |
| `run-tests.sh` | Script สำหรับรัน Full API Tests |

## 🎯 คำสั่งที่ใช้บ่อย

### ทดสอบ Public APIs (ไม่ต้อง Authentication)
```bash
# รันแบบง่าย
newman run DearMeToday_Public_API_Tests.postman_collection.json

# รันพร้อม HTML Report
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli,html

# รันพร้อม Delay
newman run DearMeToday_Public_API_Tests.postman_collection.json --delay-request 2000
```

### ทดสอบ Full APIs (ต้อง Authentication)
```bash
# รันแบบง่าย
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json

# รันพร้อม HTML Report
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters cli,html
```

## 📊 ผลลัพธ์ที่คาดหวัง

### ✅ Public API Tests (สำเร็จ)
```
DearMeToday Public API Tests

❏ Health Check
↳ Server Health Check
  GET http://localhost:3000/api/ [200 OK, 345B, 81ms]
  ✓  Status code is successful
  ✓  Response time is less than 5000ms
  ✓  Response has content

❏ Public Endpoints
↳ Get Community Notes
  GET http://localhost:3000/api/positive-note/community-notes [200 OK, 8.71kB, 52ms]
  ✓  Status code is successful
  ✓  Response time is less than 5000ms
  ✓  Response has content

┌─────────────────────────┬────────────────────┬────────────────────┐
│                         │           executed │             failed │
├─────────────────────────┼────────────────────┼────────────────────┤
│              iterations │                  1 │                  0 │
├─────────────────────────┼────────────────────┼────────────────────┤
│                requests │                  3 │                  0 │
├─────────────────────────┼────────────────────┼────────────────────┤
│            test-scripts │                  3 │                  0 │
├─────────────────────────┼────────────────────┼────────────────────┤
│      prerequest-scripts │                  0 │                  0 │
├─────────────────────────┼────────────────────┼────────────────────┤
│              assertions │                  9 │                  0 │
└─────────────────────────┴────────────────────┴────────────────────┘
```

## 🔧 การแก้ไขปัญหา

### Server ไม่ทำงาน
```bash
# ตรวจสอบว่า Server ทำงานอยู่หรือไม่
curl http://localhost:3000/api/

# เริ่ม Server
cd server && npm run start:dev
```

### Newman ไม่ติดตั้ง
```bash
# ติดตั้ง Newman
npm install -g newman newman-reporter-html

# ตรวจสอบเวอร์ชัน
newman --version
```

### Permission Denied
```bash
# ให้สิทธิ์ execute
chmod +x test-public-apis.sh
chmod +x run-tests.sh
```

## 🎉 ตัวอย่างการใช้งาน

### 1. ทดสอบ Public APIs
```bash
# รัน Public API Tests
./test-public-apis.sh
```

### 2. ทดสอบ Full APIs
```bash
# รัน Full API Tests
./run-tests.sh
```

### 3. ทดสอบแบบ Custom
```bash
# รันพร้อม HTML Report
newman run DearMeToday_Public_API_Tests.postman_collection.json \
  --reporters cli,html \
  --reporter-html-export my-report.html

# รันหลายครั้ง
newman run DearMeToday_Public_API_Tests.postman_collection.json \
  --iteration-count 5 \
  --delay-request 1000
```

## 📈 Performance Testing

### Load Testing
```bash
# รัน 10 ครั้ง
newman run DearMeToday_Public_API_Tests.postman_collection.json --iteration-count 10

# รันพร้อม Delay
newman run DearMeToday_Public_API_Tests.postman_collection.json --iteration-count 5 --delay-request 2000
```

### Stress Testing
```bash
# รันหลายครั้งพร้อมกัน
for i in {1..5}; do
  echo "Run $i"
  newman run DearMeToday_Public_API_Tests.postman_collection.json --delay-request 500 &
done
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install Newman
        run: npm install -g newman
      - name: Start Server
        run: cd server && npm run start:dev &
      - name: Wait for Server
        run: sleep 10
      - name: Run Tests
        run: newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli
```

## 📝 Best Practices

1. **เริ่มด้วย Public APIs** - ไม่ต้อง Authentication
2. **ใช้ Environment Variables** - สำหรับ Environment ต่าง ๆ
3. **สร้าง Multiple Reports** - CLI, JSON, และ HTML
4. **เพิ่ม Delay ระหว่าง Requests** - ไม่ให้ Server Overload
5. **ตรวจสอบ Response Time** - ตั้ง Timeout ที่เหมาะสม
6. **ทดสอบ Error Scenarios** - Endpoint ผิด, Server Down
7. **ทำความสะอาด Test Data** - ลบข้อมูลทดสอบหลังเสร็จ

---

**Happy Testing! 🚀**
