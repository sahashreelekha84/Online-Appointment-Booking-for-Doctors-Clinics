const doctorModel = require("../model/doctormodel");
const path = require('path')

class AdminController {
    async adddoctor(req, res) {
        try {
            const { name, email, password, specialization, location, degree, experience, about, fees, phone,role } = req.body;

            const existemail = await doctorModel.findOne({ email })
            if (existemail) {
                res.status(403).json({
                    status: false,
                    message: 'email has already exist'
                })
            }


            const newDoctor = new doctorModel({
                name,
                email,
                password,
                phone,
                role,

                specialization,
                location,
                
                degree, experience, about, fees
            });
            if (req.file) {
                newDoctor.profileImg = req.file.path
            }
            const data = await newDoctor.save();
            res.status(201).json({
                status: true,
                message: 'Doctor created successfully',
                data: data
            });

        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            })
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