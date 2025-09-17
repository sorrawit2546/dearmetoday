#!/bin/bash

# Simple script to run Newman tests with cookie
# Usage: ./test-with-cookie.sh "your-cookie-string"

echo "🍪 Running DearMeToday API Tests with Cookie..."

# Check if cookie is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your cookie string"
    echo "Usage: ./test-with-cookie.sh \"access_token=your-token-here\""
    echo ""
    echo "To get your cookie:"
    echo "1. Open your browser and go to http://localhost:4200"
    echo "2. Open Developer Tools (F12)"
    echo "3. Go to Application > Cookies > http://localhost:4200"
    echo "4. Copy the value of 'access_token' cookie"
    echo "5. Run: ./test-with-cookie.sh \"access_token=your-token-value\""
    exit 1
fi

COOKIE_STRING="$1"

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

echo "🍪 Using cookie: $COOKIE_STRING"
echo "📋 Running API Tests..."

# Run Newman with cookie
newman run DearMeToday_API_Tests.postman_collection.json \
    -e DearMeToday_Environment.postman_environment.json \
    --env-var "cookieString=$COOKIE_STRING" \
    --env-var "accessToken=$COOKIE_STRING" \
    --reporters cli,html \
    --reporter-html-export cookie-test-report.html \
    --delay-request 1000

echo "✅ Tests completed!"
echo "📄 Results saved to: cookie-test-report.html"

# Open HTML report if on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🌐 Opening HTML report..."
    open cookie-test-report.html
fi
