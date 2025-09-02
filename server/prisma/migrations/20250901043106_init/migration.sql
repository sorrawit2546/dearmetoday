-- CreateTable
CREATE TABLE "public"."thank_messages" (
    "id" TEXT NOT NULL,
    "thank_message" TEXT NOT NULL,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "thank_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."thank_messages" ADD CONSTRAINT "thank_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
