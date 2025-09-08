#คำสั่งรัน docker-compose == development
CLIENT_DOCKERFILE=Dockerfile.dev APP_ENV=development NODE_ENV=development CLIENT_PORT=4200 docker compose up --build
#คำสั่งรัน docker-compose == prod
CLIENT_DOCKERFILE=Dockerfile APP_ENV=production NODE_ENV=production CLIENT_PORT=8080 docker compose up --build -d

หรือ ./deploy.sh dev