const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

const prisma = require('../prisma')

const protectedRoute = require('./protectedRoute')

// function productedRoute(req, res, next) {
//     console.log(req.headers)
//     const data = req.headers["authorization"]
//     const token = data && data.split(' ')[1]
//     console.log(data)
//     console.log(token)
//     if (!token) {
//         res.status(403).json({
//             message: "No token"   
//         })
//     } else {
//         jwt.verify(token, 'saranya_project', function (err) {
//             if (err) {
//                 res.status(403).json({
//                     message: "Token Invalid"
//                 });

//             } else {
//                 next();
//             }
//         })

//     }
// }
// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",          // or another email service provider
    auth: {
        user:"webzspotcorp@gmail.com",
        pass:"ygwk worm kxlm awmh" // your email
        // pass: "uttpbpctuhcygdxk"   // your email password
    }
});

const authForgetPassword = async (req, res) => {
    const data = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });
    if (!user) return res.json({ message: "User not found" });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expiry time (e.g., 5 minutes)
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now


    // Save OTP and expiry time in the database
    await prisma.user.update({
        where: { 
            email:data.email
         },
         data: { 
            otp: otp,  // store generated OTP
            otpExpiry: otpExpiry // store OTP expiry time
        }
    });

    // Send OTP via email
    const mailOptions = {
        from: "sarancastle@gmail.com",
        to: data.email,
        subject: "Password Reset OTP",
        html: `<p>Your OTP for password reset is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) return res.json({ message: "Error sending email" });
        res.json({ message: "OTP sent to your email" });
    });
}

const authVerifyOtp = async (req, res) => {
    const data = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
        where: {
            email:data.email
        },
    });

    if (!user) return res.json({ message: "User not found" });
    console.log("Stored OTP:", user.otp);
    console.log("Provided OTP:", data.otp);
    // Check if OTP is valid and hasn't expired
    if (String(user.otp).trim() !== String(data.otp).trim()) {
        return res.json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
        return res.json({ message: "OTP has expired" });
    }

    // OTP is valid and not expired, now reset the password
    const hashedPassword = await bcrypt.hash( data.newPassword, 10);

    // Update the password in the database
    await prisma.user.update({
        where: { email:data.email },
        data: {
            password: hashedPassword,
            otp: null, // Clear OTP after use
            otpExpiry: null // Clear OTP expiry after use
        }
    });

    res.json({ message: "Password successfully reset" });
}



const authRegister = async (req, res) => {
    const data = req.body
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if (existingUser) {
        res.json({
            message: "Already a User"
        })
    } else {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const newUser = await prisma.user.create({
            data: {
                userName: data.userName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                password: hashedPassword
            }
        })
        res.json({
            data: newUser
        })
    }
}

// app.post("/login", async (req, res) => {
//     const data = req.body
//     const existingUser = await prisma.user.findUnique({
//         where: {
//             email: data.email
//         }
//     })
//     if (existingUser) {
//         const checkingPassword = await bcrypt.compare(data.password, existingUser.password)
//         if (checkingPassword) {

//             var accessToken = jwt.sign({ user_id: existingUser.user_id }, "saranya_project", {
//                 expiresIn: "30s"
//             })
//             var refreshToken = jwt.sign({ user_id: existingUser.user_id }, 'saranya_project', {
//                 expiresIn: "30s"
//             });

//             await prisma.token.create({
//                 data: {
//                     refreshToken: refreshToken
//                 }
//             })

//             res.json({
//                 message: `Welcome ${existingUser.userName}`,
//                 data: {
//                     refreshToken,
//                     accessToken
//                 }
//             })
//         } else {
//             res.json({
//                 message: "Invalid User & Password"
//             })
//         }
//     } else {
//         res.json({
//             message: "Not a User, Register and try Agian"
//         })
//     }
// })
const authLogin = async (req, res) => {
    const data = req.body;
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });
    
    // If user exists
    if (existingUser) {
        const checkingPassword = await bcrypt.compare(data.password, existingUser.password);
        
        // If password is correct
        if (checkingPassword) {
            var accessToken = jwt.sign({ user_id: existingUser.user_id }, "saranya_project", {
                expiresIn: "60s"
            });
            var refreshToken = jwt.sign({ user_id: existingUser.user_id }, 'saranya_project', {
                expiresIn: "1h"
            });

            await prisma.token.create({
                data: {
                    refreshToken: refreshToken
                }
            });

            // Send a welcome email upon successful login
            const mailOptions = {
                from: "webzspotcorp@gmail.com",
                to: existingUser.email,
                subject: "Welcome to Our Platform",
                html: `<p>Hi ${existingUser.userName},<br>Welcome back to our platform! We are happy to have you.</p>`
            };

            transporter.sendMail(mailOptions, (err) => {
                console.log(err)
                if (err) {
                    console.error("Error sending welcome email:",err);
                } else {
                    console.log("Welcome email sent to:", existingUser.email);
                }
            });

            res.json({
                message: `Welcome ${existingUser.userName}`,
                data: {
                    refreshToken,
                    accessToken
                }
            });

        } else {
            // Send an alert email upon invalid login attempt
            const mailOptions = {
                from: "sarancastle@gmail.com",
                to: existingUser.email,
                subject: "Invalid Login Attempt Alert",
                html: `<p>Hi ${existingUser.userName},<br>We noticed a failed login attempt to your account. If this wasn't you, please secure your account immediately.</p>`
            };

            transporter.sendMail(mailOptions, (err) => {
                if (err) {
                    console.error("Error sending alert email:", err);
                } else {
                    console.log("Alert email sent to:", existingUser.email);
                }
            });

            res.json({
                message: "Invalid User & Password"
            });
        }

    } else {
        res.json({
            message: "Not a User, Register and try Again"
        });
    }
}


const authRefresh = async (req, res) => {
    const data = req.body

    const tokenValid = await prisma.token.findFirst({
        where: {
            refreshToken: data.refreshToken
        }
    })

    if (tokenValid) {
        jwt.verify(tokenValid.refreshToken, 'saranya_project', function (err) {
            if (!err) {
                var accessToken = jwt.sign({ user_id: tokenValid.user_id }, "saranya_project", {
                    expiresIn: "60s"
                })
                res.json({
                    accessToken: accessToken
                })
            } else {
                res.json({
                    message: "User Not Authenticated"
                })
            }

        });
    } else {
        res.json({
            message: 'No token found'
        })
    }


}

module.exports = {authRefresh,authLogin,authForgetPassword,authRegister,authVerifyOtp,}

