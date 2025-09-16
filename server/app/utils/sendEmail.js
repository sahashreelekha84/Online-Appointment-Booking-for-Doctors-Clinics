const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configure transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.my_email,
        pass: process.env.my_password
    }
});
       
// OTP generator
const generateotp = () => crypto.randomInt(100000, 999999).toString();

// Email sender
const sendEmail = async ({ to, name, otp }) => {
    try {
        await transporter.sendMail({
            from: process.env.my_email,
            to,
            subject: 'OTP Verification',
            text: `Your OTP is: ${otp}`,
            html: `
                <p>Dear ${name},</p>
                <p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP):</p>
                <h2>OTP: ${otp}</h2>
                <p>This OTP is valid for 10 minutes. If you didn't request this OTP, please ignore this email.</p>
            `
        });
    } catch (err) {
        console.error(`Failed to send email to ${to}:`, err.message);
    }
};

module.exports = { sendEmail, generateotp,transporter };
