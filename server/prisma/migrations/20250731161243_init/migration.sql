/*
  Warnings:

  - You are about to drop the column `image_url` on the `entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."entries" DROP COLUMN "image_url";

-- CreateTable
CREATE TABLE "public"."EntryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,

    CONSTRAINT "EntryImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EntryImage" ADD CONSTRAINT "EntryImage_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "public"."entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
