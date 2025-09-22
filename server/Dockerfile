# ---------- Build Stage ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # ติดตั้ง dependencies
    COPY package*.json ./
    RUN npm ci
    
    # Copy source code
    COPY . .
    
    # Prisma generate (dev env)
    RUN npx prisma generate
    
    # Build dist
    RUN npm run build
    
    # ---------- Runtime Stage ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    # Install only production deps
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # ✅ Copy dist, prisma, และ .prisma
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    # Debug: ตรวจสอบไฟล์ที่ copy
    RUN ls -la /app/dist/ && echo "=== main.js content ===" && head -5 /app/dist/main.js
    
    EXPOSE 3000
    CMD ["node", "dist/main.js"]
    