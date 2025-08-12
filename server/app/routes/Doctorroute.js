const express=require('express')
const DoctorController = require('../controller/DoctorController')
const { AuthCheck } = require('../middleware/AuthCheck')
const doctorimageupload = require('../helper/doctorimageupload')




const router=express.Router()

router.get('/alldoctor',DoctorController.getAllDoctors)
router.post('/updateprofile/:id',doctorimageupload.single('profileImg'),DoctorController.updateDoctors)
router.get('/docterdashboard',AuthCheck,DoctorController.doctordashboard)
router.get('/docterprofile',AuthCheck,DoctorController.doctorprofile)
module.exports=router