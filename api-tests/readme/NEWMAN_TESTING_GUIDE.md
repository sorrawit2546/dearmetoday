# Newman CLI Testing Guide for DearMeToday

## 🚀 Quick Start

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
# Basic test run
npm test

# Or use the script
./run-tests.sh
```

## 📋 Available Test Commands

### Basic Testing
```bash
# Run all tests with CLI output
npm run test:cli

# Run tests with JSON output
npm run test:json

# Run tests with HTML report
npm run test:html

# Run all reporters
npm run test:all
```

### Advanced Testing
```bash
# Verbose output
npm run test:verbose

# Multiple iterations
npm run test:iteration

# Add delay between requests
npm run test:delay
```

### Custom Newman Commands
```bash
# Basic run
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json

# With specific reporter
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters cli,html

# With custom environment variables
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --env-var "baseUrl=http://localhost:3000/api"

# With iteration count
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --iteration-count 5

# With delay between requests
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --delay-request 2000

# With timeout
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --timeout-request 10000
```

## 🔧 Environment Configuration

### Environment Variables
```bash
# Set environment variables
export NEWMAN_BASE_URL="http://localhost:3000/api"
export NEWMAN_ACCESS_TOKEN="your-token-here"

# Or use .env file
echo "NEWMAN_BASE_URL=http://localhost:3000/api" > .env
echo "NEWMAN_ACCESS_TOKEN=your-token-here" >> .env
```

### Custom Environment File
```json
{
  "id": "custom-env",
  "name": "Custom Environment",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api",
      "type": "default"
    },
    {
      "key": "accessToken",
      "value": "your-token-here",
      "type": "secret"
    }
  ]
}
```

## 📊 Reporters

### CLI Reporter
```bash
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters cli
```

### JSON Reporter
```bash
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters json --reporter-json-export results.json
```

### HTML Reporter
```bash
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters html --reporter-html-export report.html
```

### Multiple Reporters
```bash
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --reporters cli,json,html --reporter-json-export results.json --reporter-html-export report.html
```

## 🎯 Test Scenarios

### 1. Authentication Flow
```bash
# Test only authentication
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --folder "Authentication"
```

### 2. Positive Notes Only
```bash
# Test only positive notes
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --folder "Positive Notes"
```

### 3. Quick Notes Only
```bash
# Test only quick notes
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --folder "Quick Notes"
```

## 🔍 Debugging

### Verbose Output
```bash
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --verbose
```

### Debug Mode
```bash
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --debug
```

### Specific Request
```bash
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --request-name "Create Positive Note"
```

## 📈 Performance Testing

### Load Testing
```bash
# Run 10 iterations
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --iteration-count 10

# Run with delay
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --delay-request 1000 --iteration-count 5
```

### Stress Testing
```bash
# Run multiple times with different delays
for i in {1..5}; do
  echo "Run $i"
  newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --delay-request 500
done
```

## 🚨 Error Handling

### Common Issues
1. **Server not running**: Make sure server is started
2. **Port conflicts**: Check if port 3000 is available
3. **Authentication errors**: Verify access token
4. **Timeout errors**: Increase timeout settings

### Troubleshooting Commands
```bash
# Check server status
curl http://localhost:3000/api/

# Check specific endpoint
curl http://localhost:3000/api/positive-note/community-notes

# Test with verbose output
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --verbose --debug
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
      - name: Install dependencies
        run: npm install
      - name: Install Newman
        run: npm install -g newman
      - name: Start Server
        run: cd server && npm run start:dev &
      - name: Wait for Server
        run: sleep 10
      - name: Run Tests
        run: npm test
      - name: Upload Results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test-results.json
```

### Jenkins Pipeline
```groovy
pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npm install -g newman'
            }
        }
        stage('Start Server') {
            steps {
                sh 'cd server && npm run start:dev &'
                sh 'sleep 10'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'test-results.json', fingerprint: true
        }
    }
}
```

## 📝 Best Practices

1. **Always start server before testing**
2. **Use environment variables for configuration**
3. **Run tests in different environments**
4. **Generate multiple report formats**
5. **Include error handling in test scripts**
6. **Use iteration count for load testing**
7. **Monitor response times**
8. **Clean up test data after testing**

## 🎉 Example Output

```bash
$ npm test

DearMeToday API Tests

→ Authentication
  GET http://localhost:3000/api/auth/google [200 OK, 123ms]
  GET http://localhost:3000/api/auth/me [200 OK, 45ms]
  POST http://localhost:3000/api/auth/logout [200 OK, 23ms]

→ Positive Notes
  POST http://localhost:3000/api/positive-note/create [201 Created, 234ms]
  POST http://localhost:3000/api/positive-note/all-note [200 OK, 67ms]
  GET http://localhost:3000/api/positive-note/note/123 [200 OK, 34ms]
  PATCH http://localhost:3000/api/positive-note/note/123 [200 OK, 156ms]

→ Quick Notes
  POST http://localhost:3000/api/quick-note [201 Created, 89ms]
  GET http://localhost:3000/api/quick-note [200 OK, 23ms]

┌─────────────────────────┬──────────┬──────────┐
│                         │ executed │   failed │
├─────────────────────────┼──────────┼──────────┤
│              iterations │        1 │        0 │
│                requests │       10 │        0 │
│            test-scripts │       10 │        0 │
│      prerequest-scripts │       10 │        0 │
├─────────────────────────┼──────────┼──────────┤
│              total time │     1.2s │          │
│            response time │     234ms │          │
└─────────────────────────┴──────────┴──────────┘
```

---

**Happy Testing with Newman! 🚀**
