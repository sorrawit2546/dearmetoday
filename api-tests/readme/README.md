# 🚀 DearMeToday API Testing Suite

## 📋 Overview
This folder contains all API testing files for the DearMeToday application using Newman CLI (Postman Command Line Interface).

## 📁 Folder Structure
```
api-tests/
├── README.md                                    # This file
├── package.json                                 # NPM package for Newman
├── DearMeToday_Public_API_Tests.postman_collection.json    # Public API tests
├── DearMeToday_API_Tests.postman_collection.json          # Full API tests
├── DearMeToday_Environment.postman_environment.json       # Environment variables
├── test-public-apis.sh                         # Script to run public API tests
├── run-tests.sh                                # Script to run full API tests
├── API_TESTING_GUIDE.md                        # Complete API testing guide
├── NEWMAN_QUICK_START.md                       # Quick start guide
└── NEWMAN_TESTING_GUIDE.md                     # Detailed Newman guide
```

## ⚡ Quick Start

### 1. Install Newman
```bash
npm install -g newman newman-reporter-html
```

### 2. Start the Server
```bash
cd ../server
npm run start:dev
```

### 3. Run Tests
```bash
# Run public API tests (recommended)
./test-public-apis.sh

# Run full API tests
./run-tests.sh
```

## 🎯 Available Test Collections

### 1. **Public API Tests** (No Authentication Required)
- ✅ **Safe to run anytime**
- ✅ **No setup required**
- Tests:
  - Health check
  - Community notes
  - Google OAuth initiation

### 2. **Full API Tests** (Authentication Required)
- 🔐 **Requires authentication**
- Tests:
  - User profile
  - Create/Read/Update notes
  - Quick notes
  - All protected endpoints

## 🚀 Quick Commands

### Public API Tests (Recommended)
```bash
# Run public tests
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli

# Run with HTML report
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli,html

# Run with delay
newman run DearMeToday_Public_API_Tests.postman_collection.json --delay-request 2000
```

### Full API Tests
```bash
# Run all tests
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters cli

# Run with HTML report
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters cli,html
```

## 📊 Test Results

### ✅ Successful Public API Test
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

## 🔧 Troubleshooting

### Common Issues
1. **Server not running**: `cd ../server && npm run start:dev`
2. **Newman not installed**: `npm install -g newman`
3. **Permission denied**: `chmod +x *.sh`
4. **Port conflicts**: `lsof -i :3000`

### Debug Commands
```bash
# Check server status
curl http://localhost:3000/api/

# Check Newman version
newman --version

# Run with verbose output
newman run DearMeToday_Public_API_Tests.postman_collection.json --verbose
```

## 📈 Performance Testing

### Load Testing
```bash
# Run 10 iterations
newman run DearMeToday_Public_API_Tests.postman_collection.json --iteration-count 10

# Run with delay
newman run DearMeToday_Public_API_Tests.postman_collection.json --iteration-count 5 --delay-request 1000
```

### Stress Testing
```bash
# Run multiple times
for i in {1..5}; do
  echo "Run $i"
  newman run DearMeToday_Public_API_Tests.postman_collection.json --delay-request 500
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
        run: cd api-tests && newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli
```

## 📝 Best Practices

1. **Start with public APIs** - No authentication required
2. **Use environment variables** - For different environments
3. **Generate multiple reports** - CLI, JSON, and HTML
4. **Add delays between requests** - Avoid overwhelming the server
5. **Monitor response times** - Set appropriate timeouts
6. **Test error scenarios** - Invalid endpoints, server down
7. **Clean up test data** - Remove test data after testing

## 📚 Documentation

- **`API_TESTING_GUIDE.md`** - Complete API testing guide
- **`NEWMAN_QUICK_START.md`** - Quick start guide
- **`NEWMAN_TESTING_GUIDE.md`** - Detailed Newman guide

## 🎉 Example Workflow

```bash
# 1. Start server
cd ../server && npm run start:dev &

# 2. Wait for server to start
sleep 5

# 3. Run public API tests
./test-public-apis.sh

# 4. Check results
open public-test-report.html

# 5. Stop server when done
pkill -f "npm run start:dev"
```

---

**Happy Testing! 🚀**

## 📞 Support

If you encounter issues:
1. Check server logs: `cd ../server && npm run start:dev`
2. Verify Newman installation: `newman --version`
3. Test individual endpoints with curl
4. Check port availability: `lsof -i :3000`
