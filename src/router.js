const express = require('express')
const router = express.Router()
const {postCategory, postSubCategory, postProduct, getAllProduct, deleteProductById,
     getProductById, getCategory, getSubCategory, getSubCategoryByCategoryId,
     getProductBySubCategoryId, postReview, getReviewByProductId,
     updateReviewApproveById,deleteSubcategoryById,deleteProductVariationById,
     postProductVariations} = require("./controller")


router.post("/category", postCategory);
  
router.post("/subcategory", postSubCategory);
  
router.post("/product", postProduct);

router.post("/review",postReview);

router.put("/review/approve/:id",updateReviewApproveById );
  
router.post('/product-variations',postProductVariations );

router.delete('/product-variations/:id', deleteProductVariationById );

router.delete("/product/:id", deleteProductById);

router.delete("/subcategory/:id", deleteSubcategoryById);

router.get("/product", getAllProduct); 
  
router.get("/product/:id", getProductById);
  
router.get("/category", getCategory); 



  // Fetch subcategories based on selected category
router.get("/subcategory", getSubCategory);
  // Get all categories
  // Get subcategories based on category ID
router.get("/subcategory/:categoryId", getSubCategoryByCategoryId);
  // Get products based on subcategory ID
router.get("/paticularproduct/:subcategoryId", getProductBySubCategoryId);
  
router.get('/review/:product_id',getReviewByProductId);
  


module.exports = router