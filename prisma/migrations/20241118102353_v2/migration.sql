-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_subcategory_id_fkey";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "Subcategory"("subcategory_id") ON DELETE CASCADE ON UPDATE CASCADE;
