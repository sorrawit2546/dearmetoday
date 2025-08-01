/*
  Warnings:

  - You are about to drop the `EntryImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EntryImage" DROP CONSTRAINT "EntryImage_entryId_fkey";

-- DropTable
DROP TABLE "public"."EntryImage";
