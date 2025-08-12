const express=require('express')
const doctorimageupload = require('../helper/doctorimageupload')
const AdminController = require('../controller/AdminController')
const { isAdmin, AuthCheck } = require('../middleware/AuthCheck')
const router=express.Router()
router.post('/create/doctor',doctorimageupload.single('profileImg'),AuthCheck,isAdmin,AdminController.adddoctor)
router.delete('/delete/doctor',AuthCheck,isAdmin,AdminController.deletedoctor)
module.exports=router