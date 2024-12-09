const prisma = require('./prisma')

const postCategory = async (req, res) => {
    try {
        const data = req.body;
        const AddCategory = await prisma.category.create({
            data: {
                category_name: data.category_name,
            },
        });

        res.json({
            message: "Category Card Added Successfully",
            data: AddCategory,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: "Error adding category",
            error: error.message,
        });
    }
}

const postSubCategory = async (req, res) => {
    try {
        const data = req.body;
        const AddSubcategory = await prisma.subcategory.create({
            data: {
                subcategory_name: data.subcategory_name,
                category_id: data.category_id,
            },
        });

        res.json({
            message: "Subcategory Added Successfully",
            data: AddSubcategory,
        });
    } catch (error) {

        console.error(error);
        res.json({
            message: "Error adding subcategory",
            error: error.message,
        });
    }
}

const postProduct = async (req, res) => {
    try {
        const data = req.body;
        const AddProduct = await prisma.product.create({
            data: {
                product_name: data.product_name,
                subcategory_id: data.subcategory_id
            }
        });
        res.json({
            message: "Product Card Added",
            data: AddProduct
        });
    } catch (error) {
        res.json({
            message: "An error occurred while adding the product.",
            error: error.message
        });
    }
}

const getAllProduct = async (req, res) => {
    try {
        const allproduct = await prisma.product.findMany({
            include: {
                productVariation: {
                    take: 1,
                    select: {
                        productVariation_image: true,
                        productVariation_price: true,
                        shipping_charges: true,
                        delivery_details: true,
                        description: true,
                        theme: true,
                    }
                }
            }
        });
        res.json({
            data: allproduct
        });
    } catch (error) {
        res.json({
            message: "An error occurred while fetching the products.",
            error: error.message
        });
    }
}

