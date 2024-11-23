-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_category_id_fkey";

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;
