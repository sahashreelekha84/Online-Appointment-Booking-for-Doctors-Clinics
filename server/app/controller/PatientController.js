const { hashedpassword, comparepassword } = require("../middleware/AuthCheck")
const {userModel, userschemaValidate} = require("../model/usermodel")
const Jwt = require('jsonwebtoken')
const path = require('path')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.my_email,
        pass: process.env.my_password
    }
})
const generateotp = () => crypto.randomInt(100000, 999999).toString()
class PatientController {
    async register(req, res) {
        console.log(req.body);
        
        try {
            const { name, email, password, address, gender, dob, phone,role,otp,otpExpiry } = req.body
            const existemail = await userModel.findOne({ email })
            if (existemail) {
                return res.status(403).json({
                    status: false,
                    message: 'email already exist',

                })
            }
            const hash = await hashedpassword(password)
            const pdata = new userModel({
                name, email, password: hash, address, gender, dob, phone, role,otp,otpExpiry
            })
            if (req.file) {
                pdata.profileImg = req.file.path
            }
            const { error, value } = userschemaValidate.validate(pdata)
            if (error) {
                return res.send(error.message)
            } else {
            const data = await pdata.save(value)
             await transporter.sendMail({
                from: 'shreelekhasaha2000@gmail.com',
                to: email,
                subject: 'OTP Verification',

                text: `Your OTP is: ${otp}`,
                html: `<p>Dear ${data.name},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
                       <h2>OTP: ${otp}</h2>
                       <p>This OTP is valid for 10 minutes. If you didn't request this OTP, please ignore this email.</p>`
            })
            res.status(201).json({
                status: true,
                message: 'Registation Successfully',
                data: data

            })
        } 
    }catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,

            })
        }
    }
    async verifyotp(req, res) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ message: 'Email and OTP are required' });
            }

            const user = await userModel.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            
            if (user.isVerified) {
                return res.status(400).json({ message: 'User already verified' });
            }

            if (String(user.otp) !== String(otp)) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            if (user.otpExpiry < new Date()) {
                return res.status(400).json({ message: 'OTP has expired' });
            }

            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiry = undefined;

            await user.save();

            return res.status(200).json({ message: 'User verified successfully' });

        } catch (error) {
            console.error('Verify OTP error:', error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }



    async resendotp(req, res) {
        try {
            const { email } = req.body
            const user = await userModel.findOne({ email })
            if (!user)
                return res.status(400).json({
                    message: 'User not found'
                })
            if (user.isVerified)
                return res.status(400).json({
                    message: 'User already verified'
                })

            const otp = generateotp()
            user.otp = otp
            user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
            console.log("Expires at:", user.otpExpiry.toString());
            await user.save()
            await transporter.sendMail({
                from: 'shreelekhasaha2000@gmail.com',
                to: email,
                subject: 'Resend OTP Verification',
                text: `Your new OTP is: ${otp}`,
                html: `<p>Dear ${user.name},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
                       <h2>OTP: ${otp}</h2>
                       <p>This OTP is valid for 10 minutes. If you didn't request this OTP, please ignore this email.</p>`

            })
            return res.status(200).json({
                message: 'OTP resent successfully.'
            })
        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message,
            });
        }

    }
    async login(req, res) {
        try {
            console.log(req.body);
            
            const { email, password } = req.body
            const user = await userModel.findOne({ email })
            if (!user) {
                res.status(400).json({
                    status: false,
                    message: 'user not found',

                })
            }
            const ismatch = comparepassword(password, user.password)
            if (!ismatch) {
                res.status(400).json({
                    status: false,
                    message: 'Invalid Password',

                })
            }
            const token = Jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRECT_KEY, { expiresIn: "2h" })
            return res.status(200).json({
                status: true,
                message: 'Patient login successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,



                },
                token: token
            })
        }
        catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,

            })
        }
    }
    async dashboard(req, res) {
        try {
            res.status(200).json({
                status: true,
                message: 'Welcome To Patient Dashboard',
                data:req.user
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
     async profile(req, res) {
        try {
            res.status(200).json({
                status: true,
                message: 'Patient Profile Fetched Successfully',
                data:req.user
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
}
module.exports = new PatientController()