const deleteProductById = async (req, res) => {
    const productId = req.params.id;

    try {
        // Delete the product, which will also delete the associated Productdescription
        const deletedProduct = await prisma.product.delete({
            where: { product_id: productId }
        });

        res.json({
            message: "Product and associated description deleted successfully",
            data: deletedProduct
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.json({
            message: "An error occurred while deleting the product",
            error: error.message
        });
    }
}

const deleteReviewById = async (req, res) => {
    const reviewId = req.params.id;  // Assuming you are passing the review ID in the request

    try {
        // Delete the review by its ID
        const deletedReview = await prisma.review.delete({
            where: { review_id: reviewId }
        });

        res.json({
            message: "Review deleted successfully",
            data: deletedReview
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.json({
            message: "An error occurred while deleting the review",
            error: error.message
        });
    }
};


const deleteSubcategoryById = async (req, res) => {
    const subcategoryId = req.params.id;

    try {
        // Delete the product, which will also delete the associated Productdescription
        const deletedProduct = await prisma.subcategory.delete({
            where: { subcategory_id: subcategoryId }
        });

        res.json({
            message: "Product and associated description deleted successfully",
            data: deletedProduct
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.json({
            message: "An error occurred while deleting the product",
            error: error.message
        });
    }
}

const deleteProductVariationById = async (req, res) => {
    const productVariationId = req.params.id;

    try {
        // Delete the product, which will also delete the associated Productdescription
        const deletedProductVariationById = await prisma.productVariation.delete({
            where: { productVariation_id: productVariationId }
        });

        res.json({
            message: "Product and associated description deleted successfully",
            data: deletedProductVariationById
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.json({
            message: "An error occurred while deleting the product",
            error: error.message
        });
    }
}

const getProductById = async (req, res) => {
    try {
        const data = req.params;
        console.log(data);

        const paticularproduct = await prisma.product.findUnique({
            where: {
                product_id: data.id
            },
            include: {
                productVariation: true,
                review: {
                    where: { isApproved: true }
                }
            }
        });
        console.log(paticularproduct);

        const similarProducts = await prisma.product.findMany({
            where: {
                subcategory_id: paticularproduct.subcategory_id,
                product_id: {
                    not: paticularproduct.product_id
                }
            },
            include: {
                productVariation: {
                    take: 1,
                    select: {
                        productVariation_image: true,
                        productVariation_price: true,
                        shipping_charges: true,
                        delivery_details: true,
                        description: true,
                        theme: true
                    }
                }
            }
        });
        console.log(similarProducts);

        const shuffledProducts = similarProducts.sort(() => Math.random() - 0.5);
        const fourRandomProducts = shuffledProducts.slice(0, 3);

        res.json({
            data: {
                paticularproduct,
                fourRandomProducts
            }
        });
    } catch (error) {
        res.json({
            message: "An error occurred while fetching the product details.",
            error: error.message
        });
    }
}

const getCategory = async (req, res) => {
    try {
        const category = await prisma.category.findMany();
        res.json({ data: category });
    } catch (error) {
        res.json({
            message: "An error occurred while fetching the categories.",
            error: error.message
        });
    }
}

const getSubCategory = async (req, res) => {
    try {
        const subcategory = await prisma.subcategory.findMany();
        res.json({ data: subcategory });
    } catch (error) {
        res.json({
            message: "An error occurred while fetching the subcategories.",
            error: error.message
        });
    }
}

const getSubCategoryByCategoryId = async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const subcategory = await prisma.subcategory.findMany({
            where: { category_id: categoryId },
        });
        res.json({ data: subcategory });
    } catch (error) {
        res.json({ message: "Error fetching subcategories", error: error.message });
    }
}

const getProductBySubCategoryId = async (req, res) => {
    const subcategoryId = req.params.subcategoryId;

    try {
        const products = await prisma.product.findMany({
            where: { subcategory_id: subcategoryId },
        });
        res.json({ data: products });
    } catch (error) {
        res.json({ message: "Error fetching products", error: error.message });
    }
}

const postReview = async (req, res) => {
    const data = req.body;

    try {
        const newReview = await prisma.review.create({
            data: {
                reviewer: data.reviewer,
                rating: data.rating,
                comment: data.comment,
                product_id: data.product_id,
                isApproved: false  // Default to not approved
            }
        });

        res.json({ message: "Review submitted for approval", review: newReview });
    } catch (error) {
        console.error("Error posting review:", error);
        res.json({ error: "Unable to post review", details: error.message });
    }
}

const getReviewByProductId = async (req, res) => {
    const { product_id } = req.params;

    try {
        const reviews = await prisma.review.findMany({
            where: { product_id },
            include: {
                product: {
                    select: {
                        product_name: true,
                    },
                },
            },
        });
        res.json(reviews);
    } catch (error) {
        res.json({ error: 'Unable to fetch reviews', details: error.message });
    }
}

const updateReviewApproveById = async (req, res) => {
    const { id } = req.params;

    try {
        // Step 1: Check if the review exists
        const existingReview = await prisma.review.findUnique({
            where: { review_id: id },
        });

        if (!existingReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        // Step 2: Approve the review
        const approvedReview = await prisma.review.update({
            where: { review_id: id },
            data: { isApproved: true }, // Ensure this matches your model
        });

        // Step 3: Retrieve all approved reviews for the product
        const reviews = await prisma.review.findMany({
            where: {
                product_id: approvedReview.product_id,
                isApproved: true, // Matches the `isApproved` field in your model
            },
            select: {
                rating: true, // Only fetch the `rating` field
            },
        });

        // Step 4: Calculate the average rating
        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;

        // Step 5: Update the product's overall rating
        const updatedProduct = await prisma.product.update({
            where: { product_id: approvedReview.product_id },
            data: { overallRating: averageRating.toString() },
        });

        res.json({
            message: "Review approved and overall rating updated",
            review: approvedReview,
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error approving review and updating overall rating:", error);
        res
            .status(500)
            .json({ error: "Unable to approve review and update overall rating", details: error.message });
    }
}

const postProductVariations = async (req, res) => {
    const data = req.body;
    // console.log(data);
    // console.log(req.file.location); // This should log the file URL from S3

    try {
        const productVariation = await prisma.productVariation.create({
            data: {
                productVariation_image: req.file.location, // This should be where the image URL is saved
                productVariation_price: data.productVariation_price, // Assuming price is from the form data
                description: data.description,
                theme: data.theme,
                size: data.size,
                shipping_charges: data.shipping_charges,
                delivery_details: data.delivery_details,
                about: data.about,
                requirements1: data.requirements1,
                requirements2: data.requirements2,
                requirements3: data.requirements3,
                product_id: data.product_id
            },
        });
        console.log(productVariation);
        res.json(productVariation);
    } catch (error) {
        res.status(400).json({ error: "Could not create product variation", details: error.message });
    }
};

const getProductVariations = async (req, res) => {
    try {
        const productVariation = await prisma.productVariation.findMany();
        res.json(productVariation);
    } catch (error) {
        res.status(400).json({ error: "Could not create product variation", details: error.message });
    }
};

const getReview = async(req,res) =>{
    try {
        const review = await prisma.review.findMany();
        res.json(review);
    } catch (error) {
        res.status(400).json({ error: "Could not create product variation", details: error.message });
    }
}






module.exports = {
    postCategory, postSubCategory, deleteSubcategoryById,
    postProduct, getAllProduct, deleteProductById, deleteProductVariationById,
    getProductById, getCategory, getSubCategory,
    getSubCategoryByCategoryId, getProductBySubCategoryId,
    postReview, getReviewByProductId, updateReviewApproveById, postProductVariations, getProductVariations,getReview
    ,deleteReviewById
}