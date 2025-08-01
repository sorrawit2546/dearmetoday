-- AlterTable
ALTER TABLE "public"."entries" ADD COLUMN     "image_urls" TEXT[] DEFAULT ARRAY[]::TEXT[];
