# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# ติดตั้ง pnpm
RUN npm install -g pnpm

# Copy package.json and package-lock.json
COPY pnpm-lock.yaml ./
COPY package*.json ./

# Install dependencies
RUN pnpm install


# Copy the rest of the application code
COPY . .

# Generate Prisma client (if using Prisma)
RUN npx prisma generate

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 3000 

# Start the application
CMD ["pnpm", "run", "start:dev"]