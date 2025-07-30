-- CreateEnum
CREATE TYPE "public"."Mood" AS ENUM ('happy', 'sad', 'neutral');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."entries" (
    "id" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT NOT NULL,
    "line3" TEXT NOT NULL,
    "mood" "public"."Mood" NOT NULL,
    "image_url" VARCHAR(256),
    "entry_date" DATE NOT NULL,
    "show_message" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."entries" ADD CONSTRAINT "entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
