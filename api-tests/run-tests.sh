#!/bin/bash

# DearMeToday API Tests with Newman
# This script runs the API tests using Newman CLI

echo "🚀 Starting DearMeToday API Tests with Newman..."

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo "❌ Newman is not installed. Installing Newman..."
    npm install -g newman
fi

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s http://localhost:3000/api/ > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
else
    echo "❌ Server is not running. Please start the server first:"
    echo "   cd ../server && npm run start:dev"
    exit 1
fi

# Set environment variables
export NEWMAN_BASE_URL="http://localhost:3000/api"
export NEWMAN_ACCESS_TOKEN=""

echo "📋 Running API Tests..."

# Run the collection with different reporters
echo "🔧 Running basic tests..."
newman run DearMeToday_API_Tests.postman_collection.json \
    -e DearMeToday_Environment.postman_environment.json \
    --reporters cli,json \
    --reporter-json-export test-results.json \
    --delay-request 1000

echo "📊 Generating HTML report..."
newman run DearMeToday_API_Tests.postman_collection.json \
    -e DearMeToday_Environment.postman_environment.json \
    --reporters html \
    --reporter-html-export test-report.html \
    --delay-request 1000

echo "✅ Tests completed!"
echo "📄 Results saved to:"
echo "   - test-results.json (JSON format)"
echo "   - test-report.html (HTML format)"
echo "   - Console output above"

# Open HTML report if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Opening HTML report..."
    open test-report.html
fi
