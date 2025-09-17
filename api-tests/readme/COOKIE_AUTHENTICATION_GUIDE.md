# 🍪 Cookie Authentication Guide for Newman

## 📋 Overview
This guide shows how to use cookies for authentication when running Newman API tests.

## 🔍 How to Get Your Cookie

### Method 1: From Browser Developer Tools
1. **Open your browser** and go to `http://localhost:4200`
2. **Login** to your account
3. **Open Developer Tools** (F12 or right-click > Inspect)
4. **Go to Application tab** > Cookies > `http://localhost:4200`
5. **Find the `access_token` cookie** and copy its value
6. **Copy the full cookie string** (e.g., `access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Method 2: From Network Tab
1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Make any API request** (e.g., refresh the page)
4. **Find a request** to your API
5. **Click on the request** and look at **Request Headers**
6. **Copy the Cookie header** value

## 🚀 Ways to Use Cookies with Newman

### Method 1: Command Line with Environment Variables (Recommended)
```bash
# Set cookie as environment variable
export COOKIE_STRING="access_token=your-token-here"

# Run Newman with cookie
newman run DearMeToday_API_Tests.postman_collection.json \
    -e DearMeToday_Environment.postman_environment.json \
    --env-var "cookieString=$COOKIE_STRING" \
    --env-var "accessToken=$COOKIE_STRING" \
    --reporters cli
```

### Method 2: Using the Simple Script
```bash
# Run with cookie directly
./test-with-cookie.sh "access_token=your-token-here"
```

### Method 3: Using the Advanced Script
```bash
# Interactive script that helps you get cookies
./get-cookie-and-test.sh
```

### Method 4: Manual Environment Update
1. **Edit the environment file:**
   ```bash
   nano DearMeToday_Environment.postman_environment.json
   ```

2. **Update the cookieString value:**
   ```json
   {
     "key": "cookieString",
     "value": "access_token=your-token-here",
     "type": "secret",
     "enabled": true
   }
   ```

3. **Run Newman:**
   ```bash
   newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json
   ```

## 🔧 Updating Postman Collection for Cookie Support

The collection needs to be updated to use cookies. Here's how:

### 1. Update Request Headers
Each authenticated request should include:
```json
{
  "key": "Cookie",
  "value": "{{cookieString}}",
  "type": "text"
}
```

### 2. Update Pre-request Scripts
Add this to the collection's pre-request script:
```javascript
// Set cookie from environment variable
if (pm.environment.get("cookieString")) {
    pm.request.headers.add({
        key: "Cookie",
        value: pm.environment.get("cookieString")
    });
}
```

## 📊 Example Cookie Values

### Valid Cookie Format
```
access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Multiple Cookies
```
access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; refresh_token=another-token-here; session_id=session-123
```

## 🚨 Troubleshooting

### Common Issues

1. **Cookie Expired**
   ```
   Error: 401 Unauthorized
   Solution: Get a fresh cookie from browser
   ```

2. **Invalid Cookie Format**
   ```
   Error: Cookie not recognized
   Solution: Ensure cookie includes "access_token=" prefix
   ```

3. **Cookie Not Set**
   ```
   Error: No authentication
   Solution: Check if cookieString environment variable is set
   ```

### Debug Commands

```bash
# Test cookie with curl
curl -H "Cookie: access_token=your-token-here" http://localhost:3000/api/auth/me

# Check environment variables
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --env-var "cookieString=test" --verbose

# Test individual request
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json --request-name "Get User Profile"
```

## 🔄 Automated Cookie Extraction

### For Chrome (macOS)
```bash
# Extract cookie from Chrome
osascript -e 'tell application "Google Chrome" to get URL of active tab of front window' | xargs -I {} curl -s -c - -b - "{}" | grep -i "access_token"
```

### For Firefox (macOS)
```bash
# Extract cookie from Firefox
sqlite3 ~/Library/Application\ Support/Firefox/Profiles/*/cookies.sqlite "SELECT name, value FROM moz_cookies WHERE host = 'localhost' AND name = 'access_token';"
```

## 📝 Best Practices

1. **Always use fresh cookies** - Don't use expired tokens
2. **Store cookies securely** - Use environment variables or secure files
3. **Test cookie validity** - Verify cookie works before running full tests
4. **Use different cookies for different environments** - Dev, staging, production
5. **Monitor cookie expiration** - Set up alerts for token expiry
6. **Clean up after testing** - Remove sensitive data from logs

## 🎯 Quick Start Examples

### Example 1: Quick Test
```bash
# Get cookie from browser, then run
./test-with-cookie.sh "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Example 2: Environment Variable
```bash
# Set cookie
export COOKIE="access_token=your-token-here"

# Run tests
newman run DearMeToday_API_Tests.postman_collection.json \
    -e DearMeToday_Environment.postman_environment.json \
    --env-var "cookieString=$COOKIE" \
    --reporters cli,html
```

### Example 3: Interactive
```bash
# Run interactive script
./get-cookie-and-test.sh
```

## 🔐 Security Notes

- **Never commit cookies** to version control
- **Use environment variables** for sensitive data
- **Rotate cookies regularly** for security
- **Use different cookies** for different environments
- **Monitor cookie usage** for suspicious activity

---

**Happy Testing with Cookies! 🍪**
