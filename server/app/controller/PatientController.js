const { hashedpassword, comparepassword } = require("../middleware/AuthCheck")
const userModel = require("../model/usermodel")
const Jwt = require('jsonwebtoken')
const path = require('path')
class PatientController {
    async register(req, res) {
        console.log(req.body);
        
        try {
            const { name, email, password, address, gender, dob, phone,role } = req.body
            const existemail = await userModel.findOne({ email })
            if (existemail) {
                return res.status(403).json({
                    status: false,
                    message: 'email already exist',

                })
            }
            const hash = await hashedpassword(password)
            const pdata = new userModel({
                name, email, password: hash, address, gender, dob, phone, role
            })
            if (req.file) {
                pdata.profileImg = req.file.path
            }
            const data = await pdata.save()
            res.status(201).json({
                status: true,
                message: 'Registation Successfully',
                data: data

            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,

            })
        }
    }
    async login(req, res) {
        try {
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