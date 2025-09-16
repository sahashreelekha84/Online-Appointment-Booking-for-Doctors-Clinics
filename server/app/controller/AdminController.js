const doctorModel = require("../model/doctormodel");
const path = require('path')
const Role = require("../model/role");
const Specializationmodel = require("../model/specializationmodel");
const { userModel } = require("../model/usermodel");
class AdminController {
    async adminDoctorLogin(req, res) {
        try {
            const { email, password } = req.body;

            const user =
                (await userModel.findOne({ email })) ||
                (await doctorModel.findOne({ email }));

            if (!user) return res.status(400).json({ message: "Invalid credentials" });

            const isMatch = await comparepassword(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            const role = await Role.findById(user.roleId);

            const payload = {
                id: user._id,
                email: user.email,
                roleId: user.roleId,
                roleName: role?.name,
                permissions: role?.permissions || [],
                firstLogin: user.firstLogin || false,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRECT_KEY, {
                expiresIn: user.firstLogin ? "15m" : "7d",
            });

            res.status(200).json({
                status: true,
                message: user.firstLogin
                    ? "OTP verified. Please set your password"
                    : "Login successful",
                user: {
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

            let user =
                (await Admin.findById(userId)) ||
                (await Doctor.findById(userId));

            if (!user) return res.status(404).json({ message: "User not found" });
            if (!user.firstLogin)
                return res.status(400).json({ message: "Password already set" });

            user.password = await hashedpassword(password);
            user.firstLogin = false;
            await user.save();

            res.json({ message: "Password set successfully. You can now log in." });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async addDoctor(req, res) {
        try {
            const { name, email, password, specialization, location, degree, experience, about, fees, phone } = req.body;

            // Check duplicate email
            const existEmail = await doctorModel.findOne({ email });
            if (existEmail) {
                return res.status(403).json({
                    status: false,
                    message: "Email already exists",
                });
            }

            // Get role doctor
            const role = await Role.findOne({ name: "doctor" });
            if (!role) {
                return res.status(404).json({
                    status: false,
                    message: "Doctor role not found, please seed roles first",
                });
            }

            // Get specialization by name
            const specializationName = await Specializationmodel.findOne({ name: specialization });
            if (!specialization) {
                return res.status(404).json({
                    status: false,
                    message: `Specialization '${specialization}' not found`,
                });
            }

            // Create doctor
            const newDoctor = new doctorModel({
                name,
                email,
                password,
                phone,
                roleId: role._id,
                role: role.name,
                specializationId: specializationName._id,
                specialization: specializationName.name,
                location,
                degree,
                experience,
                about,
                fees,
            });

            if (req.file) {
                newDoctor.profileImg = req.file.path;
            }

            const data = await newDoctor.save();

            res.status(201).json({
                status: true,
                message: "Doctor created successfully",
                data,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }
    async deletedoctor(req, res) {
        try {
            const id = req.params.id
            await doctorModel.findOneAndDelete(id)
            res.status(200).json({
                status: true,
                message: 'Doctor profile Deleted Successfully',

            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,

            })
        }
    }

}
module.exports = new AdminController()