# ---------- Build Stage ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    RUN npm install -g pnpm
    
    # ติดตั้ง deps
    COPY pnpm-lock.yaml package*.json ./
    RUN pnpm install --frozen-lockfile
    
    # Copy source
    COPY . .
    
    # Prisma generate (dev env)
    RUN npx prisma generate
    
    # Build dist
    RUN pnpm run build
    
    # ---------- Runtime Stage ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    RUN npm install -g pnpm
    
    # Install only production deps
    COPY pnpm-lock.yaml package*.json ./
    RUN pnpm install --prod --frozen-lockfile
    
    # ✅ Copy dist และ prisma schema จาก builder
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    EXPOSE 3000
    CMD ["node", "dist/main.js"]
    