const Razorpay = require("razorpay");
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
const prisma = require("../prisma")
require('dotenv').config();

// const keyId = process.env.KEY_ID;
// const keySecret = process.env.KEY_SECRET;
// console.log(`Key ID: ${keyId}`);
// console.log(`Key Secret: ${keySecret}`);
// const razorpay = new Razorpay({
//     key_id: "rzp_test_qUePsQvwKUdYCu",
//     key_secret: "zncIffQV4BBNSDBpfS2IKBy7",
//   });
const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

const postSessionOrder = async (req, res) => {
    try {
        const data = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in paise
            currency: "INR",
        });

        // Store temporary order details
        await prisma.temporaryOrder.create({
            data: {
                order_id: order.id,
                subcategoryName: data.subcategoryName,
                productName:data.productName,
                size:data.size,
                price:data.price,
                shipping_charges:data.shipping_charges,
                totalPrice:(totalPrice / 100).toString(),
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                adress1: data.adress1,
                address2: data.address2,
                landmark: data.landmark,
                city: data.city,
                state: data.state,
                pincode: data.pincode      
            },
        });

        res.status(200).json({ order });
    } catch (error) {
        try {
            console.error("Error creating order:", error);
            res.status(500).json({ error: "Internal server error" });
        } catch (catchError) {
            console.error("Error handling the create order error:", catchError);
            res.status(500).json({ error: "Critical error occurred" });
        }
    }
};

// Route to verify payment
const postSessionVerify =  async (req, res) => {
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
                where: { order_id: razorpayOrderId },
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
                    amount: orderDetails.amount,
                    productName:orderDetails.productName,
                    size:orderDetails.size,
                    price:orderDetails.price,
                    shipping_charges:orderDetails.shipping_charges,
                    totalPrice:orderDetails.totalPrice 
                }   
        
            });

            await prisma.temporaryOrder.delete({
                where: { order_id: data.razorpayOrderId },
            });

            res.status(200).json({ message: "Payment Verified" });
        } else {
            res.status(400).json({ error: "Payment verification failed" });
        }
    } catch (error) {
        try {
            console.error("Error verifying payment:", error);
            res.status(500).json({ error: "Internal server error" });
        } catch (catchError) {
            console.error("Error handling the verification error:", catchError);
            res.status(500).json({ error: "Critical error occurred" });
        }
    }
};

module.exports = {postSessionOrder,postSessionVerify}