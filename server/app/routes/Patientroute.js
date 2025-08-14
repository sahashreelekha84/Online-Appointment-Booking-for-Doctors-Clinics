const express = require('express')
const pateintimageupload = require('../helper/patientimageupload')
const PatientController = require('../controller/PatientController')
const { AuthCheck } = require('../middleware/AuthCheck')



const router = express.Router()
/**
 * @swagger
 * /api/patient/register:
 *   post:
 *     summary: Create Account
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               profileImg:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               gender:
 *                 type: string
 *               dob:
 *                 type: string
 *                 description: Date of birth
 *     responses:
 *       200:
 *         description: Patient registered successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */


router.post('/patient/register', pateintimageupload.single('profileImg'), PatientController.register)
/**
 * @swagger
 * /api/patient/verifyemail:
 *   post:
 *     summary: Verify patient email with OTP
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Patient email verified successfully
 *       400:
 *         description: Invalid OTP or email
 *       500:
 *         description: Server error
 */

router.post('/patient/verifyemail', PatientController.verifyotp)
/**
 * @swagger
 * /api/patient/resendotp:
 *   post:
 *     summary: Resend Otp
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *              
 *     responses:
 *       200:
 *         description: resend otp in successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.post('/patient/resendotp', PatientController.resendotp)
/**
 * @swagger
 * /api/patient/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: SomePassword123!
 *     responses:
 *       200:
 *         description: Patient logged in successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.post('/patient/login', PatientController.login)
/**
 * @swagger
 * /api/patient/forgetpassword:
 *   post:
 *     summary: Forget_password
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *              
 *     responses:
 *       200:
 *         description: Email get  successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */

router.post('/patient/forgetpassword',PatientController.forgetpassword)
/**
 * @swagger
 * /api/patient/resetpassword/:token:
 *   post:
 *     summary: reset_password
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: SomePassword123!
 *     responses:
 *       200:
 *         description: resetpassword sent successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Server Error
 */
router.post('/patient/resetpassword/:token',PatientController.resetpassword)
/**
 * @swagger
 * /api/patient/dashboard:
 *   get:
 *     summary: Get patient Dashboard
 *     tags:
 *       - Patient
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

router.get('/patient/dashboard', AuthCheck, PatientController.dashboard)
/**
 * @swagger
 * /api/patient/profile:
 *   get:
 *     summary: Get patient profile
 *     tags:
 *       - Patient
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

router.get('/patient/profile', AuthCheck, PatientController.profile)
module.exports = router