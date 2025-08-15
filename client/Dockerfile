FROM node:20-alpine AS build

# ประกาศ build-time argument
ARG APP_ENV=production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install @angular/cli

COPY . .

RUN npm run build:${APP_ENV}

#Stage 2
FROM nginx:1.29.1-alpine

COPY --from=build /usr/src/app/dist/client/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
