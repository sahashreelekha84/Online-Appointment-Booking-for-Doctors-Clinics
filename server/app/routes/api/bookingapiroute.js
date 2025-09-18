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
router.post("/create/book", AuthCheck, appointmentController.bookAppointment);
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
router.get("/patient/mypatient", AuthCheck, appointmentController.getMyAppointments);
/**
 * @swagger
 * /api/appointment/patient/reschedule/{id}:
 *   put:
 *     summary: Reschedule an appointment (Patient only)
 *     tags: [Appointment]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-25
 *               timeSlot:
 *                 type: string
 *                 example: "10:00 AM - 10:30 AM"
 *     responses:
 *       200:
 *         description: Appointment rescheduled
 *       400:
 *         description: Invalid input or doctor unavailable
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.put("/patient/reschedule/:id", AuthCheck, appointmentController.rescheduleAppointment);
/**
 * @swagger
 * /api/appointment/patient/cancel/{id}:
 *   put:
 *     summary: Cancel an appointment (Patient only)
 *     tags: [Appointment]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *     responses:
 *       200:
 *         description: Appointment cancelled
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.put("/patient/cancel/:id", AuthCheck, appointmentController.cancelAppointment);
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
router.get("/doctor/mydoctor", AuthCheck, appointmentController.getDoctorAppointments);
/**
 * @swagger
 * /api/appointment/doctor/confirm/{id}:
 *   put:
 *     summary: Doctor confirms an appointment
 *     tags: [Appointment]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Authentication token
 *     responses:
 *       200:
 *         description: Appointment confirmed
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.put(
  "/doctor/confirm/:id",
  AuthCheck,
  appointmentController.confirmAppointment
);

/**
 * @swagger
 * /api/appointment/doctor/cancel/{id}:
 *   put:
 *     summary: Doctor cancels an appointment
 *     tags: [Appointment]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.put(
  "/doctor/cancel/:id",
  AuthCheck,
  appointmentController.doctorCancelAppointment
);

/**
 * @swagger
 * /api/appointment/doctor/complete/{id}:
 *   put:
 *     summary: Doctor completes an appointment and optionally generates a report
 *     tags: [Appointment]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reportReason:
 *                 type: string
 *                 example: "Patient reported mild symptoms"
 *     responses:
 *       200:
 *         description: Appointment completed successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.put(
  "/doctor/complete/:id",
  AuthCheck,
  appointmentController.completeAppointment
);
module.exports = router;
