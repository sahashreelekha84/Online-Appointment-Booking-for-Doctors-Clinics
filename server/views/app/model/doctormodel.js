const mongoose = require('mongoose')
const Schema = mongoose.Schema
const doctorSchema = new Schema({

    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImg: { type: String, default: "" },
    role:{type:String,default:'Doctor'},
    specialization: { type: String, required: true },
    degree:{ type: String, required: true },
    experience:{ type: String, required: true },
    about:{ type: String, required: true },
    fees:{ type: Number, required: true },
    location: { type: String, required: true },

    phone: { type: String, default: '0000000000' },

   

}, { timestamps: true })
const doctorModel = mongoose.model('doctor', doctorSchema)
module.exports = doctorModel