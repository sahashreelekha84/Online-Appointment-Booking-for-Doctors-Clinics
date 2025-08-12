const express=require('express')
const pateintimageupload = require('../helper/patientimageupload')
const PatientController = require('../controller/PatientController')
const { AuthCheck } = require('../middleware/AuthCheck')



const router=express.Router()
router.post('/patient/register',pateintimageupload.single('profileImg'),PatientController.register)
router.post('/patient/login',PatientController.login)
router.get('/patient/dashboard',AuthCheck,PatientController.dashboard)
router.get('/patient/profile',AuthCheck,PatientController.profile)
module.exports=router