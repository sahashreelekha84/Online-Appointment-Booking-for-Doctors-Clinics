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
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: profileImg
 *         type: file
 *         description: Profile image file
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *       - in: formData
 *         name: email
 *         type: string
 *         required: true
 *       - in: formData
 *         name: phone
 *         type: string
 *       - in: formData
 *         name: password
 *         type: string
 *         required: true
 *       - in: formData
 *         name: address
 *         type: string
 *       - in: formData
 *         name: gender
 *         type: string
 *       - in: formData
 *         name: dob
 *         type: string
 *         description: Date of birth
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
 *               - password
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