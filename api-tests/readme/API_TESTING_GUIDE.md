# DearMeToday API Testing Guide

## 📋 Overview
This guide provides comprehensive API testing instructions for the DearMeToday application using Postman.

## 🚀 Setup Instructions

### 1. Import Collection and Environment
1. Open Postman
2. Click **Import** button
3. Import `DearMeToday_API_Tests.postman_collection.json`
4. Import `DearMeToday_Environment.postman_environment.json`
5. Select the "DearMeToday Environment" from the environment dropdown

### 2. Start the Server
```bash
cd /Users/sonine/Documents/dearmetoday/server
npm run start:dev
```

### 3. Start the Client (Optional)
```bash
cd /Users/sonine/Documents/dearmetoday/client
npm start
```

## 🔧 Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `baseUrl` | API base URL | `http://localhost:3000/api` |
| `accessToken` | JWT access token | Auto-extracted from cookies |
| `noteId` | Note ID for testing | Auto-generated |
| `userId` | User ID | Auto-extracted |
| `googleAccessToken` | Google OAuth token | Auto-extracted |

## 📝 API Endpoints

### Authentication
- **GET** `/auth/google` - Initiate Google OAuth login
- **GET** `/auth/google/callback` - Google OAuth callback
- **GET** `/auth/me` - Get current user profile
- **POST** `/auth/logout` - Logout user

### Positive Notes
- **POST** `/positive-note/create` - Create new positive note
- **POST** `/positive-note/all-note` - Get all user notes
- **POST** `/positive-note/recent-note` - Get most recent note
- **GET** `/positive-note/note/:id` - Get specific note
- **PATCH** `/positive-note/note/:id` - Update note
- **GET** `/positive-note/community-notes` - Get community notes

### Quick Notes
- **POST** `/quick-note` - Create quick thank you note
- **GET** `/quick-note` - Get all quick notes

### Health Check
- **GET** `/` - Server health check

## 🧪 Testing Workflow

### 1. Authentication Flow
1. **Google OAuth Login** - Click to initiate login
2. **Get User Profile** - Verify user data after login
3. **Logout** - Test logout functionality

### 2. Positive Notes Flow
1. **Create Positive Note** - Create a new note with sample data
2. **Get All Notes** - Verify note was created
3. **Get Recent Note** - Check most recent note
4. **Update Note** - Modify existing note
5. **Get Community Notes** - View public notes

### 3. Quick Notes Flow
1. **Create Quick Note** - Create thank you message
2. **Get All Quick Notes** - Verify creation

## 📊 Test Data Examples

### Positive Note Creation
```json
{
  "email": "test@example.com",
  "line1": "เรื่องราวดี ๆ ที่อยากขอบคุณ",
  "line2": "สิ่งเล็ก ๆ ที่ทำให้ยิ้มได้",
  "line3": "เรื่องราวที่ทำให้รู้สึกภูมิใจ",
  "mood": "happy",
  "showMessage": "true"
}
```

### Quick Note Creation
```json
{
  "thankMessage": "ขอบคุณสำหรับวันนี้ที่เต็มไปด้วยความสุข"
}
```

## 🔍 Common Test Scenarios

### 1. Authentication Tests
- ✅ Valid Google OAuth flow
- ✅ User profile retrieval
- ✅ Logout functionality
- ❌ Unauthorized access without token

### 2. Positive Notes Tests
- ✅ Create note with all fields
- ✅ Create note with images
- ✅ Update existing note
- ✅ Toggle showMessage status
- ✅ Get user's notes
- ✅ Get community notes
- ❌ Access other user's private notes

### 3. Quick Notes Tests
- ✅ Create quick note
- ✅ Retrieve user's quick notes
- ❌ Create note without authentication

## 🐛 Troubleshooting

### Common Issues
1. **401 Unauthorized** - Check if access token is set
2. **404 Not Found** - Verify baseUrl is correct
3. **500 Internal Server Error** - Check server logs
4. **CORS Issues** - Ensure server is running on correct port

### Debug Steps
1. Check server logs: `npm run start:dev`
2. Verify environment variables
3. Test with curl commands
4. Check database connection

## 📈 Performance Testing

### Response Time Expectations
- Health Check: < 100ms
- Authentication: < 500ms
- Note Creation: < 1000ms
- Note Retrieval: < 500ms
- Image Upload: < 3000ms

### Load Testing
- Use Postman Runner for multiple iterations
- Test with 10+ concurrent requests
- Monitor server performance

## 🔒 Security Testing

### Authentication Security
- Test token expiration
- Verify cookie security settings
- Test unauthorized access attempts

### Data Security
- Test input validation
- Verify file upload restrictions
- Test SQL injection prevention

## 📝 Test Reports

### Generating Reports
1. Run collection in Postman Runner
2. Export results as JSON/CSV
3. Use Newman CLI for automated testing
4. Integrate with CI/CD pipeline

### Newman CLI Usage
```bash
# Install Newman
npm install -g newman

# Run collection
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json

# Generate HTML report
newman run DearMeToday_API_Tests.postman_collection.json -e DearMeToday_Environment.postman_environment.json -r html --reporter-html-export report.html
```

## 🎯 Best Practices

1. **Always test authentication first**
2. **Use environment variables for dynamic data**
3. **Test both success and error scenarios**
4. **Verify response structure and data types**
5. **Test file uploads with actual files**
6. **Clean up test data after testing**
7. **Use descriptive test names**
8. **Add assertions for critical functionality**

## 📞 Support

If you encounter issues:
1. Check server logs
2. Verify environment setup
3. Test individual endpoints
4. Check database connectivity
5. Review API documentation

---

**Happy Testing! 🚀**
