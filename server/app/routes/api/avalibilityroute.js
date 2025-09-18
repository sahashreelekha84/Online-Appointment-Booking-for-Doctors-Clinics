const express = require("express");
const router = express.Router();
const { AuthCheck } = require("../../middleware/AuthCheck");
const availabilityController = require("../../controller/api/availabilityController");

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Manage doctor availability and slots
 */

/**
 * @swagger
 * /api/availability/create:
 *   post:
 *     summary: Create availability for a doctor
 *     tags: [Availability]
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
 *               weekday:
 *                 type: string
 *                 example: Monday
 *               startHour:
 *                 type: integer
 *                 example: 9
 *               startMinute:
 *                 type: integer
 *                 example: 0
 *               endHour:
 *                 type: integer
 *                 example: 17
 *               endMinute:
 *                 type: integer
 *                 example: 0
 *               duration:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Availability created successfully
 *       400:
 *         description: Invalid input / Duplicate availability
 *       401:
 *         description: Unauthorized
 */
router.post("/create", AuthCheck, availabilityController.createAvailability);

/**
 * @swagger
 * /api/availability/doctor/{doctorId}:
 *   get:
 *     summary: Get availability by doctor ID
 *     tags: [Availability]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Availability list for doctor
 *       404:
 *         description: No availability found
 */
router.get("/doctor/:doctorId", AuthCheck, availabilityController.getAvailabilityByDoctor);

/**
 * @swagger
 * /api/availability/doctor/{doctorId}/dayoff:
 *   put:
 *     summary: Set a weekday as day off for doctor
 *     tags: [Availability]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekday:
 *                 type: string
 *                 example: Monday
 *               isDayOff:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Day off updated successfully
 *       404:
 *         description: Availability not found
 */
router.put("/doctor/:doctorId/dayoff", AuthCheck, availabilityController.setDayOff);

/**
 * @swagger
 * /api/availability:
 *   get:
 *     summary: Get all doctors availability
 *     tags: [Availability]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: List of all doctors availability
 */
router.get("/", AuthCheck, availabilityController.getAllAvailability);

/**
 * @swagger
 * /api/availability/doctor/{doctorId}/special-dayoff:
 *   post:
 *     summary: Add special day off for a doctor
 *     tags: [Availability]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekday:
 *                 type: string
 *                 example: Monday
 *               specialDay:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-25
 *     responses:
 *       200:
 *         description: Special day off added successfully
 *       400:
 *         description: Invalid date or already added
 *       404:
 *         description: Availability not found
 */
router.post("/doctor/:doctorId/special-dayoff", AuthCheck, availabilityController.addSpecialDayOff);

/**
 * @swagger
 * /api/availability/doctor/{doctorId}/special-dayoff:
 *   delete:
 *     summary: Delete a special day off for a doctor
 *     tags: [Availability]
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weekday:
 *                 type: string
 *                 example: Monday
 *               specialDay:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-25
 *     responses:
 *       200:
 *         description: Special day off deleted successfully
 *       404:
 *         description: Availability not found
 */
router.delete("/doctor/:doctorId/special-dayoff", AuthCheck, availabilityController.deleteSpecialDayOff);

module.exports = router;
