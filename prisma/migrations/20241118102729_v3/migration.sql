-- DropForeignKey
ALTER TABLE "ProductVariation" DROP CONSTRAINT "ProductVariation_product_id_fkey";

-- AddForeignKey
ALTER TABLE "ProductVariation" ADD CONSTRAINT "ProductVariation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
