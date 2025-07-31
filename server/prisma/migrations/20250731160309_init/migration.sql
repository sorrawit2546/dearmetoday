/*
  Warnings:

  - Added the required column `email` to the `entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."entries" ADD COLUMN     "email" TEXT NOT NULL;
