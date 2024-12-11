const Razorpay = require("razorpay");
const prisma = require('../prisma')
const crypto = require('crypto');
const cron = require("node-cron");



// Razorpay instance
const razorpay = new Razorpay({
    key_id: "rzp_test_qUePsQvwKUdYCu",
    key_secret: "zncIffQV4BBNSDBpfS2IKBy7",
});

const postProductOrder = async (req, res) => {
    try {
        const data = req.body;
        const files = req.files; // Handle multiple files if necessary
        const fileUrls = files.map(file => file.location); // Extract file URLs from S3

        console.log("Uploaded file URLs:", fileUrls);
        console.log("Order details:", data);

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: data.totalPrice * 100, // Amount in paise
            currency: "INR",
        });

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 50);

        // Store temporary order details in the database
        await prisma.temporaryOrder.create({
            data: {
                order_id: order.id,
                subcategoryName: data.subcategoryName,
                productName: data.productName,
                size: data.size,
                price: data.price,
                shipping_charges: data.shipping_charges,
                totalPrice: (order.amount / 100).toString(),
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                address1: data.address1,
                address2: data.address2,
                landmark: data.landmark,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                photo: fileUrls, // Join multiple file URLs as a comma-separated string
                expiresAt: expiresAt,
            },
        });

        res.status(200).json({ order });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


async function deleteExpiredOrders() {
    try {
        const now = new Date();
        const result = await prisma.temporaryOrder.deleteMany({
            where: {
                expiresAt: {
                    lte: now,
                },
            },
        });
        console.log(`${result.count} expired orders deleted successfully.`);
    } catch (error) {
        console.error("Error deleting expired orders:", error);
    }
}

// Schedule the task to delete expired orders every day at 10 PM IST
cron.schedule("30 16 * * *", () => {
    console.log("Running the scheduled task to delete expired orders...");
    deleteExpiredOrders();
});
//30 16



