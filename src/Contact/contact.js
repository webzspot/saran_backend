
const nodemailer = require('nodemailer');


// POST route to handle contact form submission
const postContact = async (req, res) => {
    const { firstname, lastname, email, phone, address, message, selected } = req.body;

    // Nodemailer transport configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Replace with your email service (e.g., Gmail, Outlook)
        auth: {
            user: 'sarancastle.com', // Your email address
            pass: 'ygwk worm kxlm awmh', // Your email password (use App Password for Gmail)
        },
    });

    const mailOptions = {
        from: email,
        to: 'sarancastle@gmail.com', // The recipient's email
        subject: 'New Contact Request',
        html: `
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #333;">New Contact Request</h2>
                <hr style="border: 1px solid #ddd;">
                <div style="margin-bottom: 15px;">
                    <strong style="color: #333;">Name:</strong> <span style="color: #555;">${firstname} ${lastname}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #333;">Email:</strong> <span style="color: #555;">${email}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #333;">Phone:</strong> <span style="color: #555;">${phone}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #333;">Address:</strong> <span style="color: #555;">${address}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #333;">Requirement:</strong> <span style="color: #555;">${selected}</span>
                </div>
                <div style="margin-bottom: 15px;">
                    <strong style="color: #333;">Message:</strong>
                    <p style="color: #555; font-size: 14px; white-space: pre-wrap;">${message}</p>
                </div>
                <hr style="border: 1px solid #ddd;">
                <p style="text-align: center; color: #777; font-size: 12px;">
                    This email was sent automatically from the contact form on your website.
                </p>
            </div>
        </body>
        </html>
    `,
    };

    const thankYouMailOptions = {
        from: 'sarancastle@gmail.com', // Your email address
        to: email, // Send "Thank you" email to the user's email address
        subject: 'Thank You for Contacting Us!',
    html: `
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #333;">Thank You for Contacting Us!</h2>
                <hr style="border: 1px solid #ddd;">
                <p style="color: #555; font-size: 16px;">
                    <strong>Dear ${firstname} ${lastname} </strong>,
                </p>
                <p style="color: #555; font-size: 16px;">
                    Thank you for reaching out to us. We have received your message and will get back to you shortly.
                </p>
                <p style="color: #555; font-size: 16px;">
                    <strong>Best regards,</strong><br>
                    Saran Castle
                </p>
                <hr style="border: 1px solid #ddd;">
                <p style="text-align: center; color: #777; font-size: 12px;">
                    This is an automated response. Please do not reply to this email.
                </p>
            </div>
        </body>
        </html>
    `,
    };

    try {
        // Send the notification email to yourself
        await transporter.sendMail(mailOptions);

        // Send the "Thank You" email to the user
        await transporter.sendMail(thankYouMailOptions);

        console.log("Emails sent successfully");
        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send({ message: 'Failed to send email', error });
    }
};


module.exports ={postContact}