const Razorpay = require("razorpay");
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
const prisma = require("../prisma");
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: "rzp_test_qUePsQvwKUdYCu",
    key_secret: "zncIffQV4BBNSDBpfS2IKBy7",
});

const postProductOrder = async (req, res) => {
    try {
        const data = req.body;

        const order = await razorpay.orders.create({
            amount: data.totalPrice * 100, // Amount in paise
            currency: "INR",
        });

        // Store temporary order details
        await prisma.temporaryOrder.create({
            data: {
                order_id: order.id,
                subcategoryName: data.subcategoryName,
                productName: data.productName,
                size: data.size,
                price: data.price,
                shipping_charges: data.shipping_charges,
                totalPrice: (data.totalPrice / 100).toString(),
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                adress1: data.adress1,
                address2: data.address2,
                landmark: data.landmark,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Route to verify payment
const postProductVerify = async (req, res) => {
    try {
        const data = req.body;
        const secret = process.env.KEY_SECRET;

        const isVerified = validatePaymentVerification(
            { order_id: data.razorpayOrderId, payment_id: data.razorpayPaymentId },
            data.signature,
            secret
        );

        if (isVerified) {
            const orderDetails = await prisma.temporaryOrder.findUnique({
                where: { order_id: data.razorpayOrderId },
            });

            if (!orderDetails) {
                return res.status(400).json({ error: "Temporary order not found" });
            }

            // Move to permanent order and clean up temporary order
            await prisma.permanentOrder.create({
                data: {
                    order_id: orderDetails.order_id,
                    subcategoryName: orderDetails.subcategoryName,
                    payment_id: data.razorpayPaymentId,
                    name: orderDetails.name,
                    email: orderDetails.email,
                    phoneNumber: orderDetails.phoneNumber,
                    adress1: orderDetails.adress1,
                    address2: orderDetails.address2,
                    landmark: orderDetails.landmark,
                    city: orderDetails.city,
                    state: orderDetails.state,
                    pincode: orderDetails.pincode,
                    amount: orderDetails.totalPrice, // Assuming totalPrice is equivalent to amount
                    productName: orderDetails.productName,
                    size: orderDetails.size,
                    price: orderDetails.price,
                    shipping_charges: orderDetails.shipping_charges,
                    totalPrice: orderDetails.totalPrice,
                },
            });

            await prisma.temporaryOrder.delete({
                where: { order_id: data.razorpayOrderId },
            });

            res.status(200).json({ message: "Payment Verified" });
        } else {
            res.status(400).json({ error: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { postProductOrder, postProductVerify };
