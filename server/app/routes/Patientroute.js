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
* /api/patient/login:
*   post:
*     summary: user Login
*     tags:
*       - Patient
*     produces:
*       - application/json
*     parameters:
 *      - in: body
 *        name: user Login
 *        description: Patient login create.
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
*     responses:
*        200:
*          description: Patient Login successfully
*        400:
*          description: Bad Request
*        500:
*          description: Server Error
*/

router.post('/patient/login', PatientController.login)
/**
  * @swagger
  * /api/patient/dashboard:
  *   get:
  *     summary: Patient dashboard
  *     tags:
  *       - Patient
  *     security:
  *       - Token: []
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Patient access this page
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Server Error
*/
router.get('/patient/dashboard', AuthCheck, PatientController.dashboard)
/**
  * @swagger
  * /api/patient/profile:
  *   get:
  *     summary: Patient profile
  *     tags:
  *       - Patient
  *     security:
  *       - Token: []
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Patient access this page
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Server Error
*/
router.get('/patient/profile', AuthCheck, PatientController.profile)
module.exports = router