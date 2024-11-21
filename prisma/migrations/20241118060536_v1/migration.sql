-- CreateTable
CREATE TABLE "Category" (
    "category_id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "subcategory_id" TEXT NOT NULL,
    "subcategory_name" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("subcategory_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "overallRating" TEXT,
    "subcategory_id" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "ProductVariation" (
    "productVariation_id" TEXT NOT NULL,
    "productVariation_image" TEXT NOT NULL,
    "productVariation_price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "shipping_charges" TEXT NOT NULL,
    "delivery_details" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "ProductVariation_pkey" PRIMARY KEY ("productVariation_id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_id" TEXT NOT NULL,
    "reviewer" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_id_key" ON "Category"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_subcategory_id_key" ON "Subcategory"("subcategory_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_id_key" ON "Product"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariation_productVariation_id_key" ON "ProductVariation"("productVariation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_review_id_key" ON "Review"("review_id");

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "Subcategory"("subcategory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
