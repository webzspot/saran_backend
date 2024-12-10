const express = require('express')
const router = express.Router()
const upload = require('./multer')
const { postCategory, postSubCategory, postProduct, getAllProduct, deleteProductById,
    getProductById, getCategory, getSubCategory, getSubCategoryByCategoryId,
    getProductBySubCategoryId, postReview, getReviewByProductId,
    updateReviewApproveById, deleteSubcategoryById, deleteProductVariationById,
    postProductVariations, getProductVariations,
    getReview,deleteReviewById,
} = require("./controller")
const { postSession, getSession, postSessionDescription, getSessionById, postReviewSession, getReviewSession, updateReviewSession,
    deleteReviewSession,sessionDelete, sessionUpdate } = require("../src/Session-package/session")
const protectedRoute = require('./Authentication/protectedRoute')
const { authRefresh, authLogin, authRegister, authForgetPassword, authVerifyOtp } = require('./Authentication/authentication')
const {postProductOrder,postSessionOrder,razorpayWebhook} = require('./PaymentGateway/paymentGateway')
const {postContact} = require('./Contact/contact')




router.post("/category", postCategory);

router.post("/subcategory", postSubCategory);

router.post("/product", postProduct);

router.post("/review", postReview);

router.put("/review/:id", updateReviewApproveById);

router.post('/product-variations', upload.single('productVariation_image'), postProductVariations);

router.get('/product-variations',  getProductVariations);

router.delete('/product-variations/:id',deleteProductVariationById);

router.delete("/product/:id",deleteProductById);

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
router.get('/review', getReview);
router.delete('/review/:id', deleteReviewById);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.post('/session',upload.single('session_image'), postSession)
router.get('/session', getSession)
router.post('/session-description', postSessionDescription)
router.get('/session/:id', getSessionById)

// POST route to create a review
router.post('/reviewsessions', postReviewSession);

// GET route to fetch reviews for a session
router.get('/reviewsessions', getReviewSession);

// PUT route to update a review (approve/edit review)
router.put('/reviewsessions/:reviewSessionId', updateReviewSession);
router.delete('/reviewsessions/:reviewSessionId', deleteReviewSession);

router.delete('/session/:id', sessionDelete)

router.put('/session/:id', upload.single("file"),sessionUpdate)

router.post('/refresh', authRefresh)
router.post('/login', authLogin)
router.post('/register', authRegister)
router.post('/forgot-password', authForgetPassword)
router.post('/verify-otp', authVerifyOtp)



// payment route for product

// router.post("/order-product",upload.array('photo', 8),postProductOrder)
// router.post("/verify-product",postProductVerify)

// router.post("/order-session",postSessionOrder)
// router.post("/verify-session",postSessionVerify)

router.post('/order',upload.array('photos', 10),postProductOrder)
router.post('/session',upload.array("photos", 14),postSessionOrder)
router.post('/razorpay-webhook',razorpayWebhook)
router.post('/contact',postContact)





module.exports = router