# Dockerfile
FROM node:20-alpine

# ----- เพิ่มรับ build arg -----
ARG VERSION
LABEL app.version=$VERSION
ENV APP_VERSION=$VERSION

# Set working directory
WORKDIR /app

# ติดตั้ง pnpm
RUN npm install -g pnpm

# Copy package.json and package-lock.json
COPY pnpm-lock.yaml ./
COPY package*.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile


# Copy the rest of the application code
COPY . .

# Generate Prisma client (if using Prisma)
RUN npx prisma generate

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 3000 

# Start the application
CMD ["node", "dist/main.js"]