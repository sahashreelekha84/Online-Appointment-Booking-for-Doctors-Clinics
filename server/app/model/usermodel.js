const mongoose=require('mongoose')
const Schema=mongoose.Schema
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



},{timestamps:true})
const userModel=mongoose.model('user',userSchema)
module.exports=userModel