const postSessionOrder = async (req, res) => {
    try {
        const data = req.body;
        const files = req.files; // Handle multiple files if necessary
        const fileUrls = files.map(file => file.location); // Extract file URLs from S3

        console.log("Uploaded file URLs:", fileUrls);
        console.log("Order details:", data);

        const order = await razorpay.orders.create({
            amount: data.price * 100, // Amount in paise
            currency: "INR",
        });

        // Store temporary order details
        await prisma.temporarySessionOrder.create({
            data: {
                order_id: order.id,
                sessionName: data.sessionName,
                kit_info: data.kit_info,
                date: data.date,
                time: data.time,
                price: (order.amount / 100).toString(),
                name: data.name,
                email: data.email,
                phoneNumber: data.phoneNumber,
                address1: data.address1,
                address2: data.address2,
                landmark: data.landmark,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                photo: fileUrls
            },
        });
        console.log("Temporary session order created:", order.id);

        res.status(200).json({ 
            message:"Payment Successfull",
            order });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const razorpayWebhook = async (req, res) => {
    const webhookBody = req.rawBody; // Ensure rawBody middleware is in use
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = "zncIffQV4BBNSDBpfS2IKBy7";

    if (!webhookBody) {
        console.error('Webhook body is empty or undefined');
        return res.status(400).send('Invalid request body');
    }

    try {
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(webhookBody)
            .digest('hex');

        if (expectedSignature !== webhookSignature) {
            console.error('Invalid webhook signature');
            return res.status(400).send('Invalid webhook signature');
        }

        const event = JSON.parse(webhookBody);

        switch (event.event) {
            case 'payment.captured': {
                const paymentDetails = event.payload.payment.entity;
                const orderId = paymentDetails.order_id;
                const paymentId = paymentDetails.id;

                const orderDetails = await prisma.temporaryOrder.findUnique({
                    where: { order_id: orderId },
                });

                const sessionDetails = await prisma.temporarySessionOrder.findUnique({
                    where: { order_id: orderId },
                });

                if (!orderDetails && !sessionDetails) {
                    console.error(`No order or session found for order_id: ${orderId}`);
                    return res.status(404).json({ error: "Order or session not found" });
                }

                // Create permanent order
                if (orderDetails) {
                    await prisma.permanentOrder.create({
                        data: {
                            order_id: orderId,
                            payment_id: paymentId,
                            name: orderDetails.name,
                            phoneNumber: orderDetails.phoneNumber,
                            amount: orderDetails.amount,
                            subcategoryName: orderDetails.subcategoryName,
                            productName: orderDetails.productName,
                            size: orderDetails.size,
                            price: orderDetails.price,
                            shipping_charges: orderDetails.shipping_charges,
                            totalPrice: orderDetails.totalPrice,
                            name: orderDetails.name,
                            email: orderDetails.email,
                            phoneNumber: orderDetails.phoneNumber,
                            address1: orderDetails.address1,
                            address2: orderDetails.address2,
                            landmark: orderDetails.landmark,
                            city: orderDetails.city,
                            state: orderDetails.state,
                            pincode: orderDetails.pincode,
                            photo: orderDetails.photo
                        },
                    });
                    await prisma.temporaryOrder.delete({
                        where: { order_id: orderId },
                    });
                }

                if (sessionDetails) {
                    await prisma.permanentSessionOrder.create({
                        data: {
                            order_id: orderId,
                            payment_id:paymentId,
                            sessionName: sessionDetails.sessionName,
                            kit_info: sessionDetails.kit_info,
                            date: sessionDetails.date,
                            time: sessionDetails.time,
                            price: sessionDetails.price,
                            name: sessionDetails.name,
                            email: sessionDetails.email,
                            phoneNumber: sessionDetails.phoneNumber,
                            address1: sessionDetails.address1,
                            address2: sessionDetails.address2,
                            landmark: sessionDetails.landmark,
                            city: sessionDetails.city,
                            state: sessionDetails.state,
                            pincode: sessionDetails.pincode,
                            photo:sessionDetails.photo
                        },
                    });
                    await prisma.temporarySessionOrder.delete({
                        where: { order_id: orderId },
                    });
                }

                console.log(`Payment captured and processed for order_id: ${orderId}`);
                return res.status(200).json({ message: "Payment Successfull" });
            }

            case 'payment.failed': {
                console.log('Payment failed:', event.payload.payment.entity);
                return res.status(200).send('Payment failed event logged');
            }

            default: {
                console.log('Unhandled event:', event.event);
                return res.status(200).send('Unhandled event');
            }
        }
    } catch (error) {
        console.error('Webhook processing error:', error.message, error.stack);
        return res.status(500).send('Internal server error');
    }
};

const getProductOrder = async (req,res) =>{
    const productOrders = await prisma.permanentOrder.findMany()
    res.status(200).json({
        productOrders
    })
}

const getProductOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const productOrders = await prisma.permanentOrder.findUnique({
            where: {
                permanent_id: id, // Convert id to an integer if it's numeric
            },
        });

        if (!productOrders) {
            return res.status(404).json({
                message: "Product order not found",
            });
        }

        res.status(200).json({
            productOrders,
        });
    } catch (error) {
        console.error("Error fetching product order by ID:", error);
        res.status(500).json({
            message: "An error occurred while fetching the product order",
        });
    }
};
const getSessionOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const sessionOrders = await prisma.permanentSessionOrder.findUnique({
            where: {
                permanentSession_id: id, // Convert id to an integer if it's numeric
            },
        });

        if (!sessionOrders) {
            return res.status(404).json({
                message: "Session order not found",
            });
        }

        res.status(200).json({
            sessionOrders,
        });
    } catch (error) {
        console.error("Error fetching product order by ID:", error);
        res.status(500).json({
            message: "An error occurred while fetching the product order",
        });
    }
};


const getSessionOrder = async (req,res) =>{
    const sessionOrders = await prisma.permanentSessionOrder.findMany()
    res.status(200).json({
        sessionOrders
    })
}
module.exports = { postProductOrder, postSessionOrder, razorpayWebhook, getProductOrder,getProductOrderById ,getSessionOrder,getSessionOrderById  }
