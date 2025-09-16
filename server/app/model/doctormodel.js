const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi');
const passwordSchema = Joi.object({

    password: Joi.string()
        .min(6)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])'))
        .required()
        .messages({
            'string.pattern.base': 'Password must start with a letter, contain at least one number and one special character.',
        }),


});
const doctorSchema = new Schema({

    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImg: { type: String, default: "" },
    role: { type: String },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    specializationId: { type: Schema.Types.ObjectId, ref: "Specialization", required: true },
    specialization: { type: String },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    fees: { type: Number, required: true },
    location: { type: String, required: true },
    firstLogin: { type: Boolean, default: true },
    phone: { type: String, default: '0000000000' },



}, { timestamps: true })
const doctorModel = mongoose.model('doctor', doctorSchema)
module.exports = { doctorModel, passwordSchema }