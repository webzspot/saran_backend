/*
  Warnings:

  - You are about to drop the column `requirements` on the `ProductVariation` table. All the data in the column will be lost.
  - Added the required column `requirements1` to the `ProductVariation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirements2` to the `ProductVariation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PermanentOrder" ADD COLUMN     "photo" TEXT[];

-- AlterTable
ALTER TABLE "ProductVariation" DROP COLUMN "requirements",
ADD COLUMN     "requirements1" TEXT NOT NULL,
ADD COLUMN     "requirements2" TEXT NOT NULL,
ADD COLUMN     "requirements3" TEXT;

-- AlterTable
ALTER TABLE "TemporaryOrder" ADD COLUMN     "photo" TEXT[];

-- CreateTable
CREATE TABLE "TemporarySessionOrder" (
    "temporarySession_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "sessionName" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "kit_info" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "landmark" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "photo" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TemporarySessionOrder_pkey" PRIMARY KEY ("temporarySession_id")
);

-- CreateTable
CREATE TABLE "PermanentSessionOrder" (
    "permanentSession_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "sessionName" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "kit_info" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address1" TEXT,
    "address2" TEXT,
    "landmark" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "photo" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermanentSessionOrder_pkey" PRIMARY KEY ("permanentSession_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemporarySessionOrder_temporarySession_id_key" ON "TemporarySessionOrder"("temporarySession_id");

-- CreateIndex
CREATE UNIQUE INDEX "TemporarySessionOrder_order_id_key" ON "TemporarySessionOrder"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermanentSessionOrder_permanentSession_id_key" ON "PermanentSessionOrder"("permanentSession_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermanentSessionOrder_order_id_key" ON "PermanentSessionOrder"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermanentSessionOrder_payment_id_key" ON "PermanentSessionOrder"("payment_id");
