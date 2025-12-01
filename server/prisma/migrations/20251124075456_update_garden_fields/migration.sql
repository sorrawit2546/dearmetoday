/*
  Warnings:

  - You are about to drop the column `bloomAt` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `growthDays` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `memory` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `plantAt` on the `Garden` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Garden` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Garden" DROP COLUMN "bloomAt",
DROP COLUMN "createdAt",
DROP COLUMN "growthDays",
DROP COLUMN "memory",
DROP COLUMN "plantAt",
ADD COLUMN     "amount" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
