const express = require('express')
const router = express.Router()
const upload = require('./multer')
const { postCategory, postSubCategory, postProduct, getAllProduct, deleteProductById,
    getProductById, getCategory, getSubCategory, getSubCategoryByCategoryId,
    getProductBySubCategoryId, postReview, getReviewByProductId,
    updateReviewApproveById, deleteSubcategoryById, deleteProductVariationById,
    postProductVariations, getProductVariations,
} = require("./controller")
const { postSession, getSession, postSessionDescription, getSessionById, postReviewSession, getReviewSession, updateReviewSession,
    sessionDelete, sessionUpdate } = require("../src/Session-package/session")
const productedRoute = require('./Authentication/protectedRoute')
const { authRefresh, authLogin, authRegister, authForgetPassword, authVerifyOtp } = require('./Authentication/authentication')


router.post("/category", postCategory);

router.post("/subcategory", postSubCategory);

router.post("/product", postProduct);

router.post("/review", postReview);

router.put("/review/approve/:id", updateReviewApproveById);

router.post('/product-variations', upload.single("file"), postProductVariations);

router.get('/product-variations', getProductVariations);

router.delete('/product-variations/:id', deleteProductVariationById);

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

router.get('/review/:product_id', getReviewByProductId);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.post('/session', postSession)
router.get('/session', getSession)
router.post('/session-description', postSessionDescription)
router.get('/session/:id', getSessionById)

// POST route to create a review
router.post('/reviewsessions', postReviewSession);

// GET route to fetch reviews for a session
router.get('/reviewsessions', getReviewSession);

// PUT route to update a review (approve/edit review)
router.put('/reviewsessions/:reviewSessionId', updateReviewSession);

router.delete('/session/:id', sessionDelete)

router.put('/session/:id', sessionUpdate)

router.post('/refresh', authRefresh)
router.post('/login', authLogin)
router.post('/register', authRegister)
router.post('/forgot-password', authForgetPassword)
router.post('/verify-otp', authVerifyOtp)



module.exports = router