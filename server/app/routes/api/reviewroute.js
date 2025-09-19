const express = require('express');
const router = express.Router();
const ReviewController = require('../../controller/api/reviewController');
const { AuthCheck } = require('../../middleware/AuthCheck');

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Manage reviews after appointment completion
 */

/**
 * @swagger
 * /api/review:
 *   post:
 *     summary: Submit a review after appointment completion (patient only)
 *     tags: [Review]
 *     security:
 *       - Token: []
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
 *             required:
 *               - appointmentId
 *               - rating
 *               - comment
 *             properties:
 *               appointmentId:
 *                 type: string
 *                 example: "64f2a3bfa2d4c9c2b03d7b55"
 *                 description: The ID of the completed appointment
 *               reportId:
 *                 type: string
 *                 example: "64f2a3bfa2d4c9c2b03d7b66"
 *                 description: Optional: ID of the related report
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: Rating out of 5
 *               comment:
 *                 type: string
 *                 example: "Doctor was very helpful and attentive."
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Invalid input or appointment not completed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router.post(
  '/',
  AuthCheck, // must be logged in as patient
  ReviewController.createReview
);

/**
 * @swagger
 * /api/review:
 *   get:
 *     summary: Get all reviews (admin/doctor)
 *     tags: [Review]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: List of all reviews
 */
router.get(
  '/',
  AuthCheck, // only doctor/admin can access
  ReviewController.getAllReviews
);

/**
 * @swagger
 * /api/review/doctor/{doctorId}:
 *   get:
 *     summary: Get all reviews for a specific doctor (admin/doctor)
 *     tags: [Review]
 *     security:
 *       - Token: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         schema:
 *           type: string
 *         description: Your authentication token
 *     responses:
 *       200:
 *         description: List of reviews for the doctor
 */
router.get(
  '/doctor/:doctorId',
  AuthCheck, // only doctor/admin can access
  ReviewController.getDoctorReviews
);

module.exports = router;
