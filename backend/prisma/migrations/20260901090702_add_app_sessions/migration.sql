-- CreateTable
CREATE TABLE "app_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "refresh_token_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "app_sessions_refresh_token_hash_key" ON "app_sessions"("refresh_token_hash");

-- AddForeignKey
ALTER TABLE "app_sessions" ADD CONSTRAINT "app_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
