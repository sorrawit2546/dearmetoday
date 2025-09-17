#!/bin/bash

# DearMeToday Public API Tests with Newman
# This script runs only the public API tests (no authentication required)

echo "🚀 Starting DearMeToday Public API Tests with Newman..."

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo "❌ Newman is not installed. Installing Newman..."
    npm install -g newman newman-reporter-html
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

echo "📋 Running Public API Tests..."

# Run the public collection
newman run DearMeToday_Public_API_Tests.postman_collection.json \
    --reporters cli,html \
    --reporter-html-export public-test-report.html \
    --delay-request 1000

echo "✅ Public API Tests completed!"
echo "📄 Results saved to: public-test-report.html"

# Open HTML report if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Opening HTML report..."
    open public-test-report.html
fi
