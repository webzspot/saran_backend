/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `PermanentSessionOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_id]` on the table `TemporarySessionOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `session_id` to the `PermanentSessionOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `TemporarySessionOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PermanentSessionOrder" ADD COLUMN     "session_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TemporarySessionOrder" ADD COLUMN     "session_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PermanentSessionOrder_session_id_key" ON "PermanentSessionOrder"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "TemporarySessionOrder_session_id_key" ON "TemporarySessionOrder"("session_id");
