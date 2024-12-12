/*
  Warnings:

  - Added the required column `session_mode` to the `PermanentSessionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_mode` to the `TemporarySessionOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PermanentSessionOrder" ADD COLUMN     "session_mode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TemporarySessionOrder" ADD COLUMN     "session_mode" TEXT NOT NULL;
