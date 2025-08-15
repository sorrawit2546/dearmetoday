#!/bin/bash

# Script สำหรับ deploy ตาม environment
# วิธีใช้: ./deploy.sh [dev|staging|prod]

ENVIRONMENT=${1:-dev}

echo "🚀 Deploying to $ENVIRONMENT environment..."

# Stop all containers first
echo "🛑 Stopping all containers..."
docker-compose down

# Set environment variables based on environment
case $ENVIRONMENT in
  "dev")
    echo "🛠️  Starting development environment..."
    export NODE_ENV=local
    export APP_ENV=development
    export CLIENT_DOCKERFILE=Dockerfile.dev
    export CLIENT_PORT=4200
    # Add volumes for development
    docker-compose up -d postgres pgadmin server
    docker-compose build client
    docker run -d --rm --name client-dev --network dearmetoday_app-network -v $(pwd)/client:/usr/src/app -v /usr/src/app/node_modules -p 4200:4200 dearmetoday-client npm start -- --host 0.0.0.0 --port 4200
    ;;
  "staging")
    echo "🧪 Starting staging environment..."
    export NODE_ENV=staging
    export APP_ENV=staging
    export CLIENT_DOCKERFILE=Dockerfile
    export CLIENT_PORT=4300
    docker-compose up -d
    ;;
  "prod")
    echo "🚀 Starting production environment..."
    export NODE_ENV=production
    export APP_ENV=production
    export CLIENT_DOCKERFILE=Dockerfile
    export CLIENT_PORT=8080
    docker-compose up -d
    ;;
  *)
    echo "❌ Invalid environment. Use: dev, staging, or prod"
    exit 1
    ;;
esac

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 10

# Show URLs
case $ENVIRONMENT in
  "dev")
    echo "✅ Development environment is running at http://localhost:4200"
    ;;
  "staging")
    echo "✅ Staging environment is running at http://localhost:4300"
    ;;
  "prod")
    echo "✅ Production environment is running at http://localhost:8080"
    ;;
esac

echo "🎉 Deployment completed!"
echo "📊 Check container status: docker-compose ps" 