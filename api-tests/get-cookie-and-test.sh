#!/bin/bash

# DearMeToday API Tests with Cookie Authentication
# This script gets cookies from browser and runs Newman tests

echo "🍪 Starting DearMeToday API Tests with Cookie Authentication..."

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

# Function to get cookies from browser
get_cookies_from_browser() {
    echo "🍪 Getting cookies from browser..."
    
    # Method 1: Try to get cookies from Chrome (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # Get cookies from Chrome
        COOKIES=$(osascript -e 'tell application "Google Chrome" to get URL of active tab of front window' 2>/dev/null | xargs -I {} curl -s -c - -b - "{}" 2>/dev/null | grep -i "access_token" | head -1)
        
        if [ -n "$COOKIES" ]; then
            echo "✅ Found cookies from Chrome"
            echo "$COOKIES"
            return 0
        fi
    fi
    
    # Method 2: Manual cookie input
    echo "📝 Please provide your authentication cookie:"
    echo "   You can find it in your browser's Developer Tools > Application > Cookies"
    echo "   Look for 'access_token' cookie"
    echo ""
    read -p "Enter your cookie string (e.g., access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...): " COOKIES
    
    if [ -n "$COOKIES" ]; then
        echo "✅ Cookie received"
        echo "$COOKIES"
        return 0
    else
        echo "❌ No cookie provided"
        return 1
    fi
}

# Function to update environment with cookie
update_environment_with_cookie() {
    local cookie_string="$1"
    
    echo "🔄 Updating environment with cookie..."
    
    # Create a temporary environment file with cookie
    cat > temp_environment.json << EOF
{
  "id": "dearmetoday-env-with-cookie",
  "name": "DearMeToday Environment with Cookie",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api",
      "type": "default",
      "enabled": true
    },
    {
      "key": "accessToken",
      "value": "$cookie_string",
      "type": "secret",
      "enabled": true
    },
    {
      "key": "cookieString",
      "value": "$cookie_string",
      "type": "secret",
      "enabled": true
    },
    {
      "key": "noteId",
      "value": "",
      "type": "default",
      "enabled": true
    },
    {
      "key": "userId",
      "value": "",
      "type": "default",
      "enabled": true
    }
  ],
  "_postman_variable_scope": "environment"
}
EOF
    
    echo "✅ Environment updated with cookie"
}

# Function to run tests with cookie
run_tests_with_cookie() {
    echo "📋 Running API Tests with Cookie Authentication..."
    
    # Run the collection with cookie authentication
    newman run DearMeToday_API_Tests.postman_collection.json \
        -e temp_environment.json \
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
}

# Main execution
main() {
    # Get cookies
    COOKIES=$(get_cookies_from_browser)
    
    if [ $? -eq 0 ] && [ -n "$COOKIES" ]; then
        # Update environment
        update_environment_with_cookie "$COOKIES"
        
        # Run tests
        run_tests_with_cookie
        
        # Clean up
        rm -f temp_environment.json
        
        echo "🎉 All done!"
    else
        echo "❌ Failed to get cookies. Exiting..."
        exit 1
    fi
}

# Run main function
main
