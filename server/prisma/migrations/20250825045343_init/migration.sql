/*
  Warnings:

  - Made the column `user_id` on table `entries` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."entries" DROP CONSTRAINT "entries_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."entries" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."entries" ADD CONSTRAINT "entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
