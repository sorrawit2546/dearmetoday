/*
  Warnings:

  - Added the required column `mood_score` to the `entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."entries" ADD COLUMN     "mood_score" SMALLINT NOT NULL;

-- CreateIndex
CREATE INDEX "entries_user_id_created_at_idx" ON "public"."entries"("user_id", "created_at");
