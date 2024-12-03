-- CreateTable
CREATE TABLE "TemporaryOrder" (
    "temporary_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "subcategoryName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "shipping_charges" TEXT NOT NULL,
    "totalPrice" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "adress1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "landmark" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemporaryOrder_pkey" PRIMARY KEY ("temporary_id")
);

-- CreateTable
CREATE TABLE "PermanentOrder" (
    "permanent_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "subcategoryName" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "shipping_charges" TEXT NOT NULL,
    "totalPrice" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "adress1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "landmark" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermanentOrder_pkey" PRIMARY KEY ("permanent_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryOrder_temporary_id_key" ON "TemporaryOrder"("temporary_id");

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryOrder_order_id_key" ON "TemporaryOrder"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermanentOrder_permanent_id_key" ON "PermanentOrder"("permanent_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermanentOrder_order_id_key" ON "PermanentOrder"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "PermanentOrder_payment_id_key" ON "PermanentOrder"("payment_id");
