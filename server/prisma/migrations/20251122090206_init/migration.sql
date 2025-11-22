-- CreateEnum
CREATE TYPE "public"."RenderType" AS ENUM ('statics', 'lottie', 'sprite');

-- CreateEnum
CREATE TYPE "public"."Rarity" AS ENUM ('common', 'rare', 'epic', 'legendary', 'season');

-- CreateEnum
CREATE TYPE "public"."PlantStatus" AS ENUM ('growing', 'bloomed', 'withered');

-- CreateTable
CREATE TABLE "public"."Seed" (
    "id" TEXT NOT NULL,
    "nameEng" TEXT NOT NULL,
    "nameTH" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "growthDays" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "renderType" "public"."RenderType" NOT NULL,
    "imageStages" TEXT[],
    "animationFile" TEXT NOT NULL,
    "animationKey" TEXT NOT NULL,
    "rarity" "public"."Rarity" NOT NULL,
    "emotionTag" "public"."Mood" NOT NULL,
    "unlockCondition" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserHasSeed" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,

    CONSTRAINT "UserHasSeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Garden" (
    "id" TEXT NOT NULL,
    "growthDays" INTEGER NOT NULL,
    "plantAt" TIMESTAMP(3) NOT NULL,
    "bloomAt" TIMESTAMP(3) NOT NULL,
    "memory" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,

    CONSTRAINT "Garden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StackRecord" (
    "id" TEXT NOT NULL,
    "stack" INTEGER NOT NULL,
    "status" "public"."PlantStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "seedId" TEXT NOT NULL,

    CONSTRAINT "StackRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StackRecord_userId_key" ON "public"."StackRecord"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserHasSeed" ADD CONSTRAINT "UserHasSeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserHasSeed" ADD CONSTRAINT "UserHasSeed_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "public"."Seed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Garden" ADD CONSTRAINT "Garden_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Garden" ADD CONSTRAINT "Garden_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "public"."Seed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StackRecord" ADD CONSTRAINT "StackRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StackRecord" ADD CONSTRAINT "StackRecord_seedId_fkey" FOREIGN KEY ("seedId") REFERENCES "public"."Seed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
