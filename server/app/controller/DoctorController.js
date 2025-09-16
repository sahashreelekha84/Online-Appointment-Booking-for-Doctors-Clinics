const doctorModel = require("../model/doctormodel");
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const Role = require("../model/role");
const { comparepassword } = require("../middleware/AuthCheck");
const Jwt = require('jsonwebtoken')
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
            console.log(req.body);

            const { email, password } = req.body
            const user = await doctorModel.findOne({ email })
            if (!user) {
                res.status(400).json({
                    status: false,
                    message: 'doctor not found',

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
                message: 'Doctor login successfully',
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
     async updateDoctors(req, res) {
        try {
            const id=req.params.id
            const existdoctor=await doctorModel.findById(id)
            if(!existdoctor){
                res.status(400).json({
                status:false,
                message: "Docters not found ",
                
            }) 
            } 
            let updatedata={...req.body}
            if(req.file){
                if(existdoctor.profileImg){
                     const oldImagePath = path.join(__dirname, '..', '..', existingDesigner.image);
                     console.log('__dirname',__dirname);
                     
                    fs.unlink(oldImagePath, (err) => {
                        if (err) {
                            console.error("Error deleting old image:", err);
                        } else {
                            console.log("Old image deleted successfully.");
                        }
                    });
                }
            }
            updatedata.profileImg=req.file.path
            console.log("New image uploaded and path added:", req.file.path);
            const updatedoctors = await doctorModel.findByIdAndUpdate(id, updatedata, {
                new: true,
            });
            res.status(200).json({
                status: true,
                message: " Docter profile updated Successfully",
                
                data: updatedoctors
            })
        }
        catch (error) {
            res.status(500).json({
                status: true,
                message: error.message,

            })
        }


    };
     async doctordashboard(req,res){
        try{
        res.status(200).json({
            status:true,
            message:'Welcome to Doctor dashboard ',
            data:req.user
        })
        }
        catch(error){
            res.status(500).json({
                status:false,
                message:error.message
            })
        }
    }
    async doctorprofile(req,res){
        try{
        res.status(200).json({
            status:true,
            message:'Doctor profile Fetched Successfully',
            data:req.user
        })
        }
        catch(error){
            res.status(500).json({
                status:false,
                message:error.message
            })
        }
    }
}
module.exports = new DoctorController()