/*
  Warnings:

  - You are about to drop the column `adress1` on the `TemporaryOrder` table. All the data in the column will be lost.
  - Added the required column `address1` to the `TemporaryOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemporaryOrder" DROP COLUMN "adress1",
ADD COLUMN     "address1" TEXT NOT NULL;
