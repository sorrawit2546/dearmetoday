/*
  Warnings:

  - You are about to drop the column `entry_date` on the `entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."entries" DROP COLUMN "entry_date",
ALTER COLUMN "line2" DROP NOT NULL,
ALTER COLUMN "line3" DROP NOT NULL;
