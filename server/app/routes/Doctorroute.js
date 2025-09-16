const express=require('express')
const DoctorController = require('../controller/DoctorController')
const { AuthCheck } = require('../middleware/AuthCheck')
const doctorimageupload = require('../helper/doctorimageupload')




const router=express.Router()
 /**
 * @swagger
 * /api/alldoctor:
 *  get:
 *    summary: Get all the all doctor from Database
 *    tags:
 *       - Doctor
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: data fetched successfully.
 */
router.get('/alldoctor',DoctorController.getAllDoctors)

router.post('/updateprofile/:id',doctorimageupload.single('profileImg'),DoctorController.updateDoctors)
router.get('/docterdashboard',AuthCheck,DoctorController.doctordashboard)
router.get('/docterprofile',AuthCheck,DoctorController.doctorprofile)
module.exports=router