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
/**
 * @swagger
 * /api/doctor/login:
 *   post:
 *     summary: Doctor Login
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: doctor@example.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

router.post('/doctor/login',DoctorController.login)
/**
 * @swagger
 * /api/doctor/change-password:
 *   post:
 *     summary: Set or Change Doctor Password
 *     tags:
 *       - Doctor
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token (JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewPass@123
 *     responses:
 *       200:
 *         description: Password set successfully
 *       400:
 *         description: Password already set or validation error
 *       404:
 *         description: User not found
 */

router.post('/doctor/change-password',AuthCheck,DoctorController.setPassword)
/**
 * @swagger
 * /api/updateprofile/{id}:
 *   post:
 *     summary: Update Doctor Profile
 *     tags:
 *       - Doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token (JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImg:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 example: Dr. John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "+91-9876543210"
 *               specialization:
 *                 type: string
 *                 example: Cardiology
 *               location:
 *                 type: string
 *                 example: New Delhi, India
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */

router.post('/updateprofile',AuthCheck,doctorimageupload.single('profileImg'),DoctorController.updateDoctors)
/**
 * @swagger
 * /api/docter/dashboard:
 *   get:
 *     summary: Get Doctor Dashboard
 *     tags:
 *       - Doctor
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

router.get('/docter/dashboard',AuthCheck,DoctorController.doctordashboard)
/**
 * @swagger
 * /api/doctor/profile:
 *   get:
 *     summary: Get Doctor profile
 *     tags:
 *       - Doctor
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */

router.get('/docter/profile',AuthCheck,DoctorController.doctorprofile)
/**
 * @swagger
 * /api/doctor/logout:
 *   post:
 *     summary: Doctor Logout
 *     tags:
 *       - Doctor
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */

router.post("/doctor/logout", AuthCheck, DoctorController.logout);
module.exports=router