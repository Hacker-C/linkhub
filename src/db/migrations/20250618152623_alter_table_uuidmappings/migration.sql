/*
  Warnings:

  - You are about to drop the column `source` on the `uuidmappings` table. All the data in the column will be lost.
  - Added the required column `short_id` to the `uuidmappings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "uuidmappings" DROP COLUMN "source",
ADD COLUMN     "short_id" BIGINT NOT NULL;
