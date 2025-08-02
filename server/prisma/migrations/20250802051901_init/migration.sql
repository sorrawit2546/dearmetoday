-- DropForeignKey
ALTER TABLE "public"."entries" DROP CONSTRAINT "entries_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."entries" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."entries" ADD CONSTRAINT "entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
