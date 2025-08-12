const express = require('express')
const pateintimageupload = require('../helper/patientimageupload')
const PatientController = require('../controller/PatientController')
const { AuthCheck } = require('../middleware/AuthCheck')



const router = express.Router()
/**
 * @swagger
 * /api/patient/register:
 *   post:
 *     summary: Create a patient account
 *     tags:
 *       - Auth
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password


               
 *             properties:
 *               profileImg:
 *                 type: string
 *                 format: binary
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
 *     responses:
 *       200:
 *         description: Patient registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router.post('/patient/register', pateintimageupload.single('profileImg'), PatientController.register)
router.post('/patient/login', PatientController.login)
router.get('/patient/dashboard', AuthCheck, PatientController.dashboard)
router.get('/patient/profile', AuthCheck, PatientController.profile)
module.exports = router