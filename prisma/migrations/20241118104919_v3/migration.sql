-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_product_id_fkey";

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
