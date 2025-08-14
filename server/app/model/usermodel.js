const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Joi = require('joi');

const userschemaValidate = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Z][a-z]*\s[A-Z][a-z]*$/)
    .required()
    .messages({
      'string.pattern.base': 'Name must be two words with each starting with a capital letter.',
    }),

  email: Joi.string()
    .email()
    .pattern(/@(gmail\.com|yahoo\.com|yopmail\.com)$/)
    .required()
    .messages({
      'string.pattern.base': 'Email must be from gmail.com, yahoo.com, or yopmail.com.',
    }),

  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])[A-Za-z\d[^A-Za-z0-9]]{6,}$/
)
    .required()
    .messages({
      'string.pattern.base': 'Password must start with a letter, contain at least one number and one special character.',
    }),

  profileImg: Joi.string().optional(),

  role: Joi.string().valid('admin', 'Doctor', 'Patient').optional(),

  address: Joi.object({
    line1: Joi.string().allow(''),
    line2: Joi.string().allow(''),
  }).optional(),

  gender: Joi.string().valid('Male', 'Female', 'Other', 'Not Selected').optional(),

  dob: Joi.string().optional(),

  phone: Joi.string().pattern(/^\d{10}$/).optional(),
});
const userSchema=new Schema({

  name: {type:String,required:true},
  email: {type:String,required:true},
  password: {type:String,required:true},
  profileImg:{type:String,default:""},
  role:{type:String, enum: ['admin', 'Doctor', 'Patient'],default:'Patient'},
  address:{type:Object,default:{line1:'',line2:''}},
  gender:{type:String,default:"Not Selected"},
  dob:{type:String,default:"Not Selected"},
  phone:{type:String,default:'0000000000'},
    otp:{
         type:String,
          require:true
    },
    otpExpiry:{
        type:Date
    },



},{timestamps:true})
const userModel=mongoose.model('user',userSchema)
module.exports={userModel,userschemaValidate}
