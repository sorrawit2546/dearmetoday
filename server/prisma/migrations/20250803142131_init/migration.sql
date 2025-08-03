-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "provider_id" TEXT;
