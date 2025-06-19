-- CreateTable
CREATE TABLE "uuidmappings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "source" BIGINT NOT NULL,
    "uuid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uuidmappings_pkey" PRIMARY KEY ("id")
);
