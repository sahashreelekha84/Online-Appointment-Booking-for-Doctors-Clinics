const { doctorModel, passwordSchema } = require("../model/doctormodel");
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const Role = require("../model/role");
const { comparepassword, hashedpassword } = require("../middleware/AuthCheck");
const Jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

class DoctorController {

    async getAllDoctors(req, res) {
        try {
            const doctors = await doctorModel.find();
            // const doctors = await Role.findOne({ name: 'doctor' });
            res.status(200).json({
                status: true,
                message: "All Docters fetched Successfully",
                total: doctors.length,
                data: doctors
            })
        }
        catch (error) {
            res.status(500).json({
                status: true,
                message: error.message,

            })
        }


    };
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user =

                (await doctorModel.findOne({ email }));

            if (!user) return res.status(400).json({ message: "Invalid credentials" });

            const isMatch = await comparepassword(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            const role = await Role.findById(user.roleId);

            const payload = {
                name: user.name,
                id: user._id,
                email: user.email,
                roleId: user.roleId,
                roleName: role?.name,
                permissions: role?.permissions || [],
                firstLogin: user.firstLogin || false,
            };

            const token = Jwt.sign(payload, process.env.JWT_SECRECT_KEY, {
                expiresIn: user.firstLogin ? "15m" : "7d",
            });

            res.status(200).json({
                status: true,
                message: user.firstLogin
                    ? "OTP verified. Please set your password"
                    : "Login successful",
                user: {
                    name: user.name,
                    _id: user._id,
                    email: user.email,
                    roleId: user.roleId,
                    roleName: role?.name,
                    permissions: role?.permissions || [],
                },
                token,
                firstLogin: user.firstLogin,
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async setPassword(req, res) {
        try {
            const { password } = req.body;
            const userId = req.user.id;


            const { error } = passwordSchema.validate({ password });
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: error.details[0].message,
                });
            }

            let user = await doctorModel.findById(userId);

            if (!user) return res.status(404).json({ message: "User not found" });
            if (!user.firstLogin)
                return res.status(400).json({ message: "Password already set" });

            user.password = await hashedpassword(password);
            user.firstLogin = false;
            await user.save();

            res.json({
                status: true,
                message: "Password set successfully. You can now log in.",
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async updateDoctors(req, res) {
        try {
            const userId = req.user.id;
            const existdoctor = await doctorModel.findById(userId)
            if (!existdoctor) {
                res.status(400).json({
                    status: false,
                    message: "Docters not found ",

                })
            }
            let updatedata = { ...req.body }
            if (req.file) {
                updatedata.profileImg = req.file.path
            }

            console.log("New image uploaded and path added:", req.file.path);
            const updatedoctors = await doctorModel.findByIdAndUpdate(userId, updatedata, {
                new: true,
            });
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const doctorResponse = updatedoctors.toObject();


            if (doctorResponse.profileImg) {
                doctorResponse.profileImg = `${baseUrl}/uploads/${doctorResponse.profileImg}`;
            }

            res.status(200).json({
                status: true,
                message: "Doctor profile updated successfully",
                data: doctorResponse,
            });
        }
        catch (error) {
            res.status(500).json({
                status: true,
                message: error.message,

            })
        }


    };
    async doctordashboard(req, res) {
        try {
            res.status(200).json({
                status: true,
                message: 'Welcome to Doctor dashboard ',
                data: req.user
            })
        }
        catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
    async doctorprofile(req, res) {
        try {
            res.status(200).json({
                status: true,
                message: 'Doctor profile Fetched Successfully',
                data: req.user
            })
        }
        catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
        }
    }
    async forgetpassword(req, res) {
        try {
            const { email } = req.body;

            if (!email) return res.status(400).json({ message: 'Email is required' });

            const user = await doctorModel.findOne({ email });
            if (!user) return res.status(404).json({ message: 'User not found' });
            const { error } = passwordSchema.validate({ password });
            if (error) {
                return res.status(400).json({
                    status: false,
                    message: error.details[0].message,
                });
            }
            const token = Jwt.sign(
                { _id: user._id, email: user.email },
                process.env.JWT_SECRECT_KEY,
                { expiresIn: '2h' }
            );

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.my_email,
                    pass: process.env.my_password,
                },
            });

            const resetUrl = `${process.env.Client_url}/resetpassword/${token}`;

            const mailOptions = {
                from: process.env.my_email,
                to: email,
                subject: 'Reset Your Password',
                html: `<p>Click the link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({
                status: true,
                token,
                message: 'Password reset link sent to your email'
            });
        } catch (error) {
            console.error('Forgot password error:', error.message);
            return res.status(500).json({ message: 'Server error' });
        }
    }
    async resetpassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;
            console.log(password);

            if (!token || !password) {
                return res.status(400).json({ message: 'Token and password required' });
            }

            const decoded = Jwt.verify(token, process.env.JWT_SECRECT_KEY);
            const user = await doctorModel.findOne({ email: decoded.email });

            if (!user) return res.status(404).json({ message: 'User not found' });

            const newHashedPassword = await hashedpassword(password);
            user.password = newHashedPassword;
            await user.save();

            return res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            console.error('Reset password error:', error.message);
            return res.status(400).json({ message: 'Invalid or expired token' });
        }


    }
    async logout(req, res) {
        try {
            return res.status(200).json({
                status: true,
                message: "Logged out successfully. Please remove the token from client side."
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }

}
module.exports = new DoctorController()