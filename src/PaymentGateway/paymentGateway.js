const Razorpay = require("razorpay");
const prisma = require('../prisma')
const crypto = require('crypto');
const cron = require("node-cron");
const nodemailer = require('nodemailer');



// Razorpay instance
const razorpay = new Razorpay({
    key_id: "rzp_test_qUePsQvwKUdYCu",
    key_secret: "zncIffQV4BBNSDBpfS2IKBy7",
});

const postProductOrder = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
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
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        // Store temporary order details in the database
        await prisma.temporaryOrder.create({
            data: {
                order_id: order.id,
                subcategoryName: data.subcategoryName,
                productName: data.productName,
                size: data.size,
                price: data.price,
                kit_info: data.kit_info,
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
                session_id: data.session_id,
                kit_info: data.kit_info,
                date: data.date,
                time: data.time,
                price: (order.amount / 100).toString(),
                name: data.name,
                session_mode: data.session_mode,
                email: data.email,
                phoneNumber: data.phoneNumber,
                address1: data.address1,
                address2: data.address2,
                landmark: data.landmark,
                platform: data.platform,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                photo: fileUrls
            },
        });
        console.log("Temporary session order created:", order.id);

        res.status(200).json({
            message: "Payment Successfull",
            order,
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const postCourse = async (req, res) => {
    const data = req.body;
    const addCourse = await prisma.Course.create({
        data: {
            course_name: data.course_name,
            group_link: data.group_link,
            session_id: data.session_id
        }
    })
    res.status(200).json({
        addCourse
    })
}
const getCourse = async (req, res) => {
    const addCourse = await prisma.Course.findMany()
    res.status(200).json({
        addCourse
    })
}


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
                            status: "Order Placed",
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
                            payment_id: paymentId,
                            sessionName: sessionDetails.sessionName,
                            session_id: sessionDetails.session_id,
                            kit_info: sessionDetails.kit_info,
                            session_mode: sessionDetails.session_mode,
                            date: sessionDetails.date,
                            time: sessionDetails.time,
                            price: sessionDetails.price,
                            name: sessionDetails.name,
                            email: sessionDetails.email,
                            phoneNumber: sessionDetails.phoneNumber,
                            address1: sessionDetails.address1,
                            address2: sessionDetails.address2,
                            landmark: sessionDetails.landmark,
                            platform: sessionDetails.platform,
                            city: sessionDetails.city,
                            state: sessionDetails.state,
                            pincode: sessionDetails.pincode,
                            photo: sessionDetails.photo
                        },
                    });



                    await prisma.temporarySessionOrder.delete({
                        where: { order_id: orderId },
                    });

                }

                console.log(`Payment captured and processed for order_id: ${orderId}`);
                return res.status(200).json({
                    message: "Payment Successfull",
                });
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

const updateMyOrders = async (req, res) => {
    try {
        const data = req.body;
        
        // Validate required fields
        if (!data.payment_id || !data.status) {
            return res.status(400).json({
                message: "Payment ID and status are required."
            });
        }

        const update = await prisma.permanentOrder.update({
            where: {
                payment_id: data.payment_id
            },
            data: {
                status: data.status
            }
        });

        res.json({
            update,
            message: "Your Status Is Updated Successfully"
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            message: "An error occurred while updating the order status.",
            error: error.message
        });
    }
};


const link = async (req, res) => {
    const data = req.body;

    try {
        // Fetch the data from the database
        const sessionOrder = await prisma.permanentSessionOrder.findUnique({
            where: {
                payment_id: data.payment_id
            },
            include: {
                session: {
                    include: {
                        course: {
                            select: {
                                group_link: true // Include the group_link from the associated course
                            }
                        }
                    }

                }
            }
        });

        if (!sessionOrder) {
            return res.status(404).json({
                message: "Session order not found"
            });
        }

        // Extract the group_link
        const groupLink = sessionOrder.session.course.group_link;
        const recipientEmail = sessionOrder.email;

        if (!recipientEmail) {
            return res.status(400).json({
                message: "Recipient email address not found"
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service provider
            auth: {
                user: 'sarancastle@gmail.com', // Replace with your email
                pass: 'hfnn pnlv xnva idbd' // Replace with your email password or app password
            }
        });

        const mailOptions = {
            from: 'sarancastle@gmail.com', // Replace with your email
            to: recipientEmail, // The recipient's email
            subject: 'Your Class WhatsApp Group Link and Information',
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h2 style="color: #007BFF; text-align: center; margin-bottom: 20px;">Welcome to Your Class Group</h2>
              <p>Dear Student,</p>
              <p>We are delighted to have you as part of our class. To ensure seamless communication and timely updates, we have created a dedicated WhatsApp group. This group will serve as the central hub for sharing:</p>
              <ul style="padding-left: 20px; margin-bottom: 20px;">
                <li><strong>Meeting links</strong> for online classes</li>
                <li><strong>Important announcements</strong> and updates</li>
                <li><strong>Additional resources</strong> for both online and offline sessions</li>
              </ul>
              <p>We highly recommend you join the group using the link below:</p>
              <p style="text-align: center; margin: 20px 0;">
                <a href="${groupLink}" style="background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Join WhatsApp Group</a>
              </p>
              <p>If you encounter any issues or have any questions, please feel free to contact us at any time. Our team is here to assist you.</p>
              <p style="margin-top: 20px;">Thank you for choosing us. We look forward to supporting you in your learning journey.</p>
              <p>Best regards,</p>
              <p><strong>Saran Castle Team</strong></p>
              <div style="margin-top: 30px; font-size: 12px; color: #555; border-top: 1px solid #ddd; padding-top: 10px;">
                <p style="text-align: center;">This email was sent to you by Saran Castle Team. Please do not reply directly to this email. For assistance, contact us at <a href="mailto:sarancastle@gmail.com" style="color: #007BFF;">sarancastle@gmail.com.com</a>.</p>
              </div>/
            </div>
          `


        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Link Shared Successfully",
            groupLink: groupLink // Send the group link in the response
        });
    } catch (error) {
        console.error("Error fetching session order:", error);
        res.status(500).json({
            message: "An error occurred while fetching the session order",
            error: error.message
        });
    }
};



const getProductOrder = async (req, res) => {
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


const getSessionOrder = async (req, res) => {
    const sessionOrders = await prisma.permanentSessionOrder.findMany()
    res.status(200).json({
        sessionOrders
    })
}
module.exports = { postProductOrder, postSessionOrder, razorpayWebhook, getProductOrder, getProductOrderById, getSessionOrder, getSessionOrderById, postCourse, getCourse, link , updateMyOrders}
