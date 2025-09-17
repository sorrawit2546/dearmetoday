# 🚀 Newman CLI Testing for DearMeToday

## 📋 Overview
This guide shows how to run API tests for DearMeToday using Newman CLI (Command Line Interface for Postman).

## 🛠️ Quick Setup

### 1. Install Newman
```bash
# Install Newman globally
npm install -g newman newman-reporter-html

# Or install locally
npm install
```

### 2. Start the Server
```bash
cd server
npm run start:dev
```

### 3. Run Tests
```bash
# Run public API tests (no authentication required)
./test-public-apis.sh

# Or run manually
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli
```

## 📁 Available Test Collections

### 1. **DearMeToday_Public_API_Tests.postman_collection.json**
- ✅ **No authentication required**
- ✅ **Safe to run anytime**
- Tests public endpoints:
  - Health check
  - Community notes
  - Google OAuth initiation

### 2. **DearMeToday_API_Tests.postman_collection.json**
- 🔐 **Requires authentication**
- Tests protected endpoints:
  - User profile
  - Create/Read/Update notes
  - Quick notes

## 🎯 Quick Commands

### Public API Tests (Recommended)
```bash
# Run public tests
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli

# Run with HTML report
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli,html --reporter-html-export report.html

# Run with delay between requests
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli --delay-request 2000
```

### Full API Tests (Requires Authentication)
```bash
# Run all tests (will show authentication errors)
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters cli

# Run with HTML report
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters cli,html --reporter-html-export full-report.html
```

## 📊 Test Results

### ✅ Successful Public API Test
```
DearMeToday Public API Tests

❏ Health Check
↳ Server Health Check
  GET http://localhost:3000/api/ [200 OK, 345B, 89ms]
  ✓  Status code is successful
  ✓  Response time is less than 5000ms
  ✓  Response has content

❏ Public Endpoints
↳ Get Community Notes
  GET http://localhost:3000/api/positive-note/community-notes [200 OK, 8.71kB, 31ms]
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

## 🔧 Advanced Usage

### Custom Environment Variables
```bash
# Override base URL
newman run DearMeToday_Public_API_Tests.postman_collection.json --env-var "baseUrl=http://localhost:3000/api"

# Run with custom iteration count
newman run DearMeToday_Public_API_Tests.postman_collection.json --iteration-count 5

# Run with timeout
newman run DearMeToday_Public_API_Tests.postman_collection.json --timeout-request 10000
```

### Multiple Reporters
```bash
# Generate both CLI and HTML reports
newman run DearMeToday_Public_API_Tests.postman_collection.json \
  --reporters cli,json,html \
  --reporter-json-export results.json \
  --reporter-html-export report.html
```

### Verbose Output
```bash
# Show detailed request/response information
newman run DearMeToday_Public_API_Tests.postman_collection.json --verbose

# Debug mode
newman run DearMeToday_Public_API_Tests.postman_collection.json --debug
```

## 🚨 Troubleshooting

### Common Issues

1. **Server not running**
   ```bash
   # Check if server is running
   curl http://localhost:3000/api/
   
   # Start server if not running
   cd server && npm run start:dev
   ```

2. **Newman not installed**
   ```bash
   # Install Newman
   npm install -g newman newman-reporter-html
   ```

3. **Permission denied**
   ```bash
   # Make scripts executable
   chmod +x test-public-apis.sh
   chmod +x run-tests.sh
   ```

4. **Port conflicts**
   ```bash
   # Check if port 3000 is in use
   lsof -i :3000
   
   # Kill process if needed
   kill -9 $(lsof -t -i:3000)
   ```

## 📈 Performance Testing

### Load Testing
```bash
# Run 10 iterations
newman run DearMeToday_Public_API_Tests.postman_collection.json --iteration-count 10

# Run with delay between iterations
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

### GitHub Actions Example
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

1. **Always test public APIs first** - No authentication required
2. **Use environment variables** - For different environments
3. **Generate multiple reports** - CLI, JSON, and HTML
4. **Add delays between requests** - Avoid overwhelming the server
5. **Monitor response times** - Set appropriate timeouts
6. **Test error scenarios** - Invalid endpoints, server down
7. **Clean up test data** - Remove test data after testing

## 🎉 Example Workflow

```bash
# 1. Start server
cd server && npm run start:dev &

# 2. Wait for server to start
sleep 5

# 3. Run public API tests
newman run DearMeToday_Public_API_Tests.postman_collection.json --reporters cli,html

# 4. Check results
open public-test-report.html

# 5. Stop server when done
pkill -f "npm run start:dev"
```

---

**Happy Testing with Newman! 🚀**

## 📞 Support

If you encounter issues:
1. Check server logs: `cd server && npm run start:dev`
2. Verify Newman installation: `newman --version`
3. Test individual endpoints with curl
4. Check port availability: `lsof -i :3000`
