const express = require("express");
const router = express.Router();
const {AuthCheck} = require("../../middleware/AuthCheck");
const appointmentController = require("../../controller/api/bookingApiController");

/**
 * @swagger
 * /api/appointment/create/book:
 *   post:
 *     summary: Book an appointment (Patient only)
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: 64f2a3bfa2d4c9c2b03d7b55
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-20
 *               timeSlot:
 *                 type: string
 *                 example: "10:00 AM - 10:30 AM"
 *             required:
 *               - doctorId
 *               - date
 *               - timeSlot
 *     responses:
 *       200:
 *         description: Appointment booked successfully
 *       400:
 *         description: Validation error or slot unavailable
 *       401:
 *         description: Unauthorized
 */
router.post("/appointment/create/book", AuthCheck, appointmentController.bookAppointment);

/**
 * @swagger
 * /api/appointment/patient/mypatient:
 *   get:
 *     summary: Get appointments of logged-in patient
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: List of patient appointments
 *       401:
 *         description: Unauthorized
 */
router.get("/appointment/patient/mypatient", AuthCheck, appointmentController.getMyAppointments);

/**
 * @swagger
 * /api/appointment/doctor/mydoctor:
 *   get:
 *     summary: Get appointments assigned to logged-in doctor
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: List of doctor appointments
 *       401:
 *         description: Unauthorized
 */
router.get("/appointment/doctor/mydoctor", AuthCheck, appointmentController.getDoctorAppointments);

module.exports = router;
