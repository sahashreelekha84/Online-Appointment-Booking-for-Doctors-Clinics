const Review = require('../../model/Review');
const Appointment = require('../../model/appointmentmodel');

class ReviewController {

  // Patient submits review (after appointment completion)
  async createReview(req, res) {
    try {
      const { appointmentId, rating, comment, reportId } = req.body; // added reportId
      const patientId = req.user._id;

      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      if (appointment.patientId.toString() !== patientId.toString()) 
        return res.status(403).json({ message: "Not authorized" });
      if (appointment.status !== 'completed') 
        return res.status(400).json({ message: "Review allowed only after completion" });

      const review = await Review.create({
        appointmentId,
        patientId,
        doctorId: appointment.doctorId,
        reportId: reportId || null, // link to report if available
        rating,
        comment
      });

      res.status(201).json({ message: "Review submitted successfully", review });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Doctor/Admin: Get all reviews
  async getAllReviews(req, res) {
    try {
      const reviews = await Review.find()
        .populate('patientId', 'name email')
        .populate('doctorId', 'name email')
        .populate('reportId', 'reason status'); // populate report info
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Doctor/Admin: Get reviews for specific doctor
  async getDoctorReviews(req, res) {
    try {
      const { doctorId } = req.params;
      const reviews = await Review.find({ doctorId })
        .populate('patientId', 'name email')
        .populate('reportId', 'reason status');
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ReviewController();